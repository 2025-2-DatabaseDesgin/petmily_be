import { PrismaClient, Follow } from '@prisma/client';

const prisma = new PrismaClient();

// 팔로우 생성
export const createFollow = async (followerId: bigint, followingId: bigint): Promise<Follow> => {
  return prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });
};

// 팔로우 삭제 (언팔로우)
export const deleteFollow = async (followerId: bigint, followingId: bigint): Promise<Follow | null> => {
  try {
    return await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return null; // 팔로우 관계가 존재하지 않음
    }
    throw error;
  }
};

// 팔로우 관계 확인
export const isFollowing = async (followerId: bigint, followingId: bigint): Promise<boolean> => {
  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });
  return !!follow;
};

// 팔로워 목록 조회 (나를 팔로우하는 사람들)
export const findFollowers = async (userId: bigint, limit?: number, offset?: number) => {
  return prisma.follow.findMany({
    where: {
      followingId: userId,
    },
    include: {
      follower: {
        select: {
          id: true,
          username: true,
          name: true,
          profileImage: true,
          region: true,
          isPetOwner: true,
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

// 팔로잉 목록 조회 (내가 팔로우하는 사람들)
export const findFollowing = async (userId: bigint, limit?: number, offset?: number) => {
  return prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    include: {
      following: {
        select: {
          id: true,
          username: true,
          name: true,
          profileImage: true,
          region: true,
          isPetOwner: true,
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

// 팔로워 수 조회
export const countFollowers = async (userId: bigint): Promise<number> => {
  return prisma.follow.count({
    where: {
      followingId: userId,
    },
  });
};

// 팔로잉 수 조회
export const countFollowing = async (userId: bigint): Promise<number> => {
  return prisma.follow.count({
    where: {
      followerId: userId,
    },
  });
};

// 상호 팔로우 확인
export const isMutualFollow = async (userId1: bigint, userId2: bigint): Promise<boolean> => {
  const follow1 = await isFollowing(userId1, userId2);
  const follow2 = await isFollowing(userId2, userId1);
  return follow1 && follow2;
};

