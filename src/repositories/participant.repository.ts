import { PrismaClient, WalkingParticipant, WalkingParticipantStatus } from '@prisma/client';

const prisma = new PrismaClient();

// 참가 신청
export const createParticipant = async (data: {
  mateId: bigint;
  userId: bigint;
  status?: WalkingParticipantStatus;
}): Promise<WalkingParticipant> => {
  return prisma.walkingParticipant.create({
    data: {
      mateId: data.mateId,
      userId: data.userId,
      status: data.status ?? 'PENDING',
    },
  });
};

// 참가자 조회
export const findParticipantById = async (id: bigint) => {
  return prisma.walkingParticipant.findUnique({
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
      walkingParticipantPets: {
        include: {
          pet: true,
        },
      },
    },
  });
};

// 특정 모집의 참가자 목록
export const findParticipantsByMateId = async (mateId: bigint) => {
  return prisma.walkingParticipant.findMany({
    where: { mateId },
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
  });
};

// 사용자가 특정 모집에 참가했는지 확인
export const findParticipantByMateAndUser = async (mateId: bigint, userId: bigint) => {
  return prisma.walkingParticipant.findUnique({
    where: {
      mateId_userId: {
        mateId,
        userId,
      },
    },
  });
};

// 참가 상태 업데이트
export const updateParticipantStatus = async (
  id: bigint,
  status: WalkingParticipantStatus
): Promise<WalkingParticipant> => {
  return prisma.walkingParticipant.update({
    where: { id },
    data: { status },
  });
};

// 참가 취소 (삭제)
export const deleteParticipant = async (id: bigint): Promise<WalkingParticipant> => {
  return prisma.walkingParticipant.delete({
    where: { id },
  });
};

// 참가자의 반려동물 추가
export const addParticipantPet = async (participantId: bigint, petId: bigint) => {
  return prisma.walkingParticipantPet.create({
    data: {
      participantId,
      petId,
    },
  });
};

// 참가자의 반려동물 제거
export const removeParticipantPet = async (participantId: bigint, petId: bigint) => {
  return prisma.walkingParticipantPet.delete({
    where: {
      participantId_petId: {
        participantId,
        petId,
      },
    },
  });
};

// 참가자의 반려동물 목록 조회
export const findParticipantPets = async (participantId: bigint) => {
  return prisma.walkingParticipantPet.findMany({
    where: { participantId },
    include: {
      pet: true,
    },
  });
};

// 승인된 참가자 수 조회
export const countAcceptedParticipants = async (mateId: bigint): Promise<number> => {
  return prisma.walkingParticipant.count({
    where: {
      mateId,
      status: 'ACCEPTED',
    },
  });
};

