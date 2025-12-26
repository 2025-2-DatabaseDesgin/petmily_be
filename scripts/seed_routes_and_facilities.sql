-- ============================================
-- 산책로 및 시설 목 데이터 삽입
-- ============================================

-- 산책로 데이터 삽입
INSERT INTO walking_routes (created_by, route_name, region, distance, duration, difficulty, path_data, description, rating, review_count, created_at) VALUES
-- 서울 지역
(NULL, '한강공원 여의도 산책로', '서울특별시 영등포구', 3.5, 50, 'EASY', 
 '{"type":"LineString","coordinates":[[126.9012,37.5326],[126.9025,37.5335],[126.9040,37.5345],[126.9055,37.5355]]}', 
 '여의도 한강공원을 따라 걷는 평탄한 산책로입니다. 강변을 따라 걷기 좋고 반려동물과 함께하기에 최적입니다.', 4.5, 23, NOW()),

(NULL, '서울숲공원 산책로', '서울특별시 성동구', 2.8, 40, 'EASY',
 '{"type":"LineString","coordinates":[[127.0456,37.5446],[127.0470,37.5455],[127.0485,37.5465],[127.0500,37.5475]]}',
 '서울숲공원 내부를 도는 산책로입니다. 나무가 많아 그늘에서 산책하기 좋습니다.', 4.3, 18, NOW()),

(NULL, '북한산 둘레길', '서울특별시 강북구', 5.2, 90, 'MODERATE',
 '{"type":"LineString","coordinates":[[127.0123,37.6543],[127.0145,37.6565],[127.0167,37.6587],[127.0189,37.6609]]}',
 '북한산을 둘러싼 산책로입니다. 약간의 오르막이 있지만 경치가 좋습니다.', 4.7, 35, NOW()),

(NULL, '올림픽공원 산책로', '서울특별시 송파구', 4.0, 60, 'EASY',
 '{"type":"LineString","coordinates":[[127.1234,37.5212],[127.1250,37.5225],[127.1265,37.5238],[127.1280,37.5250]]}',
 '올림픽공원 내부를 한 바퀴 도는 산책로입니다. 평지로 구성되어 있어 누구나 쉽게 걸을 수 있습니다.', 4.4, 28, NOW()),

(NULL, '반포한강공원 산책로', '서울특별시 서초구', 3.0, 45, 'EASY',
 '{"type":"LineString","coordinates":[[127.0012,37.5123],[127.0025,37.5135],[127.0038,37.5147],[127.0050,37.5158]]}',
 '반포한강공원을 따라 걷는 산책로입니다. 세빛섬과 반포대교를 볼 수 있어 경치가 좋습니다.', 4.6, 31, NOW()),

-- 경기 지역
(NULL, '일산 호수공원 산책로', '경기도 고양시 일산동구', 3.8, 55, 'EASY',
 '{"type":"LineString","coordinates":[[126.7890,37.6789],[126.7905,37.6800],[126.7920,37.6811],[126.7935,37.6822]]}',
 '일산 호수공원을 둘러싼 산책로입니다. 호수를 보며 산책할 수 있어 편안합니다.', 4.5, 22, NOW()),

(NULL, '판문점 DMZ 평화의 길', '경기도 파주시', 6.5, 100, 'MODERATE',
 '{"type":"LineString","coordinates":[[126.7123,37.9567],[126.7145,37.9589],[126.7167,37.9611],[126.7189,37.9633]]}',
 'DMZ 평화의 길을 따라 걷는 산책로입니다. 역사적 의미가 있는 곳으로 교육적 가치가 높습니다.', 4.8, 15, NOW()),

-- 인천 지역
(NULL, '송도 센트럴파크 산책로', '인천광역시 연수구', 2.5, 35, 'EASY',
 '{"type":"LineString","coordinates":[[126.6567,37.3890],[126.6580,37.3902],[126.6593,37.3914],[126.6605,37.3925]]}',
 '송도 센트럴파크 내부 산책로입니다. 현대적인 도시 속 자연을 느낄 수 있습니다.', 4.2, 19, NOW()),

-- 강원 지역
(NULL, '춘천 호수길', '강원도 춘천시', 4.5, 70, 'EASY',
 '{"type":"LineString","coordinates":[[127.7234,37.8765],[127.7250,37.8780],[127.7265,37.8795],[127.7280,37.8810]]}',
 '춘천의 호수를 따라 걷는 산책로입니다. 자연 경관이 뛰어나 반려동물과 함께하기 좋습니다.', 4.9, 42, NOW()),

-- 부산 지역
(NULL, '해운대 달맞이길', '부산광역시 해운대구', 3.2, 50, 'EASY',
 '{"type":"LineString","coordinates":[[129.1789,35.1567],[129.1800,35.1580],[129.1811,35.1593],[129.1822,35.1605]]}',
 '해운대 달맞이길을 따라 걷는 산책로입니다. 바다를 보며 산책할 수 있어 인기가 많습니다.', 4.6, 38, NOW()),

