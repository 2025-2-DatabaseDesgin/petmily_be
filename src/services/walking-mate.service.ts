import { PrismaClient, WalkingMateStatus, PetSizeFilter } from '@prisma/client';
import {
  createWalkingMate,
  findWalkingMates,
  findWalkingMateById,
  updateWalkingMate,
  deleteWalkingMate,
  isWalkingMateHost,
  incrementCurrentParticipants,
  decrementCurrentParticipants,
  countWalkingMates,
} from '../repositories/walking-mate.repository';
import {
  createParticipant,
  findParticipantByMateAndUser,
  updateParticipantStatus,
  deleteParticipant,
  addParticipantPet,
  countAcceptedParticipants,
} from '../repositories/participant.repository';
import {
  createWaitlist,
  findWaitlistByMateAndUser,
  getNextPriority,
  updateWaitlistStatus,
  getNextWaitingUser,
} from '../repositories/waitlist.repository';
import { isPetOwner } from '../repositories/pet.repository';

const prisma = new PrismaClient();

// 산책 메이트 모집 생성
export const createWalkingMateService = async (
  hostUserId: bigint,
  data: {
    routeId?: bigint;
    walkingDate: Date;
    location: string;
    latitude?: number;
    longitude?: number;
    duration?: number;
    maxParticipants?: number;
    petSizeFilter?: PetSizeFilter;
    description?: string;
  }
) => {
  return createWalkingMate({
    hostUserId,
    ...data,
  });
};

