# Petmily 기능 명세서
## 산책 중심 반려동물 관리 서비스

---

## 📋 목차

1. [개요](#1-개요)
2. [사용자 관리](#2-사용자-관리)
3. [반려동물 관리](#3-반려동물-관리)
4. [팔로우 시스템](#4-팔로우-시스템)
5. [산책로 관리](#5-산책로-관리)
6. [후원 시설 관리](#6-후원-시설-관리)
7. [산책 메이트 모집](#7-산책-메이트-모집)
8. [산책 참가 관리](#8-산책-참가-관리)
9. [산책 대기열 시스템](#9-산책-대기열-시스템)
10. [산책 실행 및 기록](#10-산책-실행-및-기록)
11. [반려동물 건강 로그](#11-반려동물-건강-로그)
12. [산책 후기](#12-산책-후기)

---

## 1. 개요

### 1.1 서비스 목적
반려동물과 함께하는 산책을 중심으로, 사용자들이 함께 산책할 메이트를 모집하고, 산책 기록을 관리하며, 반려동물의 건강 상태를 추적할 수 있는 서비스

### 1.2 핵심 가치
- **산책 메이트 매칭**: 같은 지역/시간대에 산책할 사람 찾기
- **다중 반려동물 지원**: 여러 반려동물과 함께 산책 가능
- **건강 관리**: 산책별 반려동물 건강 수치 기록
- **후원 시설 연동**: 산책로 주변 애견 시설 정보 제공

---

## 2. 사용자 관리

### 2.1 회원가입
**기능**: 새로운 사용자 계정 생성

**필수 정보**:
- 사용자명 (username) - 고유값
- 비밀번호 (password)
- 이메일 (email) - 고유값
- 이름 (name)

**선택 정보**:
- 생년월일 (birthDate)
- 전화번호 (phone)
- 프로필 이미지 (profileImage)
- 지역 (region)
- 위치 정보 (latitude, longitude)
- 반려동물 소유 여부 (isPetOwner)

**제약사항**:
- username, email은 중복 불가
- 기본 role: USER
- 기본 status: ACTIVE

### 2.2 로그인 및 인증
**기능**: JWT 기반 인증

**인증 토큰**:
- Access Token (단기)
- Refresh Token (장기, DB 저장)

**자동 기록**:
- 마지막 로그인 시각 (lastLoginAt) 업데이트

### 2.3 프로필 관리
**수정 가능 정보**:
- 이름, 전화번호, 프로필 이미지
- 지역, 위치 정보
- 비밀번호 변경

**조회 정보**:
- 기본 프로필 정보
- 보유 반려동물 목록
- 팔로워/팔로잉 수
- 참여한 산책 기록

### 2.4 계정 상태 관리
**상태 종류**:
- ACTIVE: 활성 계정
- INACTIVE: 비활성 (휴면)
- SUSPENDED: 정지

---

## 3. 반려동물 관리

### 3.1 반려동물 등록
**기능**: 사용자의 반려동물 정보 등록

**필수 정보**:
- 반려동물 이름 (petName)
- 종 (species): DOG, CAT, OTHER

**선택 정보**:
- 품종 (breed)
- 나이 (age) / 생년월일 (birthDate)
- 성별 (gender): MALE, FEMALE
- 중성화 여부 (isNeutered)
- 크기 (size): SMALL, MEDIUM, LARGE
- 몸무게 (weight)
- 성격 (personality)
- 건강 상태 (healthStatus)
- 특이사항 (specialNotes)
- 프로필 이미지 (profileImage)
- 등록번호 (registrationNumber)
- 마이크로칩 번호 (microchipNumber)

**인증 상태**:
- isVerified: 반려동물 인증 여부

### 3.2 반려동물 정보 수정
**수정 가능 항목**: 모든 정보 수정 가능

**자동 갱신**: updatedAt 자동 업데이트

### 3.3 반려동물 친구 관계
**기능**: 자주 함께 산책하는 반려동물 간 친구 맺기

**친구 요청 프로세스**:
1. 사용자 A가 사용자 B의 반려동물에게 친구 요청
2. 상태: PENDING
3. 사용자 B가 수락 → ACCEPTED
4. 사용자 B가 거절 → REJECTED

**제약사항**:
- petId1 < petId2 (작은 ID가 항상 앞에)
- 중복 요청 불가 (UNIQUE 제약)

**활용**:
- 산책 메이트 모집 시 친구 반려동물 우선 표시
- 추천 산책 메이트 매칭

---

## 4. 팔로우 시스템

### 4.1 팔로우/언팔로우
**기능**: 다른 사용자 팔로우

**제약사항**:
- 자기 자신 팔로우 불가 (CHECK 제약)
- 중복 팔로우 불가 (UNIQUE 제약)

**관계**:
- follower: 팔로우하는 사람
- following: 팔로우 받는 사람

### 4.2 팔로워/팔로잉 조회
**조회 기능**:
- 내 팔로워 목록
- 내가 팔로잉하는 사람 목록
- 상호 팔로우 여부 확인

---

## 5. 산책로 관리

### 5.1 산책로 등록
**기능**: 관리자 또는 사용자가 산책로 등록

**필수 정보**:
- 산책로 이름 (routeName)

**선택 정보**:
- 지역 (region)
- 거리 (distance) - km 단위
- 소요 시간 (duration) - 분 단위
- 난이도 (difficulty): EASY, MODERATE, HARD
- 경로 데이터 (pathData) - GeoJSON 형식
- 설명 (description)

**등록자**:
- createdBy: 등록한 사용자 ID
- NULL: 서버에서 제공하는 정적 산책로

### 5.2 산책로 평가
**자동 계산**:
- rating: 평균 평점 (0.00 ~ 5.00)
- reviewCount: 후기 개수

**업데이트 시점**:
- 산책 후기 작성 시 자동 반영

### 5.3 산책로 검색
**검색 조건**:
- 지역별 검색 (region 인덱스)
- 난이도별 검색 (difficulty 인덱스)
- 거리/소요시간 필터링

---

## 6. 후원 시설 관리

### 6.1 시설 등록
**기능**: 산책로 주변 애견 친화 시설 등록

**필수 정보**:
- 시설 이름 (name)
- 시설 유형 (type): CAFE, SHOP, HOSPITAL, PARK, OTHER
- 주소 (address)
- 위치 (latitude, longitude)

**선택 정보**:
- 전화번호 (phone)
- 설명 (description)
- 후원 여부 (isSponsor)
- 할인 정보 (discountInfo)
- 운영 시간 (openingHours)
- 평점 (rating)
- 이미지 URL (imageUrl)

### 6.2 시설-산책로 연동
**기능**: 산책로와 시설 매핑 (M:N 관계)

**매핑 정보**:
- 방문 순서 (visitOrder)
- 출발지로부터 거리 (distanceFromStartM) - 미터 단위
- 필수 방문 여부 (isMandatory)
- 메모 (notes)

**활용**:
- 산책로 상세 정보에 주변 시설 표시
- 추천 방문 코스 제공
- 후원 시설 광고

### 6.3 시설 검색
**검색 조건**:
- 시설 유형별 (type 인덱스)
- 위치 기반 (latitude, longitude 인덱스)
- 후원 여부 (isSponsor 인덱스)

---

## 7. 산책 메이트 모집

### 7.1 모집 글 작성
**기능**: 함께 산책할 메이트 모집

**필수 정보**:
- 산책 날짜 및 시간 (walkingDate)
- 장소 (location)
- 최대 참가자 수 (maxParticipants) - 기본값: 5

**선택 정보**:
- 참고 산책로 (routeId)
- 위치 좌표 (latitude, longitude)
- 예상 소요 시간 (duration) - 분 단위
- 반려동물 크기 필터 (petSizeFilter): ALL, SMALL, MEDIUM, LARGE
- 상세 설명 (description)

**자동 설정**:
- hostUserId: 작성자 ID
- currentParticipants: 1 (작성자 포함)
- status: OPEN

### 7.2 모집 상태 관리
**상태 종류**:
- OPEN: 모집 중
- FULL: 정원 마감
- COMPLETED: 산책 완료
- CANCELLED: 취소됨

**자동 상태 변경**:
- currentParticipants >= maxParticipants → FULL
- 산책 세션 생성 시 → COMPLETED

### 7.3 모집 글 검색
**검색 조건**:
- 날짜별 검색 (walkingDate 인덱스)
- 위치 기반 검색 (latitude, longitude 복합 인덱스)
- 상태별 검색 (status 인덱스)
- 작성자별 검색 (hostUserId 인덱스)

**필터링**:
- 반려동물 크기 필터 적용
- 정원 여유 있는 모집만 표시

---

## 8. 산책 참가 관리

### 8.1 참가 신청
**기능**: 산책 메이트 모집에 참가 신청

**프로세스**:
1. 사용자가 모집 글에 참가 신청
2. 상태: PENDING
3. 반려동물 선택 (여러 마리 가능)

**제약사항**:
- 같은 모집에 중복 신청 불가 (UNIQUE 제약)
- 정원 초과 시 대기열로 이동

### 8.2 참가 승인/거절
**호스트 권한**:
- PENDING → ACCEPTED (승인)
- PENDING → REJECTED (거절)

**자동 처리**:
- ACCEPTED 시 currentParticipants 증가
- REJECTED 시 다음 대기자 자동 승인 고려

### 8.3 다중 반려동물 관리
**기능**: 한 참가자가 여러 반려동물과 산책 가능

**관계 구조**:
```
WalkingParticipant (참가자)
    └─< WalkingParticipantPet (M:N)
            └─> Pet
```

**제약사항**:
- 같은 참가자가 같은 반려동물 중복 등록 불가 (UNIQUE 제약)

**활용**:
- 참가자별 동반 반려동물 수 집계
- 반려동물별 산책 기록 추적

---

## 9. 산책 대기열 시스템

### 9.1 대기열 등록
**발생 조건**:
- 산책 메이트 모집이 정원 초과 (FULL)
- 참가 신청 시 자동으로 대기열 등록

**대기 정보**:
- 우선순위 (priority): 신청 순서
- 상태 (status): WAITING, MOVED, CANCELLED

**제약사항**:
- 같은 모집에 중복 대기 불가 (UNIQUE 제약)

### 9.2 대기열 승격
**자동 승격 조건**:
- 기존 참가자 취소 시
- 정원 증가 시

**승격 프로세스**:
1. `SELECT ... FOR UPDATE`로 대기열 조회 (동시성 제어)
2. priority 가장 작은 (먼저 신청한) 사용자 선택
3. WalkingParticipant로 이동 (status: ACCEPTED)
4. 대기 상태를 MOVED로 변경

**동시성 제어**:
- 트랜잭션 격리 수준: READ COMMITTED 이상
- Row-level lock으로 동시 승격 방지

### 9.3 대기 취소
**사용자 취소**:
- status: WAITING → CANCELLED
- 다음 순위 자동 승격 안 함

---

## 10. 산책 실행 및 기록

### 10.1 산책 세션 생성
**기능**: 실제 진행된 산책 기록

**필수 정보**:
- mateId: 연결된 산책 메이트 모집 ID

**기록 정보**:
- 시작 시각 (startedAt)
- 종료 시각 (endedAt)
- 실제 거리 (actualDistanceM) - 미터 단위
- 실제 소요 시간 (actualDurationS) - 초 단위
- 경로 데이터 (pathData) - GeoJSON
- 참가자 수 (participantCount)
- 총 반려동물 수 (totalPets)

### 10.2 산책 진행 상태 추적
**시작 시**:
- startedAt 기록
- WalkingMate status → COMPLETED

**종료 시**:
- endedAt 기록
- 실제 거리/시간 계산 및 저장

**실시간 추적** (선택):
- pathData에 GPS 경로 저장
- 참가자별 위치 공유

---

## 11. 반려동물 건강 로그

### 11.1 건강 로그 생성
**기능**: 산책별 반려동물 건강 수치 기록

**관계 구조**:
```
WalkingParticipantPet (1) ─── (1) PetWalkingHealthLog
```

**제약사항**:
- 1:1 관계 (UNIQUE 제약)
- 한 참가 반려동물당 하나의 로그만 존재

### 11.2 산책 전 기록
**기록 항목**:
- 몸무게 (preWeight) - kg
- 컨디션 (preCondition): EXCELLENT, GOOD, NORMAL, TIRED, SICK

### 11.3 산책 중 기록
**자동/수동 기록**:
- 이동 거리 (distanceM) - 미터
- 소요 시간 (durationS) - 초
- 평균 속도 (avgSpeedMps) - m/s
- 최고 속도 (maxSpeedMps) - m/s
- 소모 칼로리 (caloriesBurned) - kcal
- 걸음 수 (stepCount)

### 11.4 산책 후 기록
**기록 항목**:
- 산책 후 컨디션 (postCondition)
- 휴식 필요 여부 (needsRest)
- 수분 상태 (hydrationLevel): GOOD, MODERATE, LOW
- 메모 (notes)

**활용**:
- 반려동물 건강 트렌드 분석
- 적정 산책 거리/시간 추천
- 이상 징후 알림

---

## 12. 산책 후기

### 12.1 후기 작성
**기능**: 산책 세션에 대한 참가자 후기

**필수 정보**:
- sessionId: 산책 세션 ID
- overallRating: 전체 평점 (1-5)
- walkingDate: 산책 날짜

**선택 정보**:
- routeRating: 산책로 평점 (1-5)
- groupRating: 그룹 평점 (1-5)
- distance: 기록된 거리 (km)
- duration: 기록된 시간 (분)
- notes: 후기 내용
- photoUrls: 사진 URL 배열 (JSON)
- isPublic: 공개 여부 (기본: true)

**제약사항**:
- 한 세션당 참가자별 1개의 후기만 작성 가능 (UNIQUE 제약)

### 12.2 후기 조회
**정렬 옵션**:
- 평점 높은 순 (overallRating DESC 인덱스)
- 최신순 (createdAt)

**필터링**:
- 공개 후기만 조회 (isPublic = true)
- 특정 사용자 후기 조회

### 12.3 평점 반영
**자동 계산**:
- WalkingRoute의 rating, reviewCount 업데이트
- routeRating 평균 계산

---

## 13. 핵심 비즈니스 로직

### 13.1 산책 메이트 매칭 알고리즘
**우선순위**:
1. 반려동물 친구 관계
2. 팔로우 관계
3. 지역 근접도
4. 반려동물 크기 호환성

### 13.2 대기열 관리 트랜잭션
```sql
BEGIN TRANSACTION;

-- 1. 대기열에서 다음 사용자 선택 (Lock)
SELECT * FROM walking_waitlist
WHERE mate_id = ? AND status = 'WAITING'
ORDER BY priority ASC
LIMIT 1
FOR UPDATE;

-- 2. 참가자로 등록
INSERT INTO walking_participants (mate_id, user_id, status)
VALUES (?, ?, 'ACCEPTED');

-- 3. 대기 상태 업데이트
UPDATE walking_waitlist
SET status = 'MOVED'
WHERE wait_id = ?;

-- 4. 현재 참가자 수 증가
UPDATE walking_mates
SET current_participants = current_participants + 1
WHERE mate_id = ?;

COMMIT;
```

### 13.3 건강 데이터 집계
**주간/월간 리포트**:
- 총 산책 횟수
- 총 이동 거리
- 평균 속도
- 소모 칼로리 합계
- 컨디션 트렌드

---

## 14. API 엔드포인트 구조 (예시)

### 사용자
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/users/me` - 내 정보 조회
- `PATCH /api/users/me` - 프로필 수정

### 반려동물
- `POST /api/pets` - 반려동물 등록
- `GET /api/pets` - 내 반려동물 목록
- `GET /api/pets/:id` - 반려동물 상세
- `PATCH /api/pets/:id` - 반려동물 수정
- `POST /api/pets/:id/friends` - 친구 요청
- `PATCH /api/pets/friends/:id` - 친구 요청 승인/거절

### 팔로우
- `POST /api/follows/:userId` - 팔로우
- `DELETE /api/follows/:userId` - 언팔로우
- `GET /api/users/:userId/followers` - 팔로워 목록
- `GET /api/users/:userId/following` - 팔로잉 목록

### 산책로
- `GET /api/routes` - 산책로 목록
- `GET /api/routes/:id` - 산책로 상세
- `GET /api/routes/:id/facilities` - 산책로 주변 시설

### 시설
- `GET /api/facilities` - 시설 목록
- `GET /api/facilities/:id` - 시설 상세

### 산책 메이트
- `POST /api/walking-mates` - 모집 글 작성
- `GET /api/walking-mates` - 모집 글 목록
- `GET /api/walking-mates/:id` - 모집 글 상세
- `PATCH /api/walking-mates/:id` - 모집 글 수정
- `DELETE /api/walking-mates/:id` - 모집 글 삭제

### 참가 관리
- `POST /api/walking-mates/:id/join` - 참가 신청
- `DELETE /api/walking-mates/:id/leave` - 참가 취소
- `PATCH /api/participants/:id/approve` - 참가 승인
- `PATCH /api/participants/:id/reject` - 참가 거절
- `POST /api/participants/:id/pets` - 참가 반려동물 추가

### 대기열
- `GET /api/walking-mates/:id/waitlist` - 대기열 조회
- `DELETE /api/waitlist/:id` - 대기 취소

### 산책 세션
- `POST /api/sessions` - 산책 세션 시작
- `PATCH /api/sessions/:id/end` - 산책 세션 종료
- `GET /api/sessions/:id` - 세션 상세

### 건강 로그
- `POST /api/sessions/:sessionId/pets/:petId/health` - 건강 로그 기록
- `GET /api/pets/:id/health-logs` - 반려동물 건강 로그 목록

### 후기
- `POST /api/sessions/:id/reviews` - 후기 작성
- `GET /api/sessions/:id/reviews` - 세션 후기 목록
- `GET /api/routes/:id/reviews` - 산책로 후기 목록

---

## 15. 향후 확장 가능 기능

### 15.1 배지 시스템
- 산책 횟수별 배지
- 거리 달성 배지
- 친구 수 배지

### 15.2 평판 시스템
- 산책 메이트 평가
- 매너 점수
- 신뢰도 지표

### 15.3 알림 시스템
- 산책 메이트 초대 알림
- 참가 승인 알림
- 산책 시작 알림
- 대기열 승격 알림

### 15.4 통계 대시보드
- 개인 산책 통계
- 반려동물별 통계
- 지역별 인기 산책로

---

## 16. 데이터 무결성 규칙

### 16.1 CASCADE 규칙
- User 삭제 → 관련 Pet, WalkingMate, Participant 자동 삭제
- Pet 삭제 → 관련 WalkingParticipantPet 자동 삭제
- WalkingMate 삭제 → 관련 Participant, Waitlist, Session 자동 삭제

### 16.2 SET NULL 규칙
- User 삭제 → WalkingRoute.createdBy NULL
- WalkingRoute 삭제 → WalkingMate.routeId NULL

### 16.3 UNIQUE 제약
- User: username, email
- Follow: (followerId, followingId)
- PetFriendship: (petId1, petId2)
- WalkingParticipant: (mateId, userId)
- WalkingParticipantPet: (participantId, petId)
- WalkingWaitlist: (mateId, userId)
- WalkingReview: (sessionId, reviewerId)

---

## 17. 인덱스 전략

### 17.1 검색 성능 최적화
- User: username, email, region, (latitude, longitude)
- Pet: userId, species, size
- WalkingRoute: region, difficulty
- Facility: type, (latitude, longitude), isSponsor
- WalkingMate: hostUserId, status, walkingDate, (latitude, longitude)
- WalkingParticipant: mateId, userId, status
- WalkingWaitlist: (mateId, priority)
- WalkingSession: mateId, startedAt
- WalkingReview: sessionId, reviewerId, overallRating DESC

---

## 18. 보안 고려사항

### 18.1 인증/인가
- JWT 기반 인증
- Refresh Token 관리
- Role 기반 권한 (USER, ADMIN)

### 18.2 데이터 접근 제어
- 본인 데이터만 수정 가능
- 공개 설정 존중 (isPublic)
- 호스트만 참가자 관리 가능

### 18.3 입력 검증
- 평점 범위 검증 (1-5)
- 날짜 유효성 검증
- 위치 좌표 범위 검증
