import { PetCondition, HydrationLevel } from '@prisma/client';
import {
  createHealthLog,
  findHealthLogById,
  findHealthLogsByPetId,
  updateHealthLog,
  deleteHealthLog,
  findHealthLogByParticipantPetId,
} from '../repositories/health-log.repository';
import { isPetOwner } from '../repositories/pet.repository';
import { findParticipantById } from '../repositories/participant.repository';

// 건강 로그 생성
export const createHealthLogService = async (
  participantPetId: bigint,
  userId: bigint,
  data: {
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
  }
) => {
  // 참가자 정보 조회 및 권한 확인
  const participantPet = await prisma.walkingParticipantPet.findUnique({
    where: { id: participantPetId },
    include: {
      pet: true,
      participant: true,
    },
  });

  if (!participantPet) {
    throw Object.assign(new Error('Participant pet not found'), { statusCode: 404 });
  }

  // 반려동물 소유자 확인
  const isOwner = await isPetOwner(participantPet.petId, userId);
  if (!isOwner) {
    throw Object.assign(new Error('Not authorized'), { statusCode: 403 });
  }

  return createHealthLog({
    participantPetId,
    ...data,
  });
};

// 건강 로그 조회
export const getHealthLogDetailService = async (logId: bigint) => {
  const log = await findHealthLogById(logId);
  if (!log) {
    throw Object.assign(new Error('Health log not found'), { statusCode: 404 });
  }
  return log;
};

// 반려동물의 건강 로그 목록 조회
export const getPetHealthLogsService = async (petId: bigint, limit?: number, offset?: number) => {
  return findHealthLogsByPetId(petId, limit, offset);
};

// 건강 로그 수정
export const updateHealthLogService = async (
  logId: bigint,
  userId: bigint,
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
) => {
  const log = await findHealthLogById(logId);
  if (!log) {
    throw Object.assign(new Error('Health log not found'), { statusCode: 404 });
  }

  // 반려동물 소유자 확인
  const isOwner = await isPetOwner(log.participantPet.petId, userId);
  if (!isOwner) {
    throw Object.assign(new Error('Not authorized'), { statusCode: 403 });
  }

  return updateHealthLog(logId, data);
};

// 건강 로그 삭제
export const deleteHealthLogService = async (logId: bigint, userId: bigint) => {
  const log = await findHealthLogById(logId);
  if (!log) {
    throw Object.assign(new Error('Health log not found'), { statusCode: 404 });
  }

  // 반려동물 소유자 확인
  const isOwner = await isPetOwner(log.participantPet.petId, userId);
  if (!isOwner) {
    throw Object.assign(new Error('Not authorized'), { statusCode: 403 });
  }

  return deleteHealthLog(logId);
};

const prisma = new (require('@prisma/client').PrismaClient)();

