import { PetSpecies, PetGender, PetSize } from '@prisma/client';
import {
  createPet,
  findPetsByUserId,
  findPetById,
  updatePet,
  deletePet,
  isPetOwner,
  createPetFriendship,
  findPetFriendshipById,
  updatePetFriendshipStatus,
  findPetFriends,
  findPendingFriendRequests,
} from '../repositories/pet.repository';

// 반려동물 등록
export const registerPetService = async (
  userId: bigint,
  data: {
    petName: string;
    species: PetSpecies;
    breed?: string;
    age?: number;
    birthDate?: Date;
    gender?: PetGender;
    isNeutered?: boolean;
    size?: PetSize;
    weight?: number;
    personality?: string;
    healthStatus?: string;
    specialNotes?: string;
    profileImage?: string;
    registrationNumber?: string;
    microchipNumber?: string;
  }
) => {
  return createPet({
    userId,
    ...data,
  });
};

// 내 반려동물 목록 조회
export const getMyPetsService = async (userId: bigint) => {
  return findPetsByUserId(userId);
};

// 반려동물 상세 조회
export const getPetDetailService = async (petId: bigint) => {
  const pet = await findPetById(petId);
  if (!pet) {
    throw Object.assign(new Error('Pet not found'), { statusCode: 404 });
  }
  return pet;
};

// 반려동물 정보 수정
export const updatePetService = async (
  petId: bigint,
  userId: bigint,
  data: Partial<{
    petName: string;
    species: PetSpecies;
    breed: string;
    age: number;
    birthDate: Date;
    gender: PetGender;
    isNeutered: boolean;
    size: PetSize;
    weight: number;
    personality: string;
    healthStatus: string;
    specialNotes: string;
    profileImage: string;
    registrationNumber: string;
    microchipNumber: string;
  }>
) => {
  // 소유자 확인
  const isOwner = await isPetOwner(petId, userId);
  if (!isOwner) {
    throw Object.assign(new Error('Not authorized to update this pet'), { statusCode: 403 });
  }

  return updatePet(petId, data);
};

// 반려동물 삭제
export const deletePetService = async (petId: bigint, userId: bigint) => {
  // 소유자 확인
  const isOwner = await isPetOwner(petId, userId);
  if (!isOwner) {
    throw Object.assign(new Error('Not authorized to delete this pet'), { statusCode: 403 });
  }

  return deletePet(petId);
};

// 반려동물 친구 요청
export const sendPetFriendRequestService = async (
  myPetId: bigint,
  targetPetId: bigint,
  userId: bigint
) => {
  // 내 반려동물인지 확인
  const isOwner = await isPetOwner(myPetId, userId);
  if (!isOwner) {
    throw Object.assign(new Error('Not authorized to send friend request'), { statusCode: 403 });
  }

  // 자기 자신에게 요청 방지
  if (myPetId === targetPetId) {
    throw Object.assign(new Error('Cannot send friend request to yourself'), { statusCode: 400 });
  }

  // 대상 반려동물 존재 확인
  const targetPet = await findPetById(targetPetId);
  if (!targetPet) {
    throw Object.assign(new Error('Target pet not found'), { statusCode: 404 });
  }

  return createPetFriendship(myPetId, targetPetId);
};

// 반려동물 친구 요청 승인/거절
export const respondToPetFriendRequestService = async (
  friendshipId: bigint,
  userId: bigint,
  accept: boolean
) => {
  const friendship = await findPetFriendshipById(friendshipId);
  if (!friendship) {
    throw Object.assign(new Error('Friend request not found'), { statusCode: 404 });
  }

  // 요청 받은 반려동물의 소유자인지 확인
  const isPet1Owner = friendship.pet1.userId === userId;
  const isPet2Owner = friendship.pet2.userId === userId;

  if (!isPet1Owner && !isPet2Owner) {
    throw Object.assign(new Error('Not authorized to respond to this request'), { statusCode: 403 });
  }

  const status = accept ? 'ACCEPTED' : 'REJECTED';
  const acceptedAt = accept ? new Date() : undefined;

  return updatePetFriendshipStatus(friendshipId, status, acceptedAt);
};

// 반려동물 친구 목록 조회
export const getPetFriendsService = async (petId: bigint) => {
  const friendships = await findPetFriends(petId);
  
  // 친구 반려동물만 추출
  return friendships.map((friendship) => {
    const friend = friendship.pet1.id === petId ? friendship.pet2 : friendship.pet1;
    return friend;
  });
};

// 받은 친구 요청 목록 조회
export const getPendingFriendRequestsService = async (userId: bigint) => {
  // 사용자의 모든 반려동물 조회
  const myPets = await findPetsByUserId(userId);
  const myPetIds = myPets.map((pet) => pet.id);

  // 각 반려동물의 대기 중인 요청 조회
  const allRequests = await Promise.all(
    myPetIds.map((petId) => findPendingFriendRequests(petId))
  );

  return allRequests.flat();
};

