import { PrismaClient, WalkingSession } from '@prisma/client';

const prisma = new PrismaClient();

// 산책 세션 생성
export const createSession = async (data: {
  mateId: bigint;
  startedAt?: Date;
  endedAt?: Date;
  actualDistanceM?: number;
  actualDurationS?: number;
  pathData?: string;
  participantCount?: number;
  totalPets?: number;
}): Promise<WalkingSession> => {
  return prisma.walkingSession.create({
    data: {
      mateId: data.mateId,
      startedAt: data.startedAt,
      endedAt: data.endedAt,
      actualDistanceM: data.actualDistanceM,
      actualDurationS: data.actualDurationS,
      pathData: data.pathData,
      participantCount: data.participantCount,
      totalPets: data.totalPets,
    },
  });
};

// 산책 세션 조회
export const findSessionById = async (id: bigint) => {
  return prisma.walkingSession.findUnique({
    where: { id },
    include: {
      mate: {
        include: {
          hostUser: {
            select: {
              id: true,
              username: true,
              name: true,
              profileImage: true,
            },
          },
          route: {
            select: {
              id: true,
              routeName: true,
              region: true,
            },
          },
          participants: {
            where: { status: 'ACCEPTED' },
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
                    },
                  },
                },
              },
            },
          },
        },
      },
      walkingReviews: {
        include: {
          reviewer: {
            select: {
              id: true,
              username: true,
              name: true,
              profileImage: true,
            },
          },
        },
      },
    },
  });
};

// 산책 세션 목록 조회
export const findSessions = async (filters?: {
  mateId?: bigint;
  userId?: bigint;
  limit?: number;
  offset?: number;
}) => {
  const where: any = {};

  if (filters?.mateId) {
    where.mateId = filters.mateId;
  }

  if (filters?.userId) {
    where.mate = {
      OR: [
        { hostUserId: filters.userId },
        {
          participants: {
            some: {
              userId: filters.userId,
              status: 'ACCEPTED',
            },
          },
        },
      ],
    };
  }

  return prisma.walkingSession.findMany({
    where,
    include: {
      mate: {
        select: {
          id: true,
          location: true,
          walkingDate: true,
          hostUser: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      startedAt: 'desc',
    },
    take: filters?.limit,
    skip: filters?.offset,
  });
};

// 산책 세션 수정
export const updateSession = async (
  id: bigint,
  data: Partial<{
    startedAt: Date;
    endedAt: Date;
    actualDistanceM: number;
    actualDurationS: number;
    pathData: string;
    participantCount: number;
    totalPets: number;
  }>
): Promise<WalkingSession> => {
  return prisma.walkingSession.update({
    where: { id },
    data,
  });
};

// 산책 세션 삭제
export const deleteSession = async (id: bigint): Promise<WalkingSession> => {
  return prisma.walkingSession.delete({
    where: { id },
  });
};

