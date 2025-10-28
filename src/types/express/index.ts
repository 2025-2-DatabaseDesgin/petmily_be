import { Response } from 'express';
import { User as PrismaUser, UserRole, UserStatus } from '@prisma/client';

declare global {
  namespace Express {
    // req.user의 타입을 정의합니다.
    // Prisma의 User 모델을 기반으로 하되, 비밀번호 등 민감 정보는 제외하고 필요한 정보만 포함합니다.
    interface User {
      id: bigint; // User 모델의 PK
      username: string; // 사용자 아이디
      email: string; // 이메일
      name: string; // 이름
      role: UserRole; // 역할 (USER, ADMIN)
      status: UserStatus; // 상태 (ACTIVE, INACTIVE, SUSPENDED)
      isPetOwner: boolean; // 반려인 여부
      region?: string; // 지역
      profileImage?: string; // 프로필 이미지
    }

    interface Request {
      user?: User; // req.user를 선택적 속성으로 추가합니다.
    }

    interface Response {
      sendSuccess(statusCode?: number, message?: string, data?: any): Response;
      sendError(statusCode?: number, message?: string, error?: any, data?: any): Response;
    }
  }
}

export {};
