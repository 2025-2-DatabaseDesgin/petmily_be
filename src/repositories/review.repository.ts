import { PrismaClient, WalkingReview } from '@prisma/client';

const prisma = new PrismaClient();

// 후기 생성
export const createReview = async (data: {
  sessionId: bigint;
  reviewerId: bigint;
  overallRating: number;
  routeRating?: number;
  groupRating?: number;
  walkingDate: Date;
  distance?: number;
  duration?: number;
  notes?: string;
  photoUrls?: any;
  isPublic?: boolean;
}): Promise<WalkingReview> => {
  return prisma.walkingReview.create({
    data: {
      sessionId: data.sessionId,
      reviewerId: data.reviewerId,
      overallRating: data.overallRating,
      routeRating: data.routeRating,
      groupRating: data.groupRating,
      walkingDate: data.walkingDate,
      distance: data.distance,
      duration: data.duration,
      notes: data.notes,
      photoUrls: data.photoUrls,
      isPublic: data.isPublic ?? true,
    },
  });
};

// 후기 조회
export const findReviewById = async (id: bigint) => {
  return prisma.walkingReview.findUnique({
    where: { id },
    include: {
      reviewer: {
        select: {
          id: true,
          username: true,
          name: true,
          profileImage: true,
        },
      },
      session: {
        include: {
          mate: {
            select: {
              id: true,
              location: true,
              walkingDate: true,
              route: {
                select: {
                  id: true,
                  routeName: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

// 세션의 후기 목록 조회
export const findReviewsBySessionId = async (sessionId: bigint) => {
  return prisma.walkingReview.findMany({
    where: {
      sessionId,
      isPublic: true,
    },
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
    orderBy: {
      createdAt: 'desc',
    },
  });
};

// 산책로의 후기 목록 조회
export const findReviewsByRouteId = async (routeId: bigint, limit?: number, offset?: number) => {
  return prisma.walkingReview.findMany({
    where: {
      isPublic: true,
      session: {
        mate: {
          routeId,
        },
      },
    },
    include: {
      reviewer: {
        select: {
          id: true,
          username: true,
          name: true,
          profileImage: true,
        },
      },
      session: {
        select: {
          id: true,
          startedAt: true,
          endedAt: true,
        },
      },
    },
    orderBy: {
      overallRating: 'desc',
    },
    take: limit,
    skip: offset,
  });
};

// 사용자의 후기 목록 조회
export const findReviewsByUserId = async (userId: bigint, limit?: number, offset?: number) => {
  return prisma.walkingReview.findMany({
    where: {
      reviewerId: userId,
    },
    include: {
      session: {
        include: {
          mate: {
            select: {
              id: true,
              location: true,
              walkingDate: true,
              route: {
                select: {
                  id: true,
                  routeName: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: offset,
  });
};

// 후기 수정
export const updateReview = async (
  id: bigint,
  data: Partial<{
    overallRating: number;
    routeRating: number;
    groupRating: number;
    distance: number;
    duration: number;
    notes: string;
    photoUrls: any;
    isPublic: boolean;
  }>
): Promise<WalkingReview> => {
  return prisma.walkingReview.update({
    where: { id },
    data,
  });
};

// 후기 삭제
export const deleteReview = async (id: bigint): Promise<WalkingReview> => {
  return prisma.walkingReview.delete({
    where: { id },
  });
};

// 산책로 평균 평점 계산
export const calculateRouteAverageRating = async (routeId: bigint) => {
  const result = await prisma.walkingReview.aggregate({
    where: {
      session: {
        mate: {
          routeId,
        },
      },
      routeRating: {
        not: null,
      },
    },
    _avg: {
      routeRating: true,
    },
    _count: {
      id: true,
    },
  });

  return {
    averageRating: result._avg.routeRating ?? 0,
    reviewCount: result._count.id,
  };
};

