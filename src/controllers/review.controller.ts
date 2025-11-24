import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  createReviewService,
  getReviewDetailService,
  getSessionReviewsService,
  getRouteReviewsService,
  getUserReviewsService,
  updateReviewService,
  deleteReviewService,
} from '../services/review.service';

// 후기 작성
export const createReviewController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const { sessionId, overallRating, routeRating, groupRating, distance, duration, notes, photoUrls, isPublic } = req.body;

    if (!sessionId || !overallRating) {
      return res.status(StatusCodes.BAD_REQUEST).sendError(
        StatusCodes.BAD_REQUEST,
        'sessionId and overallRating are required'
      );
    }

    const review = await createReviewService(BigInt(sessionId), userId, {
      overallRating: parseInt(overallRating),
      routeRating: routeRating ? parseInt(routeRating) : undefined,
      groupRating: groupRating ? parseInt(groupRating) : undefined,
      distance: distance ? parseFloat(distance) : undefined,
      duration: duration ? parseInt(duration) : undefined,
      notes,
      photoUrls,
      isPublic,
    });

    res.sendSuccess(StatusCodes.CREATED, '후기 작성 성공', {
      id: review.id.toString(),
      overallRating: review.overallRating,
    });
  } catch (error) {
    next(error);
  }
};

// 후기 상세 조회
export const getReviewDetailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviewId = BigInt(req.params.id);
    const review = await getReviewDetailService(reviewId);

    res.sendSuccess(StatusCodes.OK, '후기 상세 조회 성공', {
      id: review.id.toString(),
      overallRating: review.overallRating,
      routeRating: review.routeRating,
      groupRating: review.groupRating,
      walkingDate: review.walkingDate.toISOString(),
      distance: review.distance?.toString(),
      duration: review.duration,
      notes: review.notes,
      photoUrls: review.photoUrls,
      isPublic: review.isPublic,
      reviewer: {
        id: review.reviewer.id.toString(),
        username: review.reviewer.username,
        name: review.reviewer.name,
        profileImage: review.reviewer.profileImage,
      },
      session: {
        id: review.session.id.toString(),
        location: review.session.mate.location,
        walkingDate: review.session.mate.walkingDate.toISOString(),
      },
      createdAt: review.createdAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// 세션의 후기 목록 조회
export const getSessionReviewsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = BigInt(req.params.sessionId);
    const reviews = await getSessionReviewsService(sessionId);

    res.sendSuccess(StatusCodes.OK, '세션 후기 목록 조회 성공', {
      reviews: reviews.map((r) => ({
        id: r.id.toString(),
        overallRating: r.overallRating,
        routeRating: r.routeRating,
        groupRating: r.groupRating,
        notes: r.notes,
        reviewer: {
          id: r.reviewer.id.toString(),
          username: r.reviewer.username,
          name: r.reviewer.name,
          profileImage: r.reviewer.profileImage,
        },
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    next(error);
  }
};

// 산책로의 후기 목록 조회
export const getRouteReviewsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const routeId = BigInt(req.params.routeId);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const reviews = await getRouteReviewsService(routeId, limit, offset);

    res.sendSuccess(StatusCodes.OK, '산책로 후기 목록 조회 성공', {
      reviews: reviews.map((r) => ({
        id: r.id.toString(),
        overallRating: r.overallRating,
        routeRating: r.routeRating,
        notes: r.notes,
        reviewer: {
          id: r.reviewer.id.toString(),
          username: r.reviewer.username,
          name: r.reviewer.name,
        },
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    next(error);
  }
};

// 사용자의 후기 목록 조회
export const getUserReviewsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = BigInt(req.params.userId);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const reviews = await getUserReviewsService(userId, limit, offset);

    res.sendSuccess(StatusCodes.OK, '사용자 후기 목록 조회 성공', {
      reviews: reviews.map((r) => ({
        id: r.id.toString(),
        overallRating: r.overallRating,
        routeRating: r.routeRating,
        notes: r.notes,
        walkingDate: r.walkingDate.toISOString(),
        session: {
          id: r.session.id.toString(),
          location: r.session.mate.location,
        },
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    next(error);
  }
};

// 후기 수정
export const updateReviewController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const reviewId = BigInt(req.params.id);
    const data = req.body;

    if (data.overallRating) data.overallRating = parseInt(data.overallRating);
    if (data.routeRating) data.routeRating = parseInt(data.routeRating);
    if (data.groupRating) data.groupRating = parseInt(data.groupRating);
    if (data.distance) data.distance = parseFloat(data.distance);
    if (data.duration) data.duration = parseInt(data.duration);

    await updateReviewService(reviewId, userId, data);

    res.sendSuccess(StatusCodes.OK, '후기 수정 성공');
  } catch (error) {
    next(error);
  }
};

// 후기 삭제
export const deleteReviewController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const reviewId = BigInt(req.params.id);
    await deleteReviewService(reviewId, userId);

    res.sendSuccess(StatusCodes.OK, '후기 삭제 성공');
  } catch (error) {
    next(error);
  }
};

