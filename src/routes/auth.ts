import { Router, RequestHandler } from 'express';
import {
  loginController,
  registerController,
  refreshTokenController,
  logoutController,
  getCurrentUserController,
  getProfileController,
} from '../controllers/auth.controller';
import { authenticateToken, requireAuth } from '../utils/auth.middleware';

const router = Router();

// POST /auth/register - 회원가입
router.post('/register', registerController as RequestHandler);

// POST /auth/login - 사용자 로그인 (username 또는 email로 로그인 가능)
router.post('/login', loginController as RequestHandler);

// POST /auth/refresh-token - 액세스 토큰 갱신
router.post('/refresh-token', refreshTokenController as RequestHandler);

// POST /auth/logout - 로그아웃 (현재 세션)
router.post('/logout', requireAuth, logoutController as RequestHandler);

// GET /auth/me - 현재 사용자 정보 조회 (OAuth 로직 통합)
router.get('/me', authenticateToken, requireAuth, getCurrentUserController as RequestHandler);

// GET /auth/profile - 프로필 조회 (상세 정보 포함)
router.get('/profile', authenticateToken, requireAuth, getProfileController as RequestHandler);

export default router; 