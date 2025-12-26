-- ============================================
-- Petmily 초기 목데이터 삽입 쿼리
-- ============================================
-- 주의: 비밀번호는 bcrypt로 해시된 값입니다.
-- 테스트용 비밀번호: "password123" (모든 사용자 동일)

-- ============================================
-- 1. 사용자 데이터 (Users)
-- ============================================
INSERT INTO users (
  username, password, email, name, birth_date, phone, 
  region, latitude, longitude, is_pet_owner, role, status, created_at
) VALUES
-- 관리자 계정
('admin', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'admin@petmily.com', '관리자', '1990-01-01', '010-0000-0000', 
 '서울시 강남구', 37.4979, 127.0276, false, 'ADMIN', 'ACTIVE', NOW()),

-- 일반 사용자 1 (반려동물 소유자)
('user1', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'user1@example.com', '김철수', '1995-05-15', '010-1111-1111', 
 '서울시 강남구', 37.4979, 127.0276, true, 'USER', 'ACTIVE', NOW()),

-- 일반 사용자 2 (반려동물 소유자)
('user2', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'user2@example.com', '이영희', '1992-08-20', '010-2222-2222', 
 '서울시 서초구', 37.4837, 127.0324, true, 'USER', 'ACTIVE', NOW()),

-- 일반 사용자 3 (반려동물 소유자)
('user3', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'user3@example.com', '박민수', '1988-12-10', '010-3333-3333', 
 '서울시 송파구', 37.5145, 127.1051, true, 'USER', 'ACTIVE', NOW()),

-- 일반 사용자 4 (반려동물 없음)
('user4', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'user4@example.com', '최지은', '1997-03-25', '010-4444-4444', 
 '서울시 마포구', 37.5665, 126.9780, false, 'USER', 'ACTIVE', NOW());

-- ============================================
-- 2. 반려동물 데이터 (Pets)
-- ============================================
-- user1의 반려동물
INSERT INTO pets (
  user_id, pet_name, species, breed, age, birth_date, gender, 
  is_neutered, size, weight, personality, health_status, created_at
) VALUES
((SELECT id FROM users WHERE username = 'user1'), '뽀삐', 'DOG', '골든 리트리버', 3, '2021-01-15', 'MALE', 
 true, 'LARGE', 25.5, '활발하고 친근함', '건강함', NOW()),

((SELECT id FROM users WHERE username = 'user1'), '치즈', 'DOG', '비글', 2, '2022-03-20', 'FEMALE', 
 true, 'MEDIUM', 12.0, '장난스럽고 호기심 많음', '건강함', NOW()),

-- user2의 반려동물
((SELECT id FROM users WHERE username = 'user2'), '루이', 'DOG', '푸들', 4, '2020-06-10', 'MALE', 
 true, 'SMALL', 5.5, '똑똑하고 순함', '건강함', NOW()),

-- user3의 반려동물
((SELECT id FROM users WHERE username = 'user3'), '나비', 'CAT', '페르시안', 5, '2019-11-05', 'FEMALE', 
 true, 'SMALL', 4.2, '조용하고 온순함', '건강함', NOW()),

((SELECT id FROM users WHERE username = 'user3'), '토리', 'DOG', '시바견', 1, '2023-08-12', 'MALE', 
 false, 'MEDIUM', 8.0, '에너지 넘침', '건강함', NOW());

-- ============================================
-- 3. 산책로 데이터 (Walking Routes)
-- ============================================
INSERT INTO walking_routes (
  created_by, route_name, region, distance, duration, difficulty, 
  description, rating, review_count, created_at
) VALUES
(NULL, '한강공원 산책로', '서울시 강남구', 3.5, 45, 'EASY', 
 '한강을 따라 걷는 편안한 산책로입니다. 강풍을 맞으며 산책하기 좋습니다.', 4.5, 10, NOW()),

(NULL, '올림픽공원 산책로', '서울시 송파구', 5.0, 60, 'MODERATE', 
 '올림픽공원 내부를 도는 산책로입니다. 다양한 경관을 즐길 수 있습니다.', 4.7, 15, NOW()),

(NULL, '서울숲 산책로', '서울시 성동구', 4.2, 50, 'EASY', 
 '도심 속 자연을 느낄 수 있는 산책로입니다.', 4.3, 8, NOW()),

((SELECT id FROM users WHERE username = 'user1'), '강남구청 주변 산책로', '서울시 강남구', 2.8, 35, 'EASY', 
 '강남구청 주변을 도는 짧은 산책로입니다.', 4.0, 5, NOW()),

