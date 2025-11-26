import { PrismaClient } from '@prisma/client';
import {
  createReview,
  findReviewById,
  findReviewsBySessionId,
  findReviewsByRouteId,
  findReviewsByUserId,
  updateReview,
  deleteReview,
  calculateRouteAverageRating,
} from '../repositories/review.repository';
import { findSessionById } from '../repositories/session.repository';
import { updateRouteRating } from '../repositories/route.repository';

const prisma = new PrismaClient();

// 후기 작성
export const createReviewService = async (
  sessionId: bigint,
  reviewerId: bigint,
  data: {
    overallRating: number;
    routeRating?: number;
    groupRating?: number;
    distance?: number;
    duration?: number;
    notes?: string;
    photoUrls?: string[];
    isPublic?: boolean;
  }
) => {
  // 세션 정보 조회
  const session = await findSessionById(sessionId);
  if (!session) {
    throw Object.assign(new Error('세션을 찾을 수 없습니다.'), { statusCode: 404 });
  }

  // 참가자 확인
  const isParticipant =
    session.mate.hostUserId === reviewerId ||
    session.mate.participants.some((p) => p.userId === reviewerId);

  if (!isParticipant) {
    throw Object.assign(new Error('참가자만 후기를 작성할 수 있습니다.'), { statusCode: 403 });
  }

  // 평점 범위 검증
  if (data.overallRating < 1 || data.overallRating > 5) {
    throw Object.assign(new Error('평점은 1부터 5까지의 값이어야 합니다.'), { statusCode: 400 });
  }

  return await prisma.$transaction(async (tx) => {
    // 후기 생성
    const review = await tx.walkingReview.create({
      data: {
        sessionId,
        reviewerId,
        overallRating: data.overallRating,
        routeRating: data.routeRating,
        groupRating: data.groupRating,
        walkingDate: session.mate.walkingDate,
        distance: data.distance,
        duration: data.duration,
        notes: data.notes,
        photoUrls: data.photoUrls ? JSON.stringify(data.photoUrls) : undefined,
        isPublic: data.isPublic ?? true,
      },
    });

    // 산책로 평점 업데이트
    if (session.mate.route?.id && data.routeRating) {
      const { averageRating, reviewCount } = await calculateRouteAverageRating(session.mate.route.id);
      await tx.walkingRoute.update({
        where: { id: session.mate.route.id },
        data: {
          rating: averageRating,
          reviewCount,
        },
      });
    }

    return review;
  });
};

// 후기 상세 조회
export const getReviewDetailService = async (reviewId: bigint) => {
  const review = await findReviewById(reviewId);
  if (!review) {
    throw Object.assign(new Error('후기를 찾을 수 없습니다.'), { statusCode: 404 });
  }
  return review;
};

// 세션의 후기 목록 조회
export const getSessionReviewsService = async (sessionId: bigint) => {
  return findReviewsBySessionId(sessionId);
};

// 산책로의 후기 목록 조회
export const getRouteReviewsService = async (routeId: bigint, limit?: number, offset?: number) => {
  return findReviewsByRouteId(routeId, limit, offset);
};

// 사용자의 후기 목록 조회
export const getUserReviewsService = async (userId: bigint, limit?: number, offset?: number) => {
  return findReviewsByUserId(userId, limit, offset);
};

// 후기 수정
export const updateReviewService = async (
  reviewId: bigint,
  userId: bigint,
  data: Partial<{
    overallRating: number;
    routeRating: number;
    groupRating: number;
    distance: number;
    duration: number;
    notes: string;
    photoUrls: string[];
    isPublic: boolean;
  }>
) => {
  const review = await findReviewById(reviewId);
  if (!review) {
    throw Object.assign(new Error('후기를 찾을 수 없습니다.'), { statusCode: 404 });
  }

  // 작성자 확인
  if (review.reviewerId !== userId) {
    throw Object.assign(new Error('권한이 없습니다.'), { statusCode: 403 });
  }

  // 평점 범위 검증
  if (data.overallRating && (data.overallRating < 1 || data.overallRating > 5)) {
    throw Object.assign(new Error('평점은 1부터 5까지의 값이어야 합니다.'), { statusCode: 400 });
  }

  const updateData: any = { ...data };
  if (data.photoUrls) {
    updateData.photoUrls = JSON.stringify(data.photoUrls);
  }

  return await prisma.$transaction(async (tx) => {
    const updated = await tx.walkingReview.update({
      where: { id: reviewId },
      data: updateData,
    });

    // 산책로 평점 재계산
    if (review.session.mate.route?.id && data.routeRating) {
      const { averageRating, reviewCount } = await calculateRouteAverageRating(review.session.mate.route.id);
      await tx.walkingRoute.update({
        where: { id: review.session.mate.route.id },
        data: {
          rating: averageRating,
          reviewCount,
        },
      });
    }

    return updated;
  });
};

// 후기 삭제
export const deleteReviewService = async (reviewId: bigint, userId: bigint) => {
  const review = await findReviewById(reviewId);
  if (!review) {
    throw Object.assign(new Error('후기를 찾을 수 없습니다.'), { statusCode: 404 });
  }

  // 작성자 확인
  if (review.reviewerId !== userId) {
    throw Object.assign(new Error('권한이 없습니다.'), { statusCode: 403 });
  }

  return await prisma.$transaction(async (tx) => {
    await tx.walkingReview.delete({
      where: { id: reviewId },
    });

    // 산책로 평점 재계산
    if (review.session.mate.route?.id) {
      const { averageRating, reviewCount } = await calculateRouteAverageRating(review.session.mate.route.id);
      await tx.walkingRoute.update({
        where: { id: review.session.mate.route.id },
        data: {
          rating: averageRating,
          reviewCount,
        },
      });
    }

    return { success: true };
  });
};