(NULL, '금정산 둘레길', '부산광역시 금정구', 7.0, 120, 'HARD',
 '{"type":"LineString","coordinates":[[129.1123,35.2345],[129.1145,35.2367],[129.1167,35.2389],[129.1189,35.2411]]}',
 '금정산을 둘러싼 산책로입니다. 체력이 필요하지만 정상에서의 전망이 뛰어납니다.', 4.4, 12, NOW());

-- 시설 데이터 삽입
INSERT INTO facilities (name, type, address, latitude, longitude, phone, description, is_sponsor, discount_info, opening_hours, rating, image_url, created_at) VALUES
-- 카페
('펫프렌들리 카페 강남점', 'CAFE', '서울특별시 강남구 테헤란로 123', 37.4979, 127.0276, '02-1234-5678',
 '반려동물과 함께 방문할 수 있는 카페입니다. 실내/실외 모두 반려동물 입장 가능합니다.', true,
 '산책 후 방문 시 음료 10% 할인', '평일 10:00-22:00, 주말 11:00-23:00', 4.5, 
 'https://example.com/cafe1.jpg', NOW()),

('도그카페 여의도', 'CAFE', '서울특별시 영등포구 여의대로 456', 37.5326, 126.9012, '02-2345-6789',
 '여의도 한강공원 근처에 위치한 반려동물 전용 카페입니다.', true,
 '산책로 이용 후 방문 시 케이크 세트 15% 할인', '매일 09:00-21:00', 4.7,
 'https://example.com/cafe2.jpg', NOW()),

('펫카페 서울숲', 'CAFE', '서울특별시 성동구 서울숲2길 789', 37.5446, 127.0456, '02-3456-7890',
 '서울숲공원 인근에 위치한 반려동물 친화 카페입니다.', false,
 NULL, '평일 11:00-20:00, 주말 10:00-21:00', 4.3,
 'https://example.com/cafe3.jpg', NOW()),

-- 병원
('24시 동물병원 강남', 'HOSPITAL', '서울특별시 강남구 논현로 234', 37.5123, 127.0234, '02-4567-8901',
 '24시간 응급 진료가 가능한 동물병원입니다. 산책 중 응급상황 대비 필수 시설입니다.', true,
 '산책 세션 참여자 응급 진료 10% 할인', '24시간 운영', 4.8,
 'https://example.com/hospital1.jpg', NOW()),

('반려동물 전문병원 올림픽', 'HOSPITAL', '서울특별시 송파구 올림픽로 567', 37.5212, 127.1234, '02-5678-9012',
 '올림픽공원 근처에 위치한 반려동물 전문 병원입니다.', false,
 NULL, '평일 09:00-18:00, 토요일 09:00-13:00', 4.6,
 'https://example.com/hospital2.jpg', NOW()),

-- 샵
('펫샵 한강', 'SHOP', '서울특별시 서초구 반포대로 890', 37.5123, 127.0012, '02-6789-0123',
 '반포한강공원 근처 반려동물 용품 전문샵입니다.', true,
 '산책 후 방문 시 간식 20% 할인', '매일 10:00-20:00', 4.4,
 'https://example.com/shop1.jpg', NOW()),

('도그샵 일산', 'SHOP', '경기도 고양시 일산동구 중앙로 1234', 37.6789, 126.7890, '031-1234-5678',
 '일산 호수공원 근처 반려동물 용품샵입니다.', false,
 NULL, '평일 10:00-19:00, 주말 10:00-20:00', 4.2,
 'https://example.com/shop2.jpg', NOW()),

-- 공원
('반려동물 놀이터 송도', 'PARK', '인천광역시 연수구 송도과학로 567', 37.3890, 126.6567, '032-2345-6789',
 '송도 센트럴파크 내 반려동물 전용 놀이터입니다.', false,
 NULL, '매일 06:00-22:00', 4.5,
 'https://example.com/park1.jpg', NOW()),

('해운대 반려동물 해변공원', 'PARK', '부산광역시 해운대구 달맞이길 890', 35.1567, 129.1789, '051-3456-7890',
 '해운대 달맞이길 근처 반려동물 해변공원입니다.', false,
 NULL, '매일 24시간', 4.6,
 'https://example.com/park2.jpg', NOW()),

-- 기타
('펫호텔 강남', 'OTHER', '서울특별시 강남구 강남대로 1234', 37.4979, 127.0276, '02-7890-1234',
 '산책 중 반려동물을 잠시 맡길 수 있는 펫호텔입니다.', true,
 '산책 세션 참여자 1시간 무료 이용', '매일 09:00-21:00', 4.3,
 'https://example.com/other1.jpg', NOW()),