((SELECT id FROM users WHERE username = 'user2'), '서초동 산책로', '서울시 서초구', 3.0, 40, 'MODERATE', 
 '서초동 주변을 걷는 산책로입니다.', 4.2, 7, NOW());

-- ============================================
-- 4. 시설 데이터 (Facilities)
-- ============================================
INSERT INTO facilities (
  name, type, address, latitude, longitude, phone, description, 
  is_sponsor, discount_info, opening_hours, rating, created_at
) VALUES
('펫카페 강남점', 'CAFE', '서울시 강남구 테헤란로 123', 37.4979, 127.0276, '02-1234-5678', 
 '반려동물과 함께 즐길 수 있는 카페입니다.', true, '산책 메이트 참가자 10% 할인', '09:00-22:00', 4.5, NOW()),

('펫샵 강남점', 'SHOP', '서울시 강남구 강남대로 456', 37.4980, 127.0277, '02-2345-6789', 
 '반려동물 용품 전문 매장입니다.', true, '산책 메이트 참가자 15% 할인', '10:00-21:00', 4.3, NOW()),

('동물병원 강남점', 'HOSPITAL', '서울시 강남구 역삼로 789', 37.4981, 127.0278, '02-3456-7890', 
 '24시간 응급 진료 가능한 동물병원입니다.', false, NULL, '24시간', 4.8, NOW()),

('한강공원', 'PARK', '서울시 강남구 한강대로', 37.5200, 127.1200, NULL, 
 '반려동물과 함께 산책하기 좋은 공원입니다.', false, NULL, '24시간', 4.6, NOW()),

('올림픽공원', 'PARK', '서울시 송파구 올림픽로', 37.5210, 127.1210, NULL, 
 '넓은 공원에서 반려동물과 산책할 수 있습니다.', false, NULL, '05:00-23:00', 4.7, NOW()),

('펫카페 서초점', 'CAFE', '서울시 서초구 서초대로 321', 37.4837, 127.0324, '02-4567-8901', 
 '서초구에 위치한 펫카페입니다.', true, '산책 메이트 참가자 10% 할인', '09:00-22:00', 4.4, NOW()),

('동물병원 서초점', 'HOSPITAL', '서울시 서초구 반포대로 654', 37.4838, 127.0325, '02-5678-9012', 
 '서초구 동물병원입니다.', false, NULL, '09:00-20:00', 4.5, NOW());

-- ============================================
-- 5. 산책로-시설 연결 데이터 (Facility Routes)
-- ============================================
-- 한강공원 산책로에 시설 연결
INSERT INTO facility_routes (route_id, facility_id, visit_order, distance_from_start_m, is_mandatory, notes)
SELECT 
  (SELECT id FROM walking_routes WHERE route_name = '한강공원 산책로' LIMIT 1),
  (SELECT id FROM facilities WHERE name = '펫카페 강남점' LIMIT 1),
  1, 500, false, '산책 시작 전 커피 한 잔'
UNION ALL
SELECT 
  (SELECT id FROM walking_routes WHERE route_name = '한강공원 산책로' LIMIT 1),
  (SELECT id FROM facilities WHERE name = '한강공원' LIMIT 1),
  2, 1000, true, '메인 산책 코스'
UNION ALL
SELECT 
  (SELECT id FROM walking_routes WHERE route_name = '한강공원 산책로' LIMIT 1),
  (SELECT id FROM facilities WHERE name = '펫샵 강남점' LIMIT 1),
  3, 2500, false, '산책 후 용품 구매 가능';

-- 올림픽공원 산책로에 시설 연결
INSERT INTO facility_routes (route_id, facility_id, visit_order, distance_from_start_m, is_mandatory, notes)
SELECT 
  (SELECT id FROM walking_routes WHERE route_name = '올림픽공원 산책로' LIMIT 1),
  (SELECT id FROM facilities WHERE name = '올림픽공원' LIMIT 1),
  1, 0, true, '시작 지점'
UNION ALL
SELECT 
  (SELECT id FROM walking_routes WHERE route_name = '올림픽공원 산책로' LIMIT 1),
  (SELECT id FROM facilities WHERE name = '동물병원 강남점' LIMIT 1),
  2, 2000, false, '긴급 시 이용 가능';

-- ============================================
-- 6. 팔로우 관계 (Follows)
-- ============================================
INSERT INTO follows (follower_id, following_id, created_at)
SELECT 
  (SELECT id FROM users WHERE username = 'user1'),
  (SELECT id FROM users WHERE username = 'user2'),
  NOW()
UNION ALL
SELECT 
  (SELECT id FROM users WHERE username = 'user2'),
  (SELECT id FROM users WHERE username = 'user1'),
  NOW()
