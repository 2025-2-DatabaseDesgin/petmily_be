import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  followUserService,
  unfollowUserService,
  getFollowersService,
  getFollowingService,
  getFollowStatusService,
  getFollowStatsService,
} from '../services/follow.service';

// 팔로우
export const followUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const followerId = req.user?.id;
    if (!followerId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const followingId = BigInt(req.params.userId);
    await followUserService(followerId, followingId);

    res.sendSuccess(StatusCodes.CREATED, '팔로우 성공');
  } catch (error) {
    next(error);
  }
};

// 언팔로우
export const unfollowUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const followerId = req.user?.id;
    if (!followerId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const followingId = BigInt(req.params.userId);
    await unfollowUserService(followerId, followingId);

    res.sendSuccess(StatusCodes.OK, '언팔로우 성공');
  } catch (error) {
    next(error);
  }
};

// 팔로워 목록 조회
export const getFollowersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = BigInt(req.params.userId);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const result = await getFollowersService(userId, limit, offset);

    res.sendSuccess(StatusCodes.OK, '팔로워 목록 조회 성공', {
      followers: result.followers.map((user) => ({
        id: user.id.toString(),
        username: user.username,
        name: user.name,
        profileImage: user.profileImage,
        region: user.region,
        isPetOwner: user.isPetOwner,
      })),
      totalCount: result.totalCount,
      limit,
      offset,
    });
  } catch (error) {
    next(error);
  }
};

// 팔로잉 목록 조회
export const getFollowingController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = BigInt(req.params.userId);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const result = await getFollowingService(userId, limit, offset);

    res.sendSuccess(StatusCodes.OK, '팔로잉 목록 조회 성공', {
      following: result.following.map((user) => ({
        id: user.id.toString(),
        username: user.username,
        name: user.name,
        profileImage: user.profileImage,
        region: user.region,
        isPetOwner: user.isPetOwner,
      })),
      totalCount: result.totalCount,
      limit,
      offset,
    });
  } catch (error) {
    next(error);
  }
};

// 팔로우 상태 조회
export const getFollowStatusController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const targetUserId = BigInt(req.params.userId);
    const status = await getFollowStatusService(userId, targetUserId);

    res.sendSuccess(StatusCodes.OK, '팔로우 상태 조회 성공', status);
  } catch (error) {
    next(error);
  }
};

// 팔로우 통계 조회
export const getFollowStatsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = BigInt(req.params.userId);
    const stats = await getFollowStatsService(userId);

    res.sendSuccess(StatusCodes.OK, '팔로우 통계 조회 성공', stats);
  } catch (error) {
    next(error);
  }
};