('반려동물 세탁소 올림픽', 'OTHER', '서울특별시 송파구 올림픽로 2345', 37.5212, 127.1234, '02-8901-2345',
 '산책 후 반려동물 목욕 및 그루밍 서비스를 제공하는 시설입니다.', true,
 '산책 후 방문 시 목욕 15% 할인', '평일 10:00-19:00, 주말 10:00-18:00', 4.5,
 'https://example.com/other2.jpg', NOW());

-- 산책로-시설 연결 데이터 삽입 (FacilityRoute)
-- 한강공원 여의도 산책로와 연결된 시설들
INSERT INTO facility_routes (route_id, facility_id, visit_order, distance_from_start_m, is_mandatory, notes) VALUES
((SELECT route_id FROM walking_routes WHERE route_name = '한강공원 여의도 산책로'), 
 (SELECT facility_id FROM facilities WHERE name = '도그카페 여의도'), 
 1, 500, false, '산책 중간 휴게 지점'),
((SELECT route_id FROM walking_routes WHERE route_name = '한강공원 여의도 산책로'), 
 (SELECT facility_id FROM facilities WHERE name = '펫샵 한강'), 
 2, 2000, false, '산책 종료 후 방문 가능');

-- 서울숲공원 산책로와 연결된 시설들
INSERT INTO facility_routes (route_id, facility_id, visit_order, distance_from_start_m, is_mandatory, notes) VALUES
((SELECT route_id FROM walking_routes WHERE route_name = '서울숲공원 산책로'), 
 (SELECT facility_id FROM facilities WHERE name = '펫카페 서울숲'), 
 1, 800, false, '공원 내부 카페');

-- 올림픽공원 산책로와 연결된 시설들
INSERT INTO facility_routes (route_id, facility_id, visit_order, distance_from_start_m, is_mandatory, notes) VALUES
((SELECT route_id FROM walking_routes WHERE route_name = '올림픽공원 산책로'), 
 (SELECT facility_id FROM facilities WHERE name = '반려동물 전문병원 올림픽'), 
 1, 1200, false, '공원 근처 병원'),
((SELECT route_id FROM walking_routes WHERE route_name = '올림픽공원 산책로'), 
 (SELECT facility_id FROM facilities WHERE name = '반려동물 세탁소 올림픽'), 
 2, 2500, false, '산책 후 목욕 가능');

-- 반포한강공원 산책로와 연결된 시설들
INSERT INTO facility_routes (route_id, facility_id, visit_order, distance_from_start_m, is_mandatory, notes) VALUES
((SELECT route_id FROM walking_routes WHERE route_name = '반포한강공원 산책로'), 
 (SELECT facility_id FROM facilities WHERE name = '펫샵 한강'), 
 1, 1500, false, '산책 중간 지점');

-- 일산 호수공원 산책로와 연결된 시설들
INSERT INTO facility_routes (route_id, facility_id, visit_order, distance_from_start_m, is_mandatory, notes) VALUES
((SELECT route_id FROM walking_routes WHERE route_name = '일산 호수공원 산책로'), 
 (SELECT facility_id FROM facilities WHERE name = '도그샵 일산'), 
 1, 1000, false, '호수공원 근처 샵');

-- 송도 센트럴파크 산책로와 연결된 시설들
INSERT INTO facility_routes (route_id, facility_id, visit_order, distance_from_start_m, is_mandatory, notes) VALUES
((SELECT route_id FROM walking_routes WHERE route_name = '송도 센트럴파크 산책로'), 
 (SELECT facility_id FROM facilities WHERE name = '반려동물 놀이터 송도'), 
 1, 600, false, '공원 내 놀이터');

-- 해운대 달맞이길 산책로와 연결된 시설들
INSERT INTO facility_routes (route_id, facility_id, visit_order, distance_from_start_m, is_mandatory, notes) VALUES
((SELECT route_id FROM walking_routes WHERE route_name = '해운대 달맞이길'), 
 (SELECT facility_id FROM facilities WHERE name = '해운대 반려동물 해변공원'), 
 1, 300, false, '해변공원 방문 가능');

-- 강남 지역 시설들을 강남 근처 산책로와 연결
INSERT INTO facility_routes (route_id, facility_id, visit_order, distance_from_start_m, is_mandatory, notes) VALUES
((SELECT route_id FROM walking_routes WHERE route_name = '한강공원 여의도 산책로'), 
 (SELECT facility_id FROM facilities WHERE name = '펫프렌들리 카페 강남점'), 
 3, 3500, false, '근처 카페'),
((SELECT route_id FROM walking_routes WHERE route_name = '한강공원 여의도 산책로'), 
 (SELECT facility_id FROM facilities WHERE name = '24시 동물병원 강남'), 
 4, 4000, false, '응급 시 이용 가능');
