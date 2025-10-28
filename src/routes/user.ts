import { Router, RequestHandler } from "express";
import { authenticateToken, requireAuth } from "../utils/auth.middleware";

const router = Router();

// 향후 사용자 관련 기능들을 위한 라우트들
// 예: 사용자 정보 수정, 비밀번호 변경, 계정 삭제 등

// GET /user/profile - 사용자 프로필 조회 (auth 도메인으로 이동됨)
// POST /user/update-profile - 프로필 수정 (향후 구현)
// PUT /user/change-password - 비밀번호 변경 (향후 구현)
// DELETE /user/account - 계정 삭제 (향후 구현)

export default router;