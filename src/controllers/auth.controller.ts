import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  loginService,
  registerService,
  refreshTokenService,
  logoutService,
} from '../services/auth.service';
import { findUserById } from '../repositories/user.repository';

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { loginIdentifier, password } = req.body; // username 또는 email
    if (!loginIdentifier || !password) {
      return res.status(StatusCodes.BAD_REQUEST).sendError(StatusCodes.BAD_REQUEST, 'loginIdentifier와 password는 필수입니다.');
    }
    
    const result = await loginService(loginIdentifier, password);
    
    res.sendSuccess(StatusCodes.OK, '로그인 성공', {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, email, name, birthDate, phone, region, latitude, longitude, isPetOwner } = req.body;
    
    if (!username || !password || !email || !name) {
      return res.status(StatusCodes.BAD_REQUEST).sendError(StatusCodes.BAD_REQUEST, 'username, password, email, name은 필수입니다.');
    }

    const result = await registerService({
      username,
      password,
      email,
      name,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      phone,
      region,
      latitude,
      longitude,
      isPetOwner,
    });
    
    res.sendSuccess(StatusCodes.CREATED, '회원가입 성공', {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(StatusCodes.BAD_REQUEST).sendError(StatusCodes.BAD_REQUEST, '리프레시 토큰은 필수입니다.');
    }
    const newTokens = await refreshTokenService(refreshToken);
    res.sendSuccess(StatusCodes.OK, '토큰 갱신 성공', {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body; 
    await logoutService(refreshToken);
    res.sendSuccess(StatusCodes.OK, '로그아웃 성공');
  } catch (error) {
    next(error);
  }
};

// 현재 사용자 정보 조회 (OAuth 로직 통합)
export const getCurrentUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    res.sendSuccess(StatusCodes.OK, '사용자 정보를 성공적으로 가져왔습니다.', req.user);
  } catch (error) {
    next(error);
  }
};

// 프로필 조회 컨트롤러
export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    // 사용자 정보 조회
    const user = await findUserById(userId);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).sendError(StatusCodes.NOT_FOUND, '사용자를 찾을 수 없습니다.');
    }

    res.sendSuccess(StatusCodes.OK, '프로필 조회 성공', {
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      name: user.name,
      birthDate: user.birthDate?.toISOString(),
      phone: user.phone,
      profileImage: user.profileImage,
      region: user.region,
      latitude: user.latitude?.toString(),
      longitude: user.longitude?.toString(),
      isPetOwner: user.isPetOwner,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString(),
    });
  } catch (error) {
    next(error);
  }
};
