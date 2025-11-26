import { PrismaClient } from '@prisma/client';
import {
  createSession,
  findSessionById,
  findSessions,
  updateSession,
  deleteSession,
} from '../repositories/session.repository';
import { isWalkingMateHost } from '../repositories/walking-mate.repository';
import { updateWalkingMate } from '../repositories/walking-mate.repository';
import { countAcceptedParticipants } from '../repositories/participant.repository';

const prisma = new PrismaClient();

// 산책 세션 시작
export const startSessionService = async (mateId: bigint, hostUserId: bigint) => {
  // 호스트 확인
  const isHost = await isWalkingMateHost(mateId, hostUserId);
  if (!isHost) {
    throw Object.assign(new Error('권한이 없습니다.'), { statusCode: 403 });
  }

  return await prisma.$transaction(async (tx) => {
    // 참가자 수 및 반려동물 수 계산
    const participants = await tx.walkingParticipant.findMany({
      where: {
        mateId,
        status: 'ACCEPTED',
      },
      include: {
        walkingParticipantPets: true,
      },
    });

    const participantCount = participants.length + 1; // 호스트 포함
    const totalPets = participants.reduce((sum, p) => sum + p.walkingParticipantPets.length, 0);

    // 세션 생성
    const session = await tx.walkingSession.create({
      data: {
        mateId,
        startedAt: new Date(),
        participantCount,
        totalPets,
      },
    });

    // 산책 메이트 상태 업데이트
    await tx.walkingMate.update({
      where: { id: mateId },
      data: { status: 'COMPLETED' },
    });

    return session;
  });
};

// 산책 세션 종료
export const endSessionService = async (
  sessionId: bigint,
  hostUserId: bigint,
  data: {
    actualDistanceM?: number;
    actualDurationS?: number;
    pathData?: string;
  }
) => {
  const session = await findSessionById(sessionId);
  if (!session) {
    throw Object.assign(new Error('세션을 찾을 수 없습니다.'), { statusCode: 404 });
  }

  // 호스트 확인
  if (session.mate.hostUserId !== hostUserId) {
    throw Object.assign(new Error('권한이 없습니다.'), { statusCode: 403 });
  }

  return updateSession(sessionId, {
    endedAt: new Date(),
    ...data,
  });
};

// 산책 세션 상세 조회
export const getSessionDetailService = async (sessionId: bigint) => {
  const session = await findSessionById(sessionId);
  if (!session) {
    throw Object.assign(new Error('세션을 찾을 수 없습니다.'), { statusCode: 404 });
  }
  return session;
};

// 산책 세션 목록 조회
export const getSessionsService = async (filters?: {
  mateId?: bigint;
  userId?: bigint;
  limit?: number;
  offset?: number;
}) => {
  return findSessions(filters);
};

