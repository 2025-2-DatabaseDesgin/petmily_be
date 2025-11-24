import { Router } from 'express';
import {
  createHealthLogController,
  getHealthLogDetailController,
  getPetHealthLogsController,
  updateHealthLogController,
  deleteHealthLogController,
} from '../controllers/health-log.controller';
import { authenticateToken, requireAuth } from '../utils/auth.middleware';

const router = Router();

// 건강 로그 조회 (공개)
router.get('/:id', getHealthLogDetailController);
router.get('/pets/:petId', getPetHealthLogsController);

// 건강 로그 생성, 수정, 삭제 (인증 필요)
router.post('/', authenticateToken, requireAuth, createHealthLogController);
router.patch('/:id', authenticateToken, requireAuth, updateHealthLogController);
router.delete('/:id', authenticateToken, requireAuth, deleteHealthLogController);

export default router;

