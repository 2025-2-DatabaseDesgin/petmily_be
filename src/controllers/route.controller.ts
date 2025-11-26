import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  createRouteService,
  getRoutesService,
  getRouteDetailService,
  updateRouteService,
  deleteRouteService,
  getRouteFacilitiesService,
} from '../services/route.service';

// 산책로 생성
export const createRouteController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const {
      routeName,
      region,
      distance,
      duration,
      difficulty,
      pathData,
      description,
    } = req.body;

    if (!routeName) {
      return res.status(StatusCodes.BAD_REQUEST).sendError(StatusCodes.BAD_REQUEST, 'routeName은 필수입니다.');
    }

    const route = await createRouteService(userId ?? null, {
      routeName,
      region,
      distance: distance ? parseFloat(distance) : undefined,
      duration: duration ? parseInt(duration) : undefined,
      difficulty,
      pathData,
      description,
    });

    res.sendSuccess(StatusCodes.CREATED, '산책로 생성 성공', {
      id: route.id.toString(),
      routeName: route.routeName,
      region: route.region,
      distance: route.distance?.toString(),
      duration: route.duration,
      difficulty: route.difficulty,
    });
  } catch (error) {
    next(error);
  }
};

// 산책로 목록 조회
export const getRoutesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      region,
      difficulty,
      minDistance,
      maxDistance,
      minDuration,
      maxDuration,
      limit,
      offset,
    } = req.query;

    const result = await getRoutesService({
      region: region as string,
      difficulty: difficulty as any,
      minDistance: minDistance ? parseFloat(minDistance as string) : undefined,
      maxDistance: maxDistance ? parseFloat(maxDistance as string) : undefined,
      minDuration: minDuration ? parseInt(minDuration as string) : undefined,
      maxDuration: maxDuration ? parseInt(maxDuration as string) : undefined,
      limit: limit ? parseInt(limit as string) : 20,
      offset: offset ? parseInt(offset as string) : 0,
    });

    res.sendSuccess(StatusCodes.OK, '산책로 목록 조회 성공', {
      routes: result.routes.map((route) => ({
        id: route.id.toString(),
        routeName: route.routeName,
        region: route.region,
        distance: route.distance?.toString(),
        duration: route.duration,
        difficulty: route.difficulty,
        rating: route.rating.toString(),
        reviewCount: route.reviewCount,
        walkingMateCount: route._count.walkingMates,
        creator: route.creator ? {
          id: route.creator.id.toString(),
          username: route.creator.username,
          name: route.creator.name,
        } : null,
        createdAt: route.createdAt.toISOString(),
      })),
      totalCount: result.totalCount,
    });
  } catch (error) {
    next(error);
  }
};

// 산책로 상세 조회
export const getRouteDetailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const routeId = BigInt(req.params.id);
    const route = await getRouteDetailService(routeId);

    res.sendSuccess(StatusCodes.OK, '산책로 상세 조회 성공', {
      id: route.id.toString(),
      routeName: route.routeName,
      region: route.region,
      distance: route.distance?.toString(),
      duration: route.duration,
      difficulty: route.difficulty,
      pathData: route.pathData,
      description: route.description,
      rating: route.rating.toString(),
      reviewCount: route.reviewCount,
      walkingMateCount: route._count.walkingMates,
      creator: route.creator ? {
        id: route.creator.id.toString(),
        username: route.creator.username,
        name: route.creator.name,
        profileImage: route.creator.profileImage,
      } : null,
      facilities: route.facilityRoutes.map((fr) => ({
        id: fr.facility.id.toString(),
        name: fr.facility.name,
        type: fr.facility.type,
        address: fr.facility.address,
        latitude: fr.facility.latitude.toString(),
        longitude: fr.facility.longitude.toString(),
        visitOrder: fr.visitOrder,
        distanceFromStartM: fr.distanceFromStartM,
        isMandatory: fr.isMandatory,
        isSponsor: fr.facility.isSponsor,
        discountInfo: fr.facility.discountInfo,
      })),
      createdAt: route.createdAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// 산책로 수정
export const updateRouteController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const routeId = BigInt(req.params.id);
    const updateData = req.body;

    if (updateData.distance) updateData.distance = parseFloat(updateData.distance);
    if (updateData.duration) updateData.duration = parseInt(updateData.duration);

    const route = await updateRouteService(routeId, userId, updateData);

    res.sendSuccess(StatusCodes.OK, '산책로 수정 성공', {
      id: route.id.toString(),
      routeName: route.routeName,
      updatedAt: route.createdAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// 산책로 삭제
export const deleteRouteController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const routeId = BigInt(req.params.id);
    await deleteRouteService(routeId, userId);

    res.sendSuccess(StatusCodes.OK, '산책로 삭제 성공');
  } catch (error) {
    next(error);
  }
};

// 산책로 주변 시설 조회
export const getRouteFacilitiesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const routeId = BigInt(req.params.id);
    const facilityRoutes = await getRouteFacilitiesService(routeId);

    res.sendSuccess(StatusCodes.OK, '산책로 시설 조회 성공', {
      facilities: facilityRoutes.map((fr) => ({
        id: fr.facility.id.toString(),
        name: fr.facility.name,
        type: fr.facility.type,
        address: fr.facility.address,
        latitude: fr.facility.latitude.toString(),
        longitude: fr.facility.longitude.toString(),
        phone: fr.facility.phone,
        description: fr.facility.description,
        isSponsor: fr.facility.isSponsor,
        discountInfo: fr.facility.discountInfo,
        openingHours: fr.facility.openingHours,
        rating: fr.facility.rating.toString(),
        imageUrl: fr.facility.imageUrl,
        visitOrder: fr.visitOrder,
        distanceFromStartM: fr.distanceFromStartM,
        isMandatory: fr.isMandatory,
        notes: fr.notes,
      })),
    });
  } catch (error) {
    next(error);
  }
};

