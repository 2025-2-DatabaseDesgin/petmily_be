import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  startSessionService,
  endSessionService,
  getSessionDetailService,
  getSessionsService,
} from '../services/session.service';

// 산책 세션 시작
export const startSessionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const { mateId } = req.body;
    if (!mateId) {
      return res.status(StatusCodes.BAD_REQUEST).sendError(StatusCodes.BAD_REQUEST, 'mateId는 필수입니다.');
    }

    const session = await startSessionService(BigInt(mateId), userId);

    res.sendSuccess(StatusCodes.CREATED, '산책 세션 시작 성공', {
      id: session.id.toString(),
      mateId: session.mateId.toString(),
      startedAt: session.startedAt?.toISOString(),
      participantCount: session.participantCount,
      totalPets: session.totalPets,
    });
  } catch (error) {
    next(error);
  }
};

// 산책 세션 종료
export const endSessionController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const sessionId = BigInt(req.params.id);
    const { actualDistanceM, actualDurationS, pathData } = req.body;

    const session = await endSessionService(sessionId, userId, {
      actualDistanceM: actualDistanceM ? parseInt(actualDistanceM) : undefined,
      actualDurationS: actualDurationS ? parseInt(actualDurationS) : undefined,
      pathData,
    });

    res.sendSuccess(StatusCodes.OK, '산책 세션 종료 성공', {
      id: session.id.toString(),
      endedAt: session.endedAt?.toISOString(),
      actualDistanceM: session.actualDistanceM,
      actualDurationS: session.actualDurationS,
    });
  } catch (error) {
    next(error);
  }
};

// 산책 세션 상세 조회
export const getSessionDetailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = BigInt(req.params.id);
    const session = await getSessionDetailService(sessionId);

    res.sendSuccess(StatusCodes.OK, '산책 세션 상세 조회 성공', {
      id: session.id.toString(),
      startedAt: session.startedAt?.toISOString(),
      endedAt: session.endedAt?.toISOString(),
      actualDistanceM: session.actualDistanceM,
      actualDurationS: session.actualDurationS,
      pathData: session.pathData,
      participantCount: session.participantCount,
      totalPets: session.totalPets,
      mate: {
        id: session.mate.id.toString(),
        location: session.mate.location,
        walkingDate: session.mate.walkingDate.toISOString(),
        hostUser: {
          id: session.mate.hostUser.id.toString(),
          username: session.mate.hostUser.username,
          name: session.mate.hostUser.name,
        },
      },
      reviews: session.walkingReviews.map((r) => ({
        id: r.id.toString(),
        overallRating: r.overallRating,
        notes: r.notes,
        reviewer: {
          id: r.reviewer.id.toString(),
          username: r.reviewer.username,
          name: r.reviewer.name,
        },
      })),
    });
  } catch (error) {
    next(error);
  }
};

// 산책 세션 목록 조회
export const getSessionsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mateId, userId, limit, offset } = req.query;

    const sessions = await getSessionsService({
      mateId: mateId ? BigInt(mateId as string) : undefined,
      userId: userId ? BigInt(userId as string) : undefined,
      limit: limit ? parseInt(limit as string) : 20,
      offset: offset ? parseInt(offset as string) : 0,
    });

    res.sendSuccess(StatusCodes.OK, '산책 세션 목록 조회 성공', {
      sessions: sessions.map((s) => ({
        id: s.id.toString(),
        startedAt: s.startedAt?.toISOString(),
        endedAt: s.endedAt?.toISOString(),
        actualDistanceM: s.actualDistanceM,
        actualDurationS: s.actualDurationS,
        mate: {
          id: s.mate.id.toString(),
          location: s.mate.location,
          walkingDate: s.mate.walkingDate.toISOString(),
        },
      })),
    });
  } catch (error) {
    next(error);
  }
};

