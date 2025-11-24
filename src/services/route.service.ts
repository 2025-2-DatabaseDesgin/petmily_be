import { RouteDifficulty } from '@prisma/client';
import {
  createRoute,
  findRoutes,
  findRouteById,
  updateRoute,
  deleteRoute,
  isRouteCreator,
  countRoutes,
} from '../repositories/route.repository';
import { findFacilitiesByRoute } from '../repositories/facility.repository';

// 산책로 생성
export const createRouteService = async (
  userId: bigint | null,
  data: {
    routeName: string;
    region?: string;
    distance?: number;
    duration?: number;
    difficulty?: RouteDifficulty;
    pathData?: string;
    description?: string;
  }
) => {
  return createRoute({
    createdBy: userId ?? undefined,
    ...data,
  });
};

// 산책로 목록 조회
export const getRoutesService = async (filters?: {
  region?: string;
  difficulty?: RouteDifficulty;
  minDistance?: number;
  maxDistance?: number;
  minDuration?: number;
  maxDuration?: number;
  limit?: number;
  offset?: number;
}) => {
  const routes = await findRoutes(filters);
  const totalCount = await countRoutes({
    region: filters?.region,
    difficulty: filters?.difficulty,
  });

  return {
    routes,
    totalCount,
  };
};

// 산책로 상세 조회
export const getRouteDetailService = async (routeId: bigint) => {
  const route = await findRouteById(routeId);
  if (!route) {
    throw Object.assign(new Error('Route not found'), { statusCode: 404 });
  }
  return route;
};

// 산책로 수정
export const updateRouteService = async (
  routeId: bigint,
  userId: bigint,
  data: Partial<{
    routeName: string;
    region: string;
    distance: number;
    duration: number;
    difficulty: RouteDifficulty;
    pathData: string;
    description: string;
  }>
) => {
  // 생성자 확인
  const isCreator = await isRouteCreator(routeId, userId);
  if (!isCreator) {
    throw Object.assign(new Error('Not authorized to update this route'), { statusCode: 403 });
  }

  return updateRoute(routeId, data);
};

// 산책로 삭제
export const deleteRouteService = async (routeId: bigint, userId: bigint) => {
  // 생성자 확인
  const isCreator = await isRouteCreator(routeId, userId);
  if (!isCreator) {
    throw Object.assign(new Error('Not authorized to delete this route'), { statusCode: 403 });
  }

  return deleteRoute(routeId);
};

// 산책로 주변 시설 조회
export const getRouteFacilitiesService = async (routeId: bigint) => {
  return findFacilitiesByRoute(routeId);
};

