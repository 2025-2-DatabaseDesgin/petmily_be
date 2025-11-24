import { PrismaClient, WalkingRoute, RouteDifficulty } from '@prisma/client';

const prisma = new PrismaClient();

// 산책로 생성
export const createRoute = async (data: {
  createdBy?: bigint;
  routeName: string;
  region?: string;
  distance?: number;
  duration?: number;
  difficulty?: RouteDifficulty;
  pathData?: string;
  description?: string;
}): Promise<WalkingRoute> => {
  return prisma.walkingRoute.create({
    data: {
      createdBy: data.createdBy,
      routeName: data.routeName,
      region: data.region,
      distance: data.distance,
      duration: data.duration,
      difficulty: data.difficulty,
      pathData: data.pathData,
      description: data.description,
    },
  });
};

// 산책로 목록 조회
export const findRoutes = async (filters?: {
  region?: string;
  difficulty?: RouteDifficulty;
  minDistance?: number;
  maxDistance?: number;
  minDuration?: number;
  maxDuration?: number;
  limit?: number;
  offset?: number;
}) => {
  const where: any = {};

  if (filters?.region) {
    where.region = { contains: filters.region };
  }
  if (filters?.difficulty) {
    where.difficulty = filters.difficulty;
  }
  if (filters?.minDistance || filters?.maxDistance) {
    where.distance = {};
    if (filters.minDistance) where.distance.gte = filters.minDistance;
    if (filters.maxDistance) where.distance.lte = filters.maxDistance;
  }
  if (filters?.minDuration || filters?.maxDuration) {
    where.duration = {};
    if (filters.minDuration) where.duration.gte = filters.minDuration;
    if (filters.maxDuration) where.duration.lte = filters.maxDuration;
  }

  return prisma.walkingRoute.findMany({
    where,
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          name: true,
        },
      },
      _count: {
        select: {
          walkingMates: true,
        },
      },
    },
    orderBy: [
      { rating: 'desc' },
      { reviewCount: 'desc' },
    ],
    take: filters?.limit,
    skip: filters?.offset,
  });
};

// 산책로 상세 조회
export const findRouteById = async (id: bigint) => {
  return prisma.walkingRoute.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          name: true,
          profileImage: true,
        },
      },
      facilityRoutes: {
        include: {
          facility: true,
        },
        orderBy: {
          visitOrder: 'asc',
        },
      },
      _count: {
        select: {
          walkingMates: true,
        },
      },
    },
  });
};

// 산책로 수정
export const updateRoute = async (
  id: bigint,
  data: Partial<{
    routeName: string;
    region: string;
    distance: number;
    duration: number;
    difficulty: RouteDifficulty;
    pathData: string;
    description: string;
  }>
): Promise<WalkingRoute> => {
  return prisma.walkingRoute.update({
    where: { id },
    data,
  });
};

// 산책로 삭제
export const deleteRoute = async (id: bigint): Promise<WalkingRoute> => {
  return prisma.walkingRoute.delete({
    where: { id },
  });
};

// 산책로 평점 업데이트
export const updateRouteRating = async (id: bigint, rating: number, reviewCount: number) => {
  return prisma.walkingRoute.update({
    where: { id },
    data: {
      rating,
      reviewCount,
    },
  });
};

// 산책로 생성자 확인
export const isRouteCreator = async (routeId: bigint, userId: bigint): Promise<boolean> => {
  const route = await prisma.walkingRoute.findUnique({
    where: { id: routeId },
    select: { createdBy: true },
  });
  return route?.createdBy === userId;
};

// 산책로 개수 조회
export const countRoutes = async (filters?: {
  region?: string;
  difficulty?: RouteDifficulty;
}): Promise<number> => {
  const where: any = {};
  if (filters?.region) where.region = { contains: filters.region };
  if (filters?.difficulty) where.difficulty = filters.difficulty;

  return prisma.walkingRoute.count({ where });
};

