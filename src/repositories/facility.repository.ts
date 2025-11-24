import { PrismaClient, Facility, FacilityType } from '@prisma/client';

const prisma = new PrismaClient();

// 시설 생성
export const createFacility = async (data: {
  name: string;
  type: FacilityType;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  description?: string;
  isSponsor?: boolean;
  discountInfo?: string;
  openingHours?: string;
  imageUrl?: string;
}): Promise<Facility> => {
  return prisma.facility.create({
    data: {
      name: data.name,
      type: data.type,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      phone: data.phone,
      description: data.description,
      isSponsor: data.isSponsor ?? false,
      discountInfo: data.discountInfo,
      openingHours: data.openingHours,
      imageUrl: data.imageUrl,
    },
  });
};

// 시설 목록 조회
export const findFacilities = async (filters?: {
  type?: FacilityType;
  isSponsor?: boolean;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  limit?: number;
  offset?: number;
}) => {
  const where: any = {};

  if (filters?.type) {
    where.type = filters.type;
  }
  if (filters?.isSponsor !== undefined) {
    where.isSponsor = filters.isSponsor;
  }

  // 위치 기반 검색 (간단한 사각형 범위)
  if (filters?.latitude && filters?.longitude && filters?.radiusKm) {
    const latDelta = filters.radiusKm / 111; // 대략 1도 = 111km
    const lonDelta = filters.radiusKm / (111 * Math.cos((filters.latitude * Math.PI) / 180));

    where.latitude = {
      gte: filters.latitude - latDelta,
      lte: filters.latitude + latDelta,
    };
    where.longitude = {
      gte: filters.longitude - lonDelta,
      lte: filters.longitude + lonDelta,
    };
  }

  return prisma.facility.findMany({
    where,
    orderBy: [
      { isSponsor: 'desc' },
      { rating: 'desc' },
    ],
    take: filters?.limit,
    skip: filters?.offset,
  });
};

// 시설 상세 조회
export const findFacilityById = async (id: bigint) => {
  return prisma.facility.findUnique({
    where: { id },
    include: {
      facilityRoutes: {
        include: {
          route: {
            select: {
              id: true,
              routeName: true,
              region: true,
              distance: true,
              rating: true,
            },
          },
        },
      },
    },
  });
};

// 시설 수정
export const updateFacility = async (
  id: bigint,
  data: Partial<{
    name: string;
    type: FacilityType;
    address: string;
    latitude: number;
    longitude: number;
    phone: string;
    description: string;
    isSponsor: boolean;
    discountInfo: string;
    openingHours: string;
    rating: number;
    imageUrl: string;
  }>
): Promise<Facility> => {
  return prisma.facility.update({
    where: { id },
    data,
  });
};

// 시설 삭제
export const deleteFacility = async (id: bigint): Promise<Facility> => {
  return prisma.facility.delete({
    where: { id },
  });
};

// 산책로-시설 연결
export const linkFacilityToRoute = async (data: {
  routeId: bigint;
  facilityId: bigint;
  visitOrder?: number;
  distanceFromStartM?: number;
  isMandatory?: boolean;
  notes?: string;
}) => {
  return prisma.facilityRoute.create({
    data: {
      routeId: data.routeId,
      facilityId: data.facilityId,
      visitOrder: data.visitOrder,
      distanceFromStartM: data.distanceFromStartM,
      isMandatory: data.isMandatory ?? false,
      notes: data.notes,
    },
  });
};

// 산책로-시설 연결 해제
export const unlinkFacilityFromRoute = async (routeId: bigint, facilityId: bigint) => {
  return prisma.facilityRoute.delete({
    where: {
      routeId_facilityId: {
        routeId,
        facilityId,
      },
    },
  });
};

// 산책로의 시설 목록 조회
export const findFacilitiesByRoute = async (routeId: bigint) => {
  return prisma.facilityRoute.findMany({
    where: { routeId },
    include: {
      facility: true,
    },
    orderBy: {
      visitOrder: 'asc',
    },
  });
};

// 시설 개수 조회
export const countFacilities = async (filters?: {
  type?: FacilityType;
  isSponsor?: boolean;
}): Promise<number> => {
  const where: any = {};
  if (filters?.type) where.type = filters.type;
  if (filters?.isSponsor !== undefined) where.isSponsor = filters.isSponsor;

  return prisma.facility.count({ where });
};

