import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  createWalkingMateService,
  getWalkingMatesService,
  getWalkingMateDetailService,
  updateWalkingMateService,
  deleteWalkingMateService,
  joinWalkingMateService,
  leaveWalkingMateService,
  approveParticipantService,
  rejectParticipantService,
  cancelWaitlistService,
} from '../services/walking-mate.service';

// 산책 메이트 모집 생성
export const createWalkingMateController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const {
      routeId,
      walkingDate,
      location,
      latitude,
      longitude,
      duration,
      maxParticipants,
      petSizeFilter,
      description,
    } = req.body;

    if (!walkingDate || !location) {
      return res.status(StatusCodes.BAD_REQUEST).sendError(
        StatusCodes.BAD_REQUEST,
        'walkingDate와 location은 필수입니다.'
      );
    }

    const mate = await createWalkingMateService(userId, {
      routeId: routeId ? BigInt(routeId) : undefined,
      walkingDate: new Date(walkingDate),
      location,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      duration: duration ? parseInt(duration) : undefined,
      maxParticipants: maxParticipants ? parseInt(maxParticipants) : undefined,
      petSizeFilter,
      description,
    });

    res.sendSuccess(StatusCodes.CREATED, '산책 메이트 모집 생성 성공', {
      id: mate.id.toString(),
      walkingDate: mate.walkingDate.toISOString(),
      location: mate.location,
      maxParticipants: mate.maxParticipants,
      status: mate.status,
    });
  } catch (error) {
    next(error);
  }
};

// 산책 메이트 목록 조회
export const getWalkingMatesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      status,
      region,
      walkingDate,
      petSizeFilter,
      latitude,
      longitude,
      radiusKm,
      limit,
      offset,
    } = req.query;

    const result = await getWalkingMatesService({
      status: status as any,
      region: region as string,
      walkingDate: walkingDate ? new Date(walkingDate as string) : undefined,
      petSizeFilter: petSizeFilter as any,
      latitude: latitude ? parseFloat(latitude as string) : undefined,
      longitude: longitude ? parseFloat(longitude as string) : undefined,
      radiusKm: radiusKm ? parseFloat(radiusKm as string) : undefined,
      limit: limit ? parseInt(limit as string) : 20,
      offset: offset ? parseInt(offset as string) : 0,
    });

    res.sendSuccess(StatusCodes.OK, '산책 메이트 목록 조회 성공', {
      mates: result.mates.map((mate) => ({
        id: mate.id.toString(),
        walkingDate: mate.walkingDate.toISOString(),
        location: mate.location,
        latitude: mate.latitude?.toString(),
        longitude: mate.longitude?.toString(),
        duration: mate.duration,
        maxParticipants: mate.maxParticipants,
        currentParticipants: mate.currentParticipants,
        petSizeFilter: mate.petSizeFilter,
        status: mate.status,
        description: mate.description,
        hostUser: {
          id: mate.hostUser.id.toString(),
          username: mate.hostUser.username,
          name: mate.hostUser.name,
          profileImage: mate.hostUser.profileImage,
          region: mate.hostUser.region,
        },
        route: mate.route ? {
          id: mate.route.id.toString(),
          routeName: mate.route.routeName,
          distance: mate.route.distance?.toString(),
          difficulty: mate.route.difficulty,
        } : null,
        participantCount: mate._count.participants,
        waitlistCount: mate._count.waitlist,
        createdAt: mate.createdAt.toISOString(),
      })),
      totalCount: result.totalCount,
    });
  } catch (error) {
    next(error);
  }
};

