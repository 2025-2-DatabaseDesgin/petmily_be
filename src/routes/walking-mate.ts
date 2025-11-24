import { Router } from 'express';
import {
  createWalkingMateController,
  getWalkingMatesController,
  getWalkingMateDetailController,
  updateWalkingMateController,
  deleteWalkingMateController,
  joinWalkingMateController,
  leaveWalkingMateController,
  approveParticipantController,
  rejectParticipantController,
  cancelWaitlistController,
} from '../controllers/walking-mate.controller';
import { authenticateToken, requireAuth } from '../utils/auth.middleware';

const router = Router();

// 산책 메이트 목록 및 상세 조회 (공개)
router.get('/', getWalkingMatesController);
router.get('/:id', getWalkingMateDetailController);

// 산책 메이트 생성, 수정, 삭제 (인증 필요)
router.post('/', authenticateToken, requireAuth, createWalkingMateController);
router.patch('/:id', authenticateToken, requireAuth, updateWalkingMateController);
router.delete('/:id', authenticateToken, requireAuth, deleteWalkingMateController);

// 참가 신청 및 취소 (인증 필요)
router.post('/:id/join', authenticateToken, requireAuth, joinWalkingMateController);
router.delete('/:id/leave', authenticateToken, requireAuth, leaveWalkingMateController);

// 참가 승인/거절 (호스트 전용, 인증 필요)
router.patch('/participants/:id/approve', authenticateToken, requireAuth, approveParticipantController);
router.patch('/participants/:id/reject', authenticateToken, requireAuth, rejectParticipantController);

// 대기 취소 (인증 필요)
router.delete('/waitlist/:id', authenticateToken, requireAuth, cancelWaitlistController);

export default router;

