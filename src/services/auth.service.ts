import bcrypt from 'bcrypt';
import { PrismaClient, User as PrismaAppUser, UserRole, UserStatus } from '@prisma/client';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  UserPayload,
} from '../utils/jwt';
import {
  saveRefreshToken,
  findRefreshTokenByToken,
  deleteRefreshToken,
  deleteAllRefreshTokensByUserId,
} from '../repositories/auth.repository';
import {
  findUserByUsername,
  findUserByEmail,
  findUserById,
  updateUser,
} from '../repositories/user.repository';

const prisma = new PrismaClient();

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user?: {
    id: bigint;
    username: string;
    email: string;
    name: string;
    role: UserRole;
    status: UserStatus;
  };
}

/**
 * 사용자 로그인 (username 또는 email로 로그인 가능)
 */
export const loginService = async (
  loginIdentifier: string, // username 또는 email
  passwordInput?: string
): Promise<AuthTokens> => {
  // username 또는 email로 사용자 찾기
  let user = await findUserByUsername(loginIdentifier);
  if (!user) {
    user = await findUserByEmail(loginIdentifier);
  }

  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }

  if (passwordInput) { // 비밀번호 제공 시 (일반 로그인)
    const isPasswordValid = await bcrypt.compare(passwordInput, user.password);
    if (!isPasswordValid) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }
  }
  // 소셜 로그인 등 비밀번호 없이 진행되는 경우, 이 부분은 스킵될 수 있음

  const accessToken = generateAccessToken({ id: user.id, username: user.username });
  const refreshToken = generateRefreshToken({ id: user.id, username: user.username });

  const refreshTokenExpiresInMs = parseTokenExpirationString(process.env.REFRESH_TOKEN_EXPIRES_IN || '7d');
  const expiresAt = new Date(Date.now() + refreshTokenExpiresInMs);

  await saveRefreshToken(user.id, refreshToken, expiresAt);

  // 마지막 로그인 시간 업데이트
  await updateUser(user.id, { lastLoginAt: new Date() });

  return { 
    accessToken, 
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    }
  };
};

/**
 * 사용자 회원가입
 */
export const registerService = async (data: {
  username: string;
  password: string;
  email: string;
  name: string;
  birthDate?: Date;
  phone?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  isPetOwner?: boolean;
}): Promise<AuthTokens> => {
  // 중복 체크
  const existingUserByUsername = await findUserByUsername(data.username);
  if (existingUserByUsername) {
    throw Object.assign(new Error('Username already exists'), { statusCode: 409 });
  }

  const existingUserByEmail = await findUserByEmail(data.email);
  if (existingUserByEmail) {
    throw Object.assign(new Error('Email already exists'), { statusCode: 409 });
  }

  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 사용자 생성
  const user = await prisma.user.create({
    data: {
      username: data.username,
      password: hashedPassword,
      email: data.email,
      name: data.name,
      birthDate: data.birthDate,
      phone: data.phone,
      region: data.region,
      latitude: data.latitude,
      longitude: data.longitude,
      isPetOwner: data.isPetOwner ?? false,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    },
  });

  // 토큰 생성
  const accessToken = generateAccessToken({ id: user.id, username: user.username });
  const refreshToken = generateRefreshToken({ id: user.id, username: user.username });

  const refreshTokenExpiresInMs = parseTokenExpirationString(process.env.REFRESH_TOKEN_EXPIRES_IN || '7d');
  const expiresAt = new Date(Date.now() + refreshTokenExpiresInMs);

  await saveRefreshToken(user.id, refreshToken, expiresAt);

  return { 
    accessToken, 
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    }
  };
};

/**
 * 토큰 만료 문자열 (예: '7d', '15m')을 밀리초로 변환
 */
const parseTokenExpirationString = (expiresIn: string): number => {
    const unit = expiresIn.charAt(expiresIn.length - 1);
    const value = parseInt(expiresIn.slice(0, -1));
    if (isNaN(value)) throw new Error('Invalid token expiration format');
    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        default: 
            const defaultValue = parseInt(expiresIn);
            if (isNaN(defaultValue)) throw new Error('Invalid token expiration format');
            return defaultValue; // 숫자로만 주어지면 ms로 간주
    }
}

/**
 * 리프레시 토큰을 사용하여 새로운 액세스 토큰 발급
 */
export const refreshTokenService = async (
  oldRefreshToken: string
): Promise<AuthTokens> => {
  const decodedPayload = verifyToken(oldRefreshToken);
  if (!decodedPayload) {
    throw Object.assign(new Error('Invalid or expired refresh token'), { statusCode: 401 });
  }

  const existingToken = await findRefreshTokenByToken(oldRefreshToken);
  if (!existingToken || existingToken.userId !== BigInt(decodedPayload.id) || existingToken.expiresAt < new Date()) {
    if(existingToken) await deleteRefreshToken(oldRefreshToken);
    throw Object.assign(new Error('Refresh token not found, mismatched, or expired in DB'), { statusCode: 401 });
  }

  const newAccessToken = generateAccessToken({ 
    id: BigInt(decodedPayload.id), 
    username: decodedPayload.username 
  });
  
  // 보안 강화: 새 리프레시 토큰 발급 (Rotation)
  const newRefreshToken = generateRefreshToken({ 
    id: BigInt(decodedPayload.id), 
    username: decodedPayload.username 
  });
  const refreshTokenExpiresInMs = parseTokenExpirationString(process.env.REFRESH_TOKEN_EXPIRES_IN || '7d');
  const expiresAt = new Date(Date.now() + refreshTokenExpiresInMs);
  
  await deleteRefreshToken(oldRefreshToken); // 이전 리프레시 토큰 삭제
  await saveRefreshToken(BigInt(decodedPayload.id), newRefreshToken, expiresAt); // 새 리프레시 토큰 저장

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

/**
 * 로그아웃 (특정 리프레시 토큰 삭제)
 */
export const logoutService = async (refreshToken?: string): Promise<void> => {
  if (refreshToken) {
    const deleted = await deleteRefreshToken(refreshToken);
    if (!deleted) {
        console.warn('Logout: Refresh token to delete was not found in DB.');
    }
  } else {
    console.log('Logout request without a refresh token (client might have already cleared it).');
  }
};

/**
 * 특정 사용자의 모든 세션에서 로그아웃 (모든 리프레시 토큰 삭제)
 */
export const logoutFromAllDevicesService = async (userId: bigint): Promise<void> => {
  await deleteAllRefreshTokensByUserId(userId);
}; 