import {
  createFollow,
  deleteFollow,
  isFollowing,
  findFollowers,
  findFollowing,
  countFollowers,
  countFollowing,
  isMutualFollow,
} from '../repositories/follow.repository';
import { findUserById } from '../repositories/user.repository';

// 팔로우
export const followUserService = async (followerId: bigint, followingId: bigint) => {
  // 자기 자신 팔로우 방지
  if (followerId === followingId) {
    throw Object.assign(new Error('자기 자신을 팔로우할 수 없습니다.'), { statusCode: 400 });
  }

  // 대상 사용자 존재 확인
  const targetUser = await findUserById(followingId);
  if (!targetUser) {
    throw Object.assign(new Error('사용자를 찾을 수 없습니다.'), { statusCode: 404 });
  }

  // 이미 팔로우 중인지 확인
  const alreadyFollowing = await isFollowing(followerId, followingId);
  if (alreadyFollowing) {
    throw Object.assign(new Error('이미 이 사용자를 팔로우하고 있습니다.'), { statusCode: 409 });
  }

  return createFollow(followerId, followingId);
};

// 언팔로우
export const unfollowUserService = async (followerId: bigint, followingId: bigint) => {
  const result = await deleteFollow(followerId, followingId);
  if (!result) {
    throw Object.assign(new Error('팔로우 관계를 찾을 수 없습니다.'), { statusCode: 404 });
  }
  return result;
};

// 팔로워 목록 조회
export const getFollowersService = async (userId: bigint, limit?: number, offset?: number) => {
  const followers = await findFollowers(userId, limit, offset);
  const totalCount = await countFollowers(userId);

  return {
    followers: followers.map((f) => f.follower),
    totalCount,
  };
};

// 팔로잉 목록 조회
export const getFollowingService = async (userId: bigint, limit?: number, offset?: number) => {
  const following = await findFollowing(userId, limit, offset);
  const totalCount = await countFollowing(userId);

  return {
    following: following.map((f) => f.following),
    totalCount,
  };
};

// 팔로우 상태 조회
export const getFollowStatusService = async (userId: bigint, targetUserId: bigint) => {
  const isFollowingTarget = await isFollowing(userId, targetUserId);
  const isFollowedByTarget = await isFollowing(targetUserId, userId);
  const isMutual = isFollowingTarget && isFollowedByTarget;

  return {
    isFollowing: isFollowingTarget,
    isFollower: isFollowedByTarget,
    isMutual,
  };
};

// 사용자 팔로우 통계
export const getFollowStatsService = async (userId: bigint) => {
  const followerCount = await countFollowers(userId);
  const followingCount = await countFollowing(userId);

  return {
    followerCount,
    followingCount,
  };
};

