import { Router } from 'express';
import {
  createReviewController,
  getReviewDetailController,
  getSessionReviewsController,
  getRouteReviewsController,
  getUserReviewsController,
  updateReviewController,
  deleteReviewController,
} from '../controllers/review.controller';
import { authenticateToken, requireAuth } from '../utils/auth.middleware';

const router = Router();

// 후기 조회 (공개)
router.get('/:id', getReviewDetailController);
router.get('/sessions/:sessionId', getSessionReviewsController);
router.get('/routes/:routeId', getRouteReviewsController);
router.get('/users/:userId', getUserReviewsController);

// 후기 작성, 수정, 삭제 (인증 필요)
router.post('/', authenticateToken, requireAuth, createReviewController);
router.patch('/:id', authenticateToken, requireAuth, updateReviewController);
router.delete('/:id', authenticateToken, requireAuth, deleteReviewController);

export default router;

