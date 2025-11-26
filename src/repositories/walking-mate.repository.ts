import { PrismaClient, WalkingMate, WalkingMateStatus, PetSizeFilter } from '@prisma/client';

const prisma = new PrismaClient();

// 산책 메이트 모집 생성
export const createWalkingMate = async (data: {
  hostUserId: bigint;
  routeId?: bigint;
  walkingDate: Date;
  location: string;
  latitude?: number;
  longitude?: number;
  duration?: number;
  maxParticipants?: number;
  petSizeFilter?: PetSizeFilter;
  description?: string;
}): Promise<WalkingMate> => {
  return prisma.walkingMate.create({
    data: {
      hostUserId: data.hostUserId,
      routeId: data.routeId,
      walkingDate: data.walkingDate,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      duration: data.duration,
      maxParticipants: data.maxParticipants ?? 5,
      currentParticipants: 1, // 호스트 포함
      petSizeFilter: data.petSizeFilter ?? 'ALL',
      description: data.description,
      status: 'OPEN',
    },
  });
};

// 산책 메이트 목록 조회
export const findWalkingMates = async (filters?: {
  status?: WalkingMateStatus;
  region?: string;
  walkingDate?: Date;
  petSizeFilter?: PetSizeFilter;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  limit?: number;
  offset?: number;
}) => {
  const where: any = {};

  if (filters?.status) {
    where.status = filters.status;
  }
  if (filters?.region) {
    where.location = { contains: filters.region };
  }
  if (filters?.walkingDate) {
    where.walkingDate = {
      gte: filters.walkingDate,
      lt: new Date(filters.walkingDate.getTime() + 24 * 60 * 60 * 1000),
    };
  }
  if (filters?.petSizeFilter && filters.petSizeFilter !== 'ALL') {
    where.petSizeFilter = { in: ['ALL', filters.petSizeFilter] };
  }

  // 위치 기반 검색
  if (filters?.latitude && filters?.longitude && filters?.radiusKm) {
    const latDelta = filters.radiusKm / 111;
    const lonDelta = filters.radiusKm / (111 * Math.cos((filters.latitude * Math.PI) / 180));

    where.latitude = {
      gte: filters.latitude - latDelta,
      lte: filters.latitude + latDelta,
    };
    where.longitude = {
      gte: filters.longitude - lonDelta,
      lte: filters.longitude + lonDelta,
    };
  }

  return prisma.walkingMate.findMany({
    where,
    include: {
      hostUser: {
        select: {
          id: true,
          username: true,
          name: true,
          profileImage: true,
          region: true,
        },
      },
      route: {
        select: {
          id: true,
          routeName: true,
          distance: true,
          difficulty: true,
        },
      },
      _count: {
        select: {
          participants: true,
          waitlist: true,
        },
      },
    },
    orderBy: [
      { walkingDate: 'asc' },
      { createdAt: 'desc' },
    ],
    take: filters?.limit,
    skip: filters?.offset,
  });
};

// 산책 메이트 상세 조회
export const findWalkingMateById = async (id: bigint) => {
  return prisma.walkingMate.findUnique({
    where: { id },
    include: {
      hostUser: {
        select: {
          id: true,
          username: true,
          name: true,
          profileImage: true,
          region: true,
          isPetOwner: true,
        },
      },
      route: {
        select: {
          id: true,
          routeName: true,
          region: true,
          distance: true,
          duration: true,
          difficulty: true,
          pathData: true,
        },
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              profileImage: true,
            },
          },
          walkingParticipantPets: {
            include: {
              pet: {
                select: {
                  id: true,
                  petName: true,
                  species: true,
                  size: true,
                  profileImage: true,
                },
              },
            },
          },
        },
        orderBy: {
          joinedAt: 'asc',
        },
      },
      waitlist: {
        where: { status: 'WAITING' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              profileImage: true,
            },
          },
        },
        orderBy: {
          priority: 'asc',
        },
      },
    },
  });
};

// 산책 메이트 수정
export const updateWalkingMate = async (
  id: bigint,
  data: Partial<{
    routeId: bigint;
    walkingDate: Date;
    location: string;
    latitude: number;
    longitude: number;
    duration: number;
    maxParticipants: number;
    currentParticipants: number;
    petSizeFilter: PetSizeFilter;
    description: string;
    status: WalkingMateStatus;
  }>
): Promise<WalkingMate> => {
  return prisma.walkingMate.update({
    where: { id },
    data,
  });
};

// 산책 메이트 삭제
export const deleteWalkingMate = async (id: bigint): Promise<WalkingMate> => {
  return prisma.walkingMate.delete({
    where: { id },
  });
};

// 호스트 확인
export const isWalkingMateHost = async (mateId: bigint, userId: bigint): Promise<boolean> => {
  const mate = await prisma.walkingMate.findUnique({
    where: { id: mateId },
    select: { hostUserId: true },
  });
  return mate?.hostUserId === userId;
};

// 현재 참가자 수 증가
export const incrementCurrentParticipants = async (mateId: bigint) => {
  return prisma.walkingMate.update({
    where: { id: mateId },
    data: {
      currentParticipants: {
        increment: 1,
      },
    },
  });
};

// 현재 참가자 수 감소
export const decrementCurrentParticipants = async (mateId: bigint) => {
  return prisma.walkingMate.update({
    where: { id: mateId },
    data: {
      currentParticipants: {
        decrement: 1,
      },
    },
  });
};

// 산책 메이트 개수 조회
export const countWalkingMates = async (filters?: {
  status?: WalkingMateStatus;
  region?: string;
}): Promise<number> => {
  const where: any = {};
  if (filters?.status) where.status = filters.status;
  if (filters?.region) where.location = { contains: filters.region };

  return prisma.walkingMate.count({ where });
};

