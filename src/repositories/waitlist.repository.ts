import { PrismaClient, WalkingWaitlist, WaitlistStatus } from '@prisma/client';

const prisma = new PrismaClient();

// 대기열 추가
export const createWaitlist = async (data: {
  mateId: bigint;
  userId: bigint;
  priority: number;
}): Promise<WalkingWaitlist> => {
  return prisma.walkingWaitlist.create({
    data: {
      mateId: data.mateId,
      userId: data.userId,
      priority: data.priority,
      status: 'WAITING',
    },
  });
};

// 대기열 조회
export const findWaitlistById = async (id: bigint) => {
  return prisma.walkingWaitlist.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          profileImage: true,
        },
      },
      mate: true,
    },
  });
};

// 특정 모집의 대기열 목록
export const findWaitlistByMateId = async (mateId: bigint) => {
  return prisma.walkingWaitlist.findMany({
    where: {
      mateId,
      status: 'WAITING',
    },
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
  });
};

// 사용자가 특정 모집 대기열에 있는지 확인
export const findWaitlistByMateAndUser = async (mateId: bigint, userId: bigint) => {
  return prisma.walkingWaitlist.findUnique({
    where: {
      mateId_userId: {
        mateId,
        userId,
      },
    },
  });
};

// 다음 대기자 조회 (FOR UPDATE - 동시성 제어)
export const getNextWaitingUser = async (mateId: bigint) => {
  // 트랜잭션 내에서 사용해야 함
  return prisma.$queryRaw<WalkingWaitlist[]>`
    SELECT * FROM walking_waitlist
    WHERE mate_id = ${mateId} AND status = 'WAITING'
    ORDER BY priority ASC
    LIMIT 1
    FOR UPDATE
  `;
};

// 대기열 상태 업데이트
export const updateWaitlistStatus = async (
  id: bigint,
  status: WaitlistStatus
): Promise<WalkingWaitlist> => {
  return prisma.walkingWaitlist.update({
    where: { id },
    data: { status },
  });
};

// 대기열 삭제
export const deleteWaitlist = async (id: bigint): Promise<WalkingWaitlist> => {
  return prisma.walkingWaitlist.delete({
    where: { id },
  });
};

// 다음 우선순위 번호 조회
export const getNextPriority = async (mateId: bigint): Promise<number> => {
  const result = await prisma.walkingWaitlist.aggregate({
    where: { mateId },
    _max: {
      priority: true,
    },
  });
  return (result._max.priority ?? 0) + 1;
};

// 대기열 개수 조회
export const countWaitlist = async (mateId: bigint): Promise<number> => {
  return prisma.walkingWaitlist.count({
    where: {
      mateId,
      status: 'WAITING',
    },
  });
};