UNION ALL
SELECT 
  (SELECT id FROM users WHERE username = 'user1'),
  (SELECT id FROM users WHERE username = 'user3'),
  NOW()
UNION ALL
SELECT 
  (SELECT id FROM users WHERE username = 'user3'),
  (SELECT id FROM users WHERE username = 'user2'),
  NOW();

-- ============================================
-- 7. 반려동물 친구 관계 (Pet Friendships)
-- ============================================
INSERT INTO pet_friendships (pet_id_1, pet_id_2, status, requested_at, accepted_at)
SELECT 
  (SELECT id FROM pets WHERE pet_name = '뽀삐' AND user_id = (SELECT id FROM users WHERE username = 'user1') LIMIT 1),
  (SELECT id FROM pets WHERE pet_name = '루이' AND user_id = (SELECT id FROM users WHERE username = 'user2') LIMIT 1),
  'ACCEPTED', NOW(), NOW()
UNION ALL
SELECT 
  (SELECT id FROM pets WHERE pet_name = '치즈' AND user_id = (SELECT id FROM users WHERE username = 'user1') LIMIT 1),
  (SELECT id FROM pets WHERE pet_name = '토리' AND user_id = (SELECT id FROM users WHERE username = 'user3') LIMIT 1),
  'PENDING', NOW(), NULL;

-- ============================================
-- 8. 산책 메이트 모집 (Walking Mates)
-- ============================================
INSERT INTO walking_mates (
  host_user_id, route_id, walking_date, location, latitude, longitude, 
  duration, max_participants, current_participants, pet_size_filter, 
  description, status, created_at
)
SELECT 
  (SELECT id FROM users WHERE username = 'user1'),
  (SELECT id FROM walking_routes WHERE route_name = '한강공원 산책로' LIMIT 1),
  DATE_ADD(NOW(), INTERVAL 3 DAY),
  '한강공원 입구', 37.5200, 127.1200,
  60, 5, 1, 'ALL',
  '한강공원에서 함께 산책할 메이트를 모집합니다!',
  'OPEN', NOW()
UNION ALL
SELECT 
  (SELECT id FROM users WHERE username = 'user2'),
  (SELECT id FROM walking_routes WHERE route_name = '올림픽공원 산책로' LIMIT 1),
  DATE_ADD(NOW(), INTERVAL 5 DAY),
  '올림픽공원 정문', 37.5210, 127.1210,
  90, 3, 1, 'SMALL',
  '소형견 위주로 모집합니다.',
  'OPEN', NOW()
UNION ALL
SELECT 
  (SELECT id FROM users WHERE username = 'user3'),
  NULL,
  DATE_ADD(NOW(), INTERVAL 7 DAY),
  '서울숲 입구', 37.5145, 127.1051,
  45, 4, 1, 'MEDIUM',
  '중형견과 함께 산책해요!',
  'OPEN', NOW();

-- ============================================
-- 9. 산책 메이트 참가자 (Walking Participants)
-- ============================================
-- user2가 user1의 산책 메이트에 참가 신청 (PENDING 상태)
INSERT INTO walking_participants (mate_id, user_id, status, joined_at)
SELECT 
  (SELECT id FROM walking_mates WHERE host_user_id = (SELECT id FROM users WHERE username = 'user1') LIMIT 1),
  (SELECT id FROM users WHERE username = 'user2'),
  'PENDING', NOW();

-- 참가자의 반려동물 등록
INSERT INTO walking_participant_pets (participant_id, pet_id)
SELECT 
  (SELECT id FROM walking_participants WHERE user_id = (SELECT id FROM users WHERE username = 'user2') LIMIT 1),
  (SELECT id FROM pets WHERE pet_name = '루이' AND user_id = (SELECT id FROM users WHERE username = 'user2') LIMIT 1);

-- ============================================
-- 참고사항
-- ============================================
-- 1. 비밀번호: 모든 사용자의 비밀번호는 "password123"입니다.
--    실제 운영 환경에서는 각 사용자마다 다른 비밀번호를 사용해야 합니다.
--    위의 bcrypt 해시값은 예시이며, 실제로는 다음 명령어로 생성해야 합니다:
--    node -e "const bcrypt = require('bcrypt'); bcrypt.hash('password123', 10).then(hash => console.log(hash));"
--
-- 2. 좌표값: 위도(latitude)와 경도(longitude)는 실제 위치를 반영해야 합니다.
--
-- 3. 날짜: walking_date는 현재 시간 기준으로 미래 날짜로 설정되어 있습니다.
--
-- 4. 실행 방법:
--    mysql -u [username] -p [database_name] < scripts/seed.sql
--    또는 MySQL 클라이언트에서 직접 실행


