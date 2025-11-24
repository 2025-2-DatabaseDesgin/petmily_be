import { Router } from 'express';
import {
  followUserController,
  unfollowUserController,
  getFollowersController,
  getFollowingController,
  getFollowStatusController,
  getFollowStatsController,
} from '../controllers/follow.controller';
import { authenticateToken, requireAuth } from '../utils/auth.middleware';

const router = Router();

// 팔로우/언팔로우 (인증 필요)
router.post('/:userId', authenticateToken, requireAuth, followUserController);
router.delete('/:userId', authenticateToken, requireAuth, unfollowUserController);

// 팔로우 상태 조회 (인증 필요)
router.get('/:userId/status', authenticateToken, requireAuth, getFollowStatusController);

// 팔로워/팔로잉 목록 조회 (공개)
router.get('/:userId/followers', getFollowersController);
router.get('/:userId/following', getFollowingController);

// 팔로우 통계 조회 (공개)
router.get('/:userId/stats', getFollowStatsController);

export default router;

