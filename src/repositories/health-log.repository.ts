import { PrismaClient, PetWalkingHealthLog, PetCondition, HydrationLevel } from '@prisma/client';

const prisma = new PrismaClient();

// 건강 로그 생성
export const createHealthLog = async (data: {
  participantPetId: bigint;
  preWeight?: number;
  preCondition?: PetCondition;
  distanceM?: number;
  durationS?: number;
  avgSpeedMps?: number;
  maxSpeedMps?: number;
  caloriesBurned?: number;
  stepCount?: number;
  postCondition?: PetCondition;
  needsRest?: boolean;
  hydrationLevel?: HydrationLevel;
  notes?: string;
}): Promise<PetWalkingHealthLog> => {
  return prisma.petWalkingHealthLog.create({
    data: {
      participantPetId: data.participantPetId,
      preWeight: data.preWeight,
      preCondition: data.preCondition,
      distanceM: data.distanceM,
      durationS: data.durationS,
      avgSpeedMps: data.avgSpeedMps,
      maxSpeedMps: data.maxSpeedMps,
      caloriesBurned: data.caloriesBurned,
      stepCount: data.stepCount,
      postCondition: data.postCondition,
      needsRest: data.needsRest ?? false,
      hydrationLevel: data.hydrationLevel,
      notes: data.notes,
    },
  });
};

// 건강 로그 조회
export const findHealthLogById = async (id: bigint) => {
  return prisma.petWalkingHealthLog.findUnique({
    where: { id },
    include: {
      participantPet: {
        include: {
          pet: true,
          participant: {
            include: {
              mate: {
                select: {
                  id: true,
                  location: true,
                  walkingDate: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

// 반려동물의 건강 로그 목록 조회
export const findHealthLogsByPetId = async (petId: bigint, limit?: number, offset?: number) => {
  return prisma.petWalkingHealthLog.findMany({
    where: {
      participantPet: {
        petId,
      },
    },
    include: {
      participantPet: {
        include: {
          participant: {
            include: {
              mate: {
                select: {
                  id: true,
                  location: true,
                  walkingDate: true,
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

// 건강 로그 수정
export const updateHealthLog = async (
  id: bigint,
  data: Partial<{
    preWeight: number;
    preCondition: PetCondition;
    distanceM: number;
    durationS: number;
    avgSpeedMps: number;
    maxSpeedMps: number;
    caloriesBurned: number;
    stepCount: number;
    postCondition: PetCondition;
    needsRest: boolean;
    hydrationLevel: HydrationLevel;
    notes: string;
  }>
): Promise<PetWalkingHealthLog> => {
  return prisma.petWalkingHealthLog.update({
    where: { id },
    data,
  });
};

// 건강 로그 삭제
export const deleteHealthLog = async (id: bigint): Promise<PetWalkingHealthLog> => {
  return prisma.petWalkingHealthLog.delete({
    where: { id },
  });
};

// 참가 반려동물의 건강 로그 조회
export const findHealthLogByParticipantPetId = async (participantPetId: bigint) => {
  return prisma.petWalkingHealthLog.findUnique({
    where: { participantPetId },
  });
};

