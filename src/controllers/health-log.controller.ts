import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  createHealthLogService,
  getHealthLogDetailService,
  getPetHealthLogsService,
  updateHealthLogService,
  deleteHealthLogService,
} from '../services/health-log.service';

// 건강 로그 생성
export const createHealthLogController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const { participantPetId, ...data } = req.body;
    if (!participantPetId) {
      return res.status(StatusCodes.BAD_REQUEST).sendError(StatusCodes.BAD_REQUEST, 'participantPetId는 필수입니다.');
    }

    // 숫자 변환
    if (data.preWeight) data.preWeight = parseFloat(data.preWeight);
    if (data.distanceM) data.distanceM = parseInt(data.distanceM);
    if (data.durationS) data.durationS = parseInt(data.durationS);
    if (data.avgSpeedMps) data.avgSpeedMps = parseFloat(data.avgSpeedMps);
    if (data.maxSpeedMps) data.maxSpeedMps = parseFloat(data.maxSpeedMps);
    if (data.caloriesBurned) data.caloriesBurned = parseInt(data.caloriesBurned);
    if (data.stepCount) data.stepCount = parseInt(data.stepCount);

    const log = await createHealthLogService(BigInt(participantPetId), userId, data);

    res.sendSuccess(StatusCodes.CREATED, '건강 로그 생성 성공', {
      id: log.id.toString(),
    });
  } catch (error) {
    next(error);
  }
};

// 건강 로그 상세 조회
export const getHealthLogDetailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logId = BigInt(req.params.id);
    const log = await getHealthLogDetailService(logId);

    res.sendSuccess(StatusCodes.OK, '건강 로그 상세 조회 성공', {
      id: log.id.toString(),
      preWeight: log.preWeight?.toString(),
      preCondition: log.preCondition,
      distanceM: log.distanceM,
      durationS: log.durationS,
      avgSpeedMps: log.avgSpeedMps?.toString(),
      maxSpeedMps: log.maxSpeedMps?.toString(),
      caloriesBurned: log.caloriesBurned,
      stepCount: log.stepCount,
      postCondition: log.postCondition,
      needsRest: log.needsRest,
      hydrationLevel: log.hydrationLevel,
      notes: log.notes,
      pet: {
        id: log.participantPet.pet.id.toString(),
        petName: log.participantPet.pet.petName,
      },
      createdAt: log.createdAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// 반려동물의 건강 로그 목록 조회
export const getPetHealthLogsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const petId = BigInt(req.params.petId);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const logs = await getPetHealthLogsService(petId, limit, offset);

    res.sendSuccess(StatusCodes.OK, '건강 로그 목록 조회 성공', {
      logs: logs.map((log) => ({
        id: log.id.toString(),
        preWeight: log.preWeight?.toString(),
        preCondition: log.preCondition,
        distanceM: log.distanceM,
        durationS: log.durationS,
        postCondition: log.postCondition,
        needsRest: log.needsRest,
        walkingDate: log.participantPet.participant.mate.walkingDate.toISOString(),
        location: log.participantPet.participant.mate.location,
        createdAt: log.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    next(error);
  }
};

// 건강 로그 수정
export const updateHealthLogController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const logId = BigInt(req.params.id);
    const data = req.body;

    // 숫자 변환
    if (data.preWeight) data.preWeight = parseFloat(data.preWeight);
    if (data.distanceM) data.distanceM = parseInt(data.distanceM);
    if (data.durationS) data.durationS = parseInt(data.durationS);
    if (data.avgSpeedMps) data.avgSpeedMps = parseFloat(data.avgSpeedMps);
    if (data.maxSpeedMps) data.maxSpeedMps = parseFloat(data.maxSpeedMps);
    if (data.caloriesBurned) data.caloriesBurned = parseInt(data.caloriesBurned);
    if (data.stepCount) data.stepCount = parseInt(data.stepCount);

    await updateHealthLogService(logId, userId, data);

    res.sendSuccess(StatusCodes.OK, '건강 로그 수정 성공');
  } catch (error) {
    next(error);
  }
};

// 건강 로그 삭제
export const deleteHealthLogController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const logId = BigInt(req.params.id);
    await deleteHealthLogService(logId, userId);

    res.sendSuccess(StatusCodes.OK, '건강 로그 삭제 성공');
  } catch (error) {
    next(error);
  }
};

