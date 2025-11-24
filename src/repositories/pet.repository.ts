import { PrismaClient, Pet, PetSpecies, PetGender, PetSize } from '@prisma/client';

const prisma = new PrismaClient();

// 반려동물 생성
export const createPet = async (data: {
  userId: bigint;
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
  isVerified?: boolean;
}): Promise<Pet> => {
  return prisma.pet.create({
    data: {
      userId: data.userId,
      petName: data.petName,
      species: data.species,
      breed: data.breed,
      age: data.age,
      birthDate: data.birthDate,
      gender: data.gender,
      isNeutered: data.isNeutered ?? false,
      size: data.size,
      weight: data.weight,
      personality: data.personality,
      healthStatus: data.healthStatus,
      specialNotes: data.specialNotes,
      profileImage: data.profileImage,
      registrationNumber: data.registrationNumber,
      microchipNumber: data.microchipNumber,
      isVerified: data.isVerified ?? false,
    },
  });
};

// 사용자의 반려동물 목록 조회
export const findPetsByUserId = async (userId: bigint): Promise<Pet[]> => {
  return prisma.pet.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

// 반려동물 상세 조회
export const findPetById = async (id: bigint): Promise<Pet | null> => {
  return prisma.pet.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          profileImage: true,
        },
      },
    },
  });
};

// 반려동물 정보 수정
export const updatePet = async (
  id: bigint,
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
    isVerified: boolean;
  }>
): Promise<Pet> => {
  return prisma.pet.update({
    where: { id },
    data,
  });
};

// 반려동물 삭제
export const deletePet = async (id: bigint): Promise<Pet> => {
  return prisma.pet.delete({
    where: { id },
  });
};

// 반려동물 소유자 확인
export const isPetOwner = async (petId: bigint, userId: bigint): Promise<boolean> => {
  const pet = await prisma.pet.findUnique({
    where: { id: petId },
    select: { userId: true },
  });
  return pet?.userId === userId;
};

// 반려동물 친구 요청 생성
export const createPetFriendship = async (petId1: bigint, petId2: bigint) => {
  // petId1이 항상 작은 값이 되도록 정렬
  const [smallerId, largerId] = petId1 < petId2 ? [petId1, petId2] : [petId2, petId1];
  
  return prisma.petFriendship.create({
    data: {
      petId1: smallerId,
      petId2: largerId,
    },
  });
};

// 반려동물 친구 요청 조회
export const findPetFriendshipById = async (friendshipId: bigint) => {
  return prisma.petFriendship.findUnique({
    where: { id: friendshipId },
    include: {
      pet1: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
        },
      },
      pet2: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
        },
      },
    },
  });
};

// 반려동물 친구 요청 상태 업데이트
export const updatePetFriendshipStatus = async (
  friendshipId: bigint,
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED',
  acceptedAt?: Date
) => {
  return prisma.petFriendship.update({
    where: { id: friendshipId },
    data: {
      status,
      acceptedAt,
    },
  });
};

// 반려동물의 친구 목록 조회
export const findPetFriends = async (petId: bigint) => {
  return prisma.petFriendship.findMany({
    where: {
      OR: [{ petId1: petId }, { petId2: petId }],
      status: 'ACCEPTED',
    },
    include: {
      pet1: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
        },
      },
      pet2: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
        },
      },
    },
  });
};

// 반려동물 친구 요청 목록 조회 (받은 요청)
export const findPendingFriendRequests = async (petId: bigint) => {
  return prisma.petFriendship.findMany({
    where: {
      OR: [{ petId1: petId }, { petId2: petId }],
      status: 'PENDING',
    },
    include: {
      pet1: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
        },
      },
      pet2: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
            },
          },
        },
      },
    },
  });
};