// 산책 메이트 목록 조회
export const getWalkingMatesService = async (filters?: {
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
  const mates = await findWalkingMates(filters);
  const totalCount = await countWalkingMates({
    status: filters?.status,
    region: filters?.region,
  });

  return {
    mates,
    totalCount,
  };
};

// 산책 메이트 상세 조회
export const getWalkingMateDetailService = async (mateId: bigint) => {
  const mate = await findWalkingMateById(mateId);
  if (!mate) {
    throw Object.assign(new Error('Walking mate not found'), { statusCode: 404 });
  }
  return mate;
};

// 산책 메이트 수정
export const updateWalkingMateService = async (
  mateId: bigint,
  userId: bigint,
  data: Partial<{
    routeId: bigint;
    walkingDate: Date;
    location: string;
    latitude: number;
    longitude: number;
    duration: number;
    maxParticipants: number;
    petSizeFilter: PetSizeFilter;
    description: string;
  }>
) => {
  // 호스트 확인
  const isHost = await isWalkingMateHost(mateId, userId);
  if (!isHost) {
    throw Object.assign(new Error('Not authorized to update this walking mate'), { statusCode: 403 });
  }

  return updateWalkingMate(mateId, data);
};

// 산책 메이트 삭제
export const deleteWalkingMateService = async (mateId: bigint, userId: bigint) => {
  // 호스트 확인
  const isHost = await isWalkingMateHost(mateId, userId);
  if (!isHost) {
    throw Object.assign(new Error('Not authorized to delete this walking mate'), { statusCode: 403 });
  }

  return deleteWalkingMate(mateId);
};

// 산책 메이트 참가 신청
export const joinWalkingMateService = async (
  mateId: bigint,
  userId: bigint,
  petIds: bigint[]
) => {
  return await prisma.$transaction(async (tx) => {
    // 모집 정보 조회
    const mate = await tx.walkingMate.findUnique({
      where: { id: mateId },
    });

    if (!mate) {
      throw Object.assign(new Error('Walking mate not found'), { statusCode: 404 });
    }

    // 호스트 본인 참가 방지
    if (mate.hostUserId === userId) {
      throw Object.assign(new Error('Host cannot join their own walking mate'), { statusCode: 400 });
    }

    // 이미 참가했는지 확인
    const existingParticipant = await tx.walkingParticipant.findUnique({
      where: {
        mateId_userId: {
          mateId,
          userId,
        },
      },
    });

    if (existingParticipant) {
      throw Object.assign(new Error('Already joined this walking mate'), { statusCode: 409 });
    }

    // 대기열에 이미 있는지 확인
    const existingWaitlist = await tx.walkingWaitlist.findUnique({
      where: {
        mateId_userId: {
          mateId,
          userId,
        },
      },
    });

    if (existingWaitlist) {
      throw Object.assign(new Error('Already in waitlist'), { statusCode: 409 });
    }

    // 반려동물 소유 확인
    for (const petId of petIds) {
      const isOwner = await isPetOwner(petId, userId);
      if (!isOwner) {
        throw Object.assign(new Error(`Not authorized for pet ${petId}`), { statusCode: 403 });
      }
    }

    // 정원 확인
    if (mate.currentParticipants >= mate.maxParticipants) {
      // 대기열에 추가
      const priority = await getNextPriority(mateId);
      const waitlist = await tx.walkingWaitlist.create({
        data: {
          mateId,
          userId,
          priority,
          status: 'WAITING',
        },
      });

      return {
        type: 'waitlist',
        waitlist,
      };
    }

    // 참가자로 등록
    const participant = await tx.walkingParticipant.create({
      data: {
        mateId,
        userId,
        status: 'PENDING', // 호스트 승인 필요
      },
    });

    // 반려동물 등록
    for (const petId of petIds) {
      await tx.walkingParticipantPet.create({
        data: {
          participantId: participant.id,
          petId,
        },
      });
    }

    return {
      type: 'participant',
      participant,
    };
  });
};

// 참가 취소
export const leaveWalkingMateService = async (mateId: bigint, userId: bigint) => {
  return await prisma.$transaction(async (tx) => {
    // 참가자 확인
    const participant = await tx.walkingParticipant.findUnique({
      where: {
        mateId_userId: {
          mateId,
          userId,
        },
      },
    });

    if (!participant) {
      throw Object.assign(new Error('Not a participant'), { statusCode: 404 });
    }

    // 참가자 삭제
    await tx.walkingParticipant.delete({
      where: { id: participant.id },
    });

    // 승인된 참가자였다면 현재 참가자 수 감소
    if (participant.status === 'ACCEPTED') {
      await tx.walkingMate.update({
        where: { id: mateId },
        data: {
          currentParticipants: {
            decrement: 1,
          },
        },
      });

      // 대기열에서 다음 사용자 승격
      await promoteNextWaitingUser(mateId, tx);
    }

    return { success: true };
  });
};

// 참가 승인
export const approveParticipantService = async (
  participantId: bigint,
  hostUserId: bigint
) => {
  return await prisma.$transaction(async (tx) => {
    const participant = await tx.walkingParticipant.findUnique({
      where: { id: participantId },
      include: { mate: true },
    });

    if (!participant) {
      throw Object.assign(new Error('Participant not found'), { statusCode: 404 });
    }

    // 호스트 확인
    if (participant.mate.hostUserId !== hostUserId) {
      throw Object.assign(new Error('Not authorized'), { statusCode: 403 });
    }

    // 상태 업데이트
    const updated = await tx.walkingParticipant.update({
      where: { id: participantId },
      data: { status: 'ACCEPTED' },
    });

    // 현재 참가자 수 증가
    await tx.walkingMate.update({
      where: { id: participant.mateId },
      data: {
        currentParticipants: {
          increment: 1,
        },
      },
    });

    // 정원 확인 및 상태 업데이트
    const mate = await tx.walkingMate.findUnique({
      where: { id: participant.mateId },
    });

    if (mate && mate.currentParticipants >= mate.maxParticipants) {
      await tx.walkingMate.update({
        where: { id: participant.mateId },
        data: { status: 'FULL' },
      });
    }

    return updated;
  });
};

// 참가 거절
export const rejectParticipantService = async (
  participantId: bigint,
  hostUserId: bigint
) => {
  const participant = await findParticipantByMateAndUser;
  
  return await prisma.$transaction(async (tx) => {
    const participant = await tx.walkingParticipant.findUnique({
      where: { id: participantId },
      include: { mate: true },
    });

    if (!participant) {
      throw Object.assign(new Error('Participant not found'), { statusCode: 404 });
    }

    // 호스트 확인
    if (participant.mate.hostUserId !== hostUserId) {
      throw Object.assign(new Error('Not authorized'), { statusCode: 403 });
    }

    // 상태 업데이트
    return await tx.walkingParticipant.update({
      where: { id: participantId },
      data: { status: 'REJECTED' },
    });
  });
};

// 대기열에서 다음 사용자 승격 (내부 함수)
const promoteNextWaitingUser = async (mateId: bigint, tx: any) => {
  const waitingUsers = await tx.walkingWaitlist.findMany({
    where: {
      mateId,
      status: 'WAITING',
    },
    orderBy: {
      priority: 'asc',
    },
    take: 1,
  });

  if (waitingUsers.length === 0) {
    return null;
  }

  const nextUser = waitingUsers[0];

  // 참가자로 등록
  await tx.walkingParticipant.create({
    data: {
      mateId,
      userId: nextUser.userId,
      status: 'ACCEPTED',
    },
  });

  // 대기열 상태 업데이트
  await tx.walkingWaitlist.update({
    where: { id: nextUser.id },
    data: { status: 'MOVED' },
  });

  // 현재 참가자 수 증가
  await tx.walkingMate.update({
    where: { id: mateId },
    data: {
      currentParticipants: {
        increment: 1,
      },
    },
  });

  return nextUser;
};

// 대기 취소
export const cancelWaitlistService = async (waitlistId: bigint, userId: bigint) => {
  const waitlist = await prisma.walkingWaitlist.findUnique({
    where: { id: waitlistId },
  });

  if (!waitlist) {
    throw Object.assign(new Error('Waitlist entry not found'), { statusCode: 404 });
  }

  if (waitlist.userId !== userId) {
    throw Object.assign(new Error('Not authorized'), { statusCode: 403 });
  }

  return updateWaitlistStatus(waitlistId, 'CANCELLED');
};

