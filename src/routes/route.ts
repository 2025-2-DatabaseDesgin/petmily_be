import { Router } from 'express';
import {
  createRouteController,
  getRoutesController,
  getRouteDetailController,
  updateRouteController,
  deleteRouteController,
  getRouteFacilitiesController,
} from '../controllers/route.controller';
import { authenticateToken, requireAuth } from '../utils/auth.middleware';

const router = Router();

// 산책로 목록 및 상세 조회 (공개)
router.get('/', getRoutesController);
router.get('/:id', getRouteDetailController);
router.get('/:id/facilities', getRouteFacilitiesController);

// 산책로 생성, 수정, 삭제 (인증 필요)
router.post('/', authenticateToken, requireAuth, createRouteController);
router.patch('/:id', authenticateToken, requireAuth, updateRouteController);
router.delete('/:id', authenticateToken, requireAuth, deleteRouteController);

export default router;

