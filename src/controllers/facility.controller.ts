import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  createFacilityService,
  getFacilitiesService,
  getFacilityDetailService,
  updateFacilityService,
  deleteFacilityService,
  linkFacilityToRouteService,
  unlinkFacilityFromRouteService,
} from '../services/facility.service';

// 시설 생성 (관리자 전용)
export const createFacilityController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      type,
      address,
      latitude,
      longitude,
      phone,
      description,
      isSponsor,
      discountInfo,
      openingHours,
      imageUrl,
    } = req.body;

    if (!name || !type || !address || !latitude || !longitude) {
      return res.status(StatusCodes.BAD_REQUEST).sendError(
        StatusCodes.BAD_REQUEST,
        'name, type, address, latitude, longitude는 필수입니다.'
      );
    }

    const facility = await createFacilityService({
      name,
      type,
      address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      phone,
      description,
      isSponsor,
      discountInfo,
      openingHours,
      imageUrl,
    });

    res.sendSuccess(StatusCodes.CREATED, '시설 생성 성공', {
      id: facility.id.toString(),
      name: facility.name,
      type: facility.type,
      address: facility.address,
    });
  } catch (error) {
    next(error);
  }
};

// 시설 목록 조회
export const getFacilitiesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      type,
      isSponsor,
      latitude,
      longitude,
      radiusKm,
      limit,
      offset,
    } = req.query;

    const result = await getFacilitiesService({
      type: type as any,
      isSponsor: isSponsor === 'true' ? true : isSponsor === 'false' ? false : undefined,
      latitude: latitude ? parseFloat(latitude as string) : undefined,
      longitude: longitude ? parseFloat(longitude as string) : undefined,
      radiusKm: radiusKm ? parseFloat(radiusKm as string) : undefined,
      limit: limit ? parseInt(limit as string) : 20,
      offset: offset ? parseInt(offset as string) : 0,
    });

    res.sendSuccess(StatusCodes.OK, '시설 목록 조회 성공', {
      facilities: result.facilities.map((facility) => ({
        id: facility.id.toString(),
        name: facility.name,
        type: facility.type,
        address: facility.address,
        latitude: facility.latitude.toString(),
        longitude: facility.longitude.toString(),
        phone: facility.phone,
        isSponsor: facility.isSponsor,
        discountInfo: facility.discountInfo,
        openingHours: facility.openingHours,
        rating: facility.rating.toString(),
        imageUrl: facility.imageUrl,
      })),
      totalCount: result.totalCount,
    });
  } catch (error) {
    next(error);
  }
};

// 시설 상세 조회
export const getFacilityDetailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const facilityId = BigInt(req.params.id);
    const facility = await getFacilityDetailService(facilityId);

    res.sendSuccess(StatusCodes.OK, '시설 상세 조회 성공', {
      id: facility.id.toString(),
      name: facility.name,
      type: facility.type,
      address: facility.address,
      latitude: facility.latitude.toString(),
      longitude: facility.longitude.toString(),
      phone: facility.phone,
      description: facility.description,
      isSponsor: facility.isSponsor,
      discountInfo: facility.discountInfo,
      openingHours: facility.openingHours,
      rating: facility.rating.toString(),
      imageUrl: facility.imageUrl,
      routes: facility.facilityRoutes.map((fr) => ({
        id: fr.route.id.toString(),
        routeName: fr.route.routeName,
        region: fr.route.region,
        distance: fr.route.distance?.toString(),
        rating: fr.route.rating.toString(),
      })),
      createdAt: facility.createdAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// 시설 수정 (관리자 전용)
export const updateFacilityController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const facilityId = BigInt(req.params.id);
    const updateData = req.body;

    if (updateData.latitude) updateData.latitude = parseFloat(updateData.latitude);
    if (updateData.longitude) updateData.longitude = parseFloat(updateData.longitude);

    const facility = await updateFacilityService(facilityId, updateData);

    res.sendSuccess(StatusCodes.OK, '시설 수정 성공', {
      id: facility.id.toString(),
      name: facility.name,
    });
  } catch (error) {
    next(error);
  }
};

// 시설 삭제 (관리자 전용)
export const deleteFacilityController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const facilityId = BigInt(req.params.id);
    await deleteFacilityService(facilityId);

    res.sendSuccess(StatusCodes.OK, '시설 삭제 성공');
  } catch (error) {
    next(error);
  }
};

// 산책로에 시설 연결 (관리자 전용)
export const linkFacilityToRouteController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const routeId = BigInt(req.params.routeId);
    const { facilityId, visitOrder, distanceFromStartM, isMandatory, notes } = req.body;

    if (!facilityId) {
      return res.status(StatusCodes.BAD_REQUEST).sendError(StatusCodes.BAD_REQUEST, 'facilityId는 필수입니다.');
    }

    await linkFacilityToRouteService({
      routeId,
      facilityId: BigInt(facilityId),
      visitOrder: visitOrder ? parseInt(visitOrder) : undefined,
      distanceFromStartM: distanceFromStartM ? parseInt(distanceFromStartM) : undefined,
      isMandatory,
      notes,
    });

    res.sendSuccess(StatusCodes.CREATED, '시설 연결 성공');
  } catch (error) {
    next(error);
  }
};

// 산책로에서 시설 연결 해제 (관리자 전용)
export const unlinkFacilityFromRouteController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const routeId = BigInt(req.params.routeId);
    const facilityId = BigInt(req.params.facilityId);

    await unlinkFacilityFromRouteService(routeId, facilityId);

    res.sendSuccess(StatusCodes.OK, '시설 연결 해제 성공');
  } catch (error) {
    next(error);
  }
};

