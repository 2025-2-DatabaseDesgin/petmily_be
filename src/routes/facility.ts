import { Router } from 'express';
import {
  createFacilityController,
  getFacilitiesController,
  getFacilityDetailController,
  updateFacilityController,
  deleteFacilityController,
  linkFacilityToRouteController,
  unlinkFacilityFromRouteController,
} from '../controllers/facility.controller';
import { authenticateToken, requireAuth, authorizeRole } from '../utils/auth.middleware';

const router = Router();

// 시설 목록 및 상세 조회 (공개)
router.get('/', getFacilitiesController);
router.get('/:id', getFacilityDetailController);

// 시설 관리 (관리자 전용)
router.post('/', authenticateToken, requireAuth, authorizeRole('ADMIN'), createFacilityController);
router.patch('/:id', authenticateToken, requireAuth, authorizeRole('ADMIN'), updateFacilityController);
router.delete('/:id', authenticateToken, requireAuth, authorizeRole('ADMIN'), deleteFacilityController);

// 산책로-시설 연결 관리 (관리자 전용)
router.post('/routes/:routeId/facilities', authenticateToken, requireAuth, authorizeRole('ADMIN'), linkFacilityToRouteController);
router.delete('/routes/:routeId/facilities/:facilityId', authenticateToken, requireAuth, authorizeRole('ADMIN'), unlinkFacilityFromRouteController);

export default router;

