import { Router } from 'express';
import {
  startSessionController,
  endSessionController,
  getSessionDetailController,
  getSessionsController,
} from '../controllers/session.controller';
import { authenticateToken, requireAuth } from '../utils/auth.middleware';

const router = Router();

// 산책 세션 목록 및 상세 조회 (공개)
router.get('/', getSessionsController);
router.get('/:id', getSessionDetailController);

// 산책 세션 시작 및 종료 (호스트 전용, 인증 필요)
router.post('/', authenticateToken, requireAuth, startSessionController);
router.patch('/:id/end', authenticateToken, requireAuth, endSessionController);

export default router;

