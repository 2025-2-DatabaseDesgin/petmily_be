import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  registerPetService,
  getMyPetsService,
  getPetDetailService,
  updatePetService,
  deletePetService,
  sendPetFriendRequestService,
  respondToPetFriendRequestService,
  getPetFriendsService,
  getPendingFriendRequestsService,
} from '../services/pet.service';

// 반려동물 등록
export const registerPetController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const {
      petName,
      species,
      breed,
      age,
      birthDate,
      gender,
      isNeutered,
      size,
      weight,
      personality,
      healthStatus,
      specialNotes,
      profileImage,
      registrationNumber,
      microchipNumber,
    } = req.body;

    if (!petName || !species) {
      return res.status(StatusCodes.BAD_REQUEST).sendError(StatusCodes.BAD_REQUEST, 'petName and species are required');
    }

    const pet = await registerPetService(userId, {
      petName,
      species,
      breed,
      age,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      gender,
      isNeutered,
      size,
      weight: weight ? parseFloat(weight) : undefined,
      personality,
      healthStatus,
      specialNotes,
      profileImage,
      registrationNumber,
      microchipNumber,
    });

    res.sendSuccess(StatusCodes.CREATED, '반려동물 등록 성공', {
      id: pet.id.toString(),
      petName: pet.petName,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      size: pet.size,
      profileImage: pet.profileImage,
    });
  } catch (error) {
    next(error);
  }
};

// 내 반려동물 목록 조회
export const getMyPetsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const pets = await getMyPetsService(userId);

    res.sendSuccess(StatusCodes.OK, '반려동물 목록 조회 성공', {
      pets: pets.map((pet) => ({
        id: pet.id.toString(),
        petName: pet.petName,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        size: pet.size,
        profileImage: pet.profileImage,
        isVerified: pet.isVerified,
        createdAt: pet.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    next(error);
  }
};

// 반려동물 상세 조회
export const getPetDetailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const petId = BigInt(req.params.id);
    const pet = await getPetDetailService(petId);

    res.sendSuccess(StatusCodes.OK, '반려동물 상세 조회 성공', {
      id: pet.id.toString(),
      petName: pet.petName,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      birthDate: pet.birthDate?.toISOString(),
      gender: pet.gender,
      isNeutered: pet.isNeutered,
      size: pet.size,
      weight: pet.weight?.toString(),
      personality: pet.personality,
      healthStatus: pet.healthStatus,
      specialNotes: pet.specialNotes,
      profileImage: pet.profileImage,
      registrationNumber: pet.registrationNumber,
      microchipNumber: pet.microchipNumber,
      isVerified: pet.isVerified,
      createdAt: pet.createdAt.toISOString(),
      updatedAt: pet.updatedAt.toISOString(),
      owner: pet.user ? {
        id: pet.user.id.toString(),
        username: pet.user.username,
        name: pet.user.name,
        profileImage: pet.user.profileImage,
      } : undefined,
    });
  } catch (error) {
    next(error);
  }
};

// 반려동물 정보 수정
export const updatePetController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const petId = BigInt(req.params.id);
    const updateData = req.body;

    // birthDate 변환
    if (updateData.birthDate) {
      updateData.birthDate = new Date(updateData.birthDate);
    }

    // weight 변환
    if (updateData.weight) {
      updateData.weight = parseFloat(updateData.weight);
    }

    const pet = await updatePetService(petId, userId, updateData);

    res.sendSuccess(StatusCodes.OK, '반려동물 정보 수정 성공', {
      id: pet.id.toString(),
      petName: pet.petName,
      species: pet.species,
      updatedAt: pet.updatedAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

// 반려동물 삭제
export const deletePetController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const petId = BigInt(req.params.id);
    await deletePetService(petId, userId);

    res.sendSuccess(StatusCodes.OK, '반려동물 삭제 성공');
  } catch (error) {
    next(error);
  }
};

// 반려동물 친구 요청
export const sendPetFriendRequestController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const myPetId = BigInt(req.params.id);
    const { targetPetId } = req.body;

    if (!targetPetId) {
      return res.status(StatusCodes.BAD_REQUEST).sendError(StatusCodes.BAD_REQUEST, 'targetPetId is required');
    }

    const friendship = await sendPetFriendRequestService(myPetId, BigInt(targetPetId), userId);

    res.sendSuccess(StatusCodes.CREATED, '친구 요청 전송 성공', {
      friendshipId: friendship.id.toString(),
      status: friendship.status,
    });
  } catch (error) {
    next(error);
  }
};

// 반려동물 친구 요청 승인/거절
export const respondToPetFriendRequestController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const friendshipId = BigInt(req.params.id);
    const { accept } = req.body;

    if (typeof accept !== 'boolean') {
      return res.status(StatusCodes.BAD_REQUEST).sendError(StatusCodes.BAD_REQUEST, 'accept (boolean) is required');
    }

    const friendship = await respondToPetFriendRequestService(friendshipId, userId, accept);

    res.sendSuccess(StatusCodes.OK, accept ? '친구 요청 승인 성공' : '친구 요청 거절 성공', {
      friendshipId: friendship.id.toString(),
      status: friendship.status,
    });
  } catch (error) {
    next(error);
  }
};

// 반려동물 친구 목록 조회
export const getPetFriendsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const petId = BigInt(req.params.id);
    const friends = await getPetFriendsService(petId);

    res.sendSuccess(StatusCodes.OK, '친구 목록 조회 성공', {
      friends: friends.map((friend) => ({
        id: friend.id.toString(),
        petName: friend.petName,
        species: friend.species,
        breed: friend.breed,
        size: friend.size,
        profileImage: friend.profileImage,
        owner: friend.user ? {
          id: friend.user.id.toString(),
          username: friend.user.username,
          name: friend.user.name,
        } : undefined,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// 받은 친구 요청 목록 조회
export const getPendingFriendRequestsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).sendError(StatusCodes.UNAUTHORIZED, '인증이 필요합니다.');
    }

    const requests = await getPendingFriendRequestsService(userId);

    res.sendSuccess(StatusCodes.OK, '친구 요청 목록 조회 성공', {
      requests: requests.map((req) => ({
        friendshipId: req.id.toString(),
        pet1: {
          id: req.pet1.id.toString(),
          petName: req.pet1.petName,
          species: req.pet1.species,
          profileImage: req.pet1.profileImage,
          owner: {
            id: req.pet1.user.id.toString(),
            username: req.pet1.user.username,
            name: req.pet1.user.name,
          },
        },
        pet2: {
          id: req.pet2.id.toString(),
          petName: req.pet2.petName,
          species: req.pet2.species,
          profileImage: req.pet2.profileImage,
          owner: {
            id: req.pet2.user.id.toString(),
            username: req.pet2.user.username,
            name: req.pet2.user.name,
          },
        },
        requestedAt: req.requestedAt.toISOString(),
      })),
    });
  } catch (error) {
    next(error);
  }
};

