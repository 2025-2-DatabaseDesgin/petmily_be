import { FacilityType } from '@prisma/client';
import {
  createFacility,
  findFacilities,
  findFacilityById,
  updateFacility,
  deleteFacility,
  linkFacilityToRoute,
  unlinkFacilityFromRoute,
  countFacilities,
} from '../repositories/facility.repository';

// 시설 생성 (관리자 전용)
export const createFacilityService = async (data: {
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
}) => {
  return createFacility(data);
};

// 시설 목록 조회
export const getFacilitiesService = async (filters?: {
  type?: FacilityType;
  isSponsor?: boolean;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  limit?: number;
  offset?: number;
}) => {
  const facilities = await findFacilities(filters);
  const totalCount = await countFacilities({
    type: filters?.type,
    isSponsor: filters?.isSponsor,
  });

  return {
    facilities,
    totalCount,
  };
};

// 시설 상세 조회
export const getFacilityDetailService = async (facilityId: bigint) => {
  const facility = await findFacilityById(facilityId);
  if (!facility) {
    throw Object.assign(new Error('Facility not found'), { statusCode: 404 });
  }
  return facility;
};

// 시설 수정 (관리자 전용)
export const updateFacilityService = async (
  facilityId: bigint,
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
    imageUrl: string;
  }>
) => {
  return updateFacility(facilityId, data);
};

// 시설 삭제 (관리자 전용)
export const deleteFacilityService = async (facilityId: bigint) => {
  return deleteFacility(facilityId);
};

// 산책로에 시설 연결
export const linkFacilityToRouteService = async (data: {
  routeId: bigint;
  facilityId: bigint;
  visitOrder?: number;
  distanceFromStartM?: number;
  isMandatory?: boolean;
  notes?: string;
}) => {
  // 시설 존재 확인
  const facility = await findFacilityById(data.facilityId);
  if (!facility) {
    throw Object.assign(new Error('Facility not found'), { statusCode: 404 });
  }

  return linkFacilityToRoute(data);
};

// 산책로에서 시설 연결 해제
export const unlinkFacilityFromRouteService = async (routeId: bigint, facilityId: bigint) => {
  return unlinkFacilityFromRoute(routeId, facilityId);
};

