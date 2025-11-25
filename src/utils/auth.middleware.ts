import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from './jwt';
import { PrismaClient, User as PrismaAppUser } from '@prisma/client';
import { serializeBigInt } from './bigint.util';

const prisma = new PrismaClient();

// 사용자 ID(PK) 조회 함수
const findUserById = async (id: bigint): Promise<PrismaAppUser | null> => {
    return prisma.user.findUnique({ where: { id } });
};

/**
 * JWT 토큰을 검증하고, 유효한 경우 req.user에 사용자 정보를 추가하는 미들웨어입니다.
 * 토큰이 없거나 유효하지 않아도 바로 에러를 반환하지 않고 다음 미들웨어로 넘어갈 수 있도록 설계되었습니다.
 * 실제 인증이 필요한 라우트에서는 requireAuth 미들웨어를 사용하거나 req.user의 존재 유무를 확인해야 합니다.
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1];

  if (!token) {
    return next(); // 토큰이 없으면 req.user 설정 없이 다음으로 진행
  }

  const decodedPayload = verifyToken(token);

  if (!decodedPayload) {
    // 토큰은 있지만 유효하지 않은 경우 (만료, 잘못된 서명 등)
    return next(); 
  }

  try {
    const userFromDb = await findUserById(BigInt(decodedPayload.id));

    if (!userFromDb) {
      // 토큰은 유효했으나 해당 사용자가 DB에 없는 경우
      return next();
    }

    // req.user에 사용자 정보 설정 (Express.User 타입 사용)
    req.user = {
      id: userFromDb.id,
      username: userFromDb.username,
      email: userFromDb.email,
      name: userFromDb.name,
      role: userFromDb.role,
      status: userFromDb.status,
      isPetOwner: userFromDb.isPetOwner,
      region: userFromDb.region || undefined,
      profileImage: userFromDb.profileImage || undefined,
    };

    next();
  } catch (error) {
    console.error('Error retrieving user for token:', error);
    return next(error);
  }
};

/**
 * 반드시 인증된 사용자만 접근을 허용하는 미들웨어입니다.
 * authenticateToken 미들웨어가 먼저 실행되어 req.user가 설정된 것을 전제로 합니다.
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(StatusCodes.UNAUTHORIZED).json(serializeBigInt({ message: 'Authentication required. No user data found on request.' }));
        return;
    }
    next();
};

/**
 * 특정 역할(role)을 가진 사용자인지 확인하는 미들웨어
 */
export const authorizeRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(StatusCodes.UNAUTHORIZED).json(serializeBigInt({ message: 'Authentication required.' }));
        return;
    }
    
    if (req.user.role !== requiredRole) {
      res.status(StatusCodes.FORBIDDEN).json(serializeBigInt({ message: `Forbidden: Role "${requiredRole}" required.` }));
      return;
    }
    next();
  };
}; 