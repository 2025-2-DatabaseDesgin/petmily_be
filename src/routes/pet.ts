import { Router } from 'express';
import {
  registerPetController,
  getMyPetsController,
  getPetDetailController,
  updatePetController,
  deletePetController,
  sendPetFriendRequestController,
  respondToPetFriendRequestController,
  getPetFriendsController,
  getPendingFriendRequestsController,
} from '../controllers/pet.controller';
import { authenticateToken, requireAuth } from '../utils/auth.middleware';

const router = Router();

// 모든 라우트에 인증 필요
router.use(authenticateToken, requireAuth);

// 반려동물 CRUD
router.post('/', registerPetController); // 반려동물 등록
router.get('/', getMyPetsController); // 내 반려동물 목록
router.get('/:id', getPetDetailController); // 반려동물 상세 조회
router.patch('/:id', updatePetController); // 반려동물 정보 수정
router.delete('/:id', deletePetController); // 반려동물 삭제

// 반려동물 친구 관계
router.post('/:id/friends', sendPetFriendRequestController); // 친구 요청
router.get('/:id/friends', getPetFriendsController); // 친구 목록 조회
router.get('/friends/requests', getPendingFriendRequestsController); // 받은 친구 요청 목록
router.patch('/friends/:id', respondToPetFriendRequestController); // 친구 요청 승인/거절

export default router;