// 산책 메이트 상세 조회
export const getWalkingMateDetailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mateId = BigInt(req.params.id);
    const mate = await getWalkingMateDetailService(mateId);

    res.sendSuccess(StatusCodes.OK, '산책 메이트 상세 조회 성공', {
      id: mate.id.toString(),
      walkingDate: mate.walkingDate.toISOString(),
      location: mate.location,
      latitude: mate.latitude?.toString(),
      longitude: mate.longitude?.toString(),
      duration: mate.duration,
      maxParticipants: mate.maxParticipants,
      currentParticipants: mate.currentParticipants,
      petSizeFilter: mate.petSizeFilter,
      status: mate.status,
      description: mate.description,
      hostUser: {
        id: mate.hostUser.id.toString(),
        username: mate.hostUser.username,
        name: mate.hostUser.name,
        profileImage: mate.hostUser.profileImage,
        region: mate.hostUser.region,
        isPetOwner: mate.hostUser.isPetOwner,
      },
      route: mate.route ? {
        id: mate.route.id.toString(),
        routeName: mate.route.routeName,
        region: mate.route.region,
        distance: mate.route.distance?.toString(),
        duration: mate.route.duration,
        difficulty: mate.route.difficulty,
        pathData: mate.route.pathData,
      } : null,
      participants: mate.participants.map((p) => ({
        id: p.id.toString(),
        user: {
          id: p.user.id.toString(),
          username: p.user.username,
          name: p.user.name,
          profileImage: p.user.profileImage,
        },
        pets: p.walkingParticipantPets.map((pp) => ({
          id: pp.pet.id.toString(),
          petName: pp.pet.petName,
          species: pp.pet.species,
          size: pp.pet.size,
          profileImage: pp.pet.profileImage,
        })),
        status: p.status,
        joinedAt: p.joinedAt.toISOString(),
      })),
      waitlist: mate.waitlist.map((w) => ({
        id: w.id.toString(),
        user: {
          id: w.user.id.toString(),
          username: w.user.username,
          name: w.user.name,
          profileImage: w.user.profileImage,
        },
        priority: w.priority,
        createdAt: w.createdAt.toISOString(),
      })),
      createdAt: mate.createdAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// 산책 메이트 수정
export const updateWalkingMateController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const mateId = BigInt(req.params.id);
    const updateData = req.body;

    if (updateData.routeId) updateData.routeId = BigInt(updateData.routeId);
    if (updateData.walkingDate) updateData.walkingDate = new Date(updateData.walkingDate);
    if (updateData.latitude) updateData.latitude = parseFloat(updateData.latitude);
    if (updateData.longitude) updateData.longitude = parseFloat(updateData.longitude);
    if (updateData.duration) updateData.duration = parseInt(updateData.duration);
    if (updateData.maxParticipants) updateData.maxParticipants = parseInt(updateData.maxParticipants);

    const mate = await updateWalkingMateService(mateId, userId, updateData);

    res.sendSuccess(StatusCodes.OK, '산책 메이트 수정 성공', {
      id: mate.id.toString(),
      walkingDate: mate.walkingDate.toISOString(),
      location: mate.location,
    });
  } catch (error) {
    next(error);
  }
};

// 산책 메이트 삭제
export const deleteWalkingMateController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const mateId = BigInt(req.params.id);
    await deleteWalkingMateService(mateId, userId);

    res.sendSuccess(StatusCodes.OK, '산책 메이트 삭제 성공');
  } catch (error) {
    next(error);
  }
};

// 산책 메이트 참가 신청
export const joinWalkingMateController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const mateId = BigInt(req.params.id);
    const { petIds } = req.body;

    if (!petIds || !Array.isArray(petIds) || petIds.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).sendError(
        StatusCodes.BAD_REQUEST,
        'petIds (배열)는 필수입니다.'
      );
    }

    const result = await joinWalkingMateService(
      mateId,
      userId,
      petIds.map((id: string) => BigInt(id))
    );

    if (result.type === 'waitlist') {
      res.sendSuccess(StatusCodes.CREATED, '대기열에 추가되었습니다.', {
        type: 'waitlist',
        waitlistId: result.waitlist.id.toString(),
        priority: result.waitlist.priority,
      });
    } else if (result.type === 'participant') {
      res.sendSuccess(StatusCodes.CREATED, '참가 신청이 완료되었습니다.', {
        type: 'participant',
        participantId: result.participant.id.toString(),
        status: result.participant.status,
      });
    }
  } catch (error) {
    next(error);
  }
};

// 산책 메이트 참가 취소
export const leaveWalkingMateController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const mateId = BigInt(req.params.id);
    await leaveWalkingMateService(mateId, userId);

    res.sendSuccess(StatusCodes.OK, '참가 취소 성공');
  } catch (error) {
    next(error);
  }
};

// 참가 승인
export const approveParticipantController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const participantId = BigInt(req.params.id);
    await approveParticipantService(participantId, userId);

    res.sendSuccess(StatusCodes.OK, '참가 승인 성공');
  } catch (error) {
    next(error);
  }
};

// 참가 거절
export const rejectParticipantController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const participantId = BigInt(req.params.id);
    await rejectParticipantService(participantId, userId);

    res.sendSuccess(StatusCodes.OK, '참가 거절 성공');
  } catch (error) {
    next(error);
  }
};

// 대기 취소
export const cancelWaitlistController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const waitlistId = BigInt(req.params.id);
    await cancelWaitlistService(waitlistId, userId);

    res.sendSuccess(StatusCodes.OK, '대기 취소 성공');
  } catch (error) {
    next(error);
  }
};

