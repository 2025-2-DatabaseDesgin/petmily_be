# Petmily API 명세서

## 기본 정보

- **Base URL**: `http://localhost:3000` (개발 환경)
- **인증 방식**: Bearer Token (JWT)
- **Content-Type**: `application/json`

## 공통 응답 형식

### 성공 응답
```json
{
  "success": true,
  "message": "요청이 성공적으로 처리되었습니다",
  "data": { ... }
}
```

### 에러 응답
```json
{
  "success": false,
  "message": "오류 메시지",
  "statusCode": 400
}
```

## 인증 (Auth)

### 1. 회원가입

**POST** `/auth/register`

**Request Body:**
```json
{
  "username": "johndoe",           // 필수
  "password": "password123!",      // 필수
  "email": "john@example.com",     // 필수
  "name": "홍길동",                 // 필수
  "birthDate": "1990-01-01",       // 선택 (YYYY-MM-DD)
  "phone": "010-1234-5678",        // 선택
  "region": "서울특별시 강남구",     // 선택
  "latitude": 37.4979,             // 선택
  "longitude": 127.0276,           // 선택
  "isPetOwner": true               // 선택 (기본값: false)
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "회원가입 성공",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "username": "johndoe",
      "email": "john@example.com",
      "name": "홍길동",
      "role": "USER",
      "status": "ACTIVE"
    }
  }
}
```

**에러 응답:**
- `400`: 필수 항목 누락
- `409`: 중복된 사용자명 또는 이메일

---

### 2. 로그인

**POST** `/auth/login`

**Request Body:**
```json
{
  "loginIdentifier": "johndoe",    // 필수 (사용자명 또는 이메일)
  "password": "password123!"       // 필수
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "로그인 성공",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "username": "johndoe",
      "email": "john@example.com",
      "name": "홍길동",
      "role": "USER",
      "status": "ACTIVE"
    }
  }
}
```

**에러 응답:**
- `401`: 사용자명 또는 비밀번호 불일치

---

### 3. 토큰 갱신

**POST** `/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "토큰 갱신 성공",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "username": "johndoe"
    }
  }
}
```

**에러 응답:**
- `401`: 유효하지 않은 리프레시 토큰

---

### 4. 로그아웃

**POST** `/auth/logout`  
**인증 필요**: ✅

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body (선택):**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "로그아웃 성공"
}
```

---

### 5. 현재 사용자 정보 조회 (간단)

**GET** `/auth/me`  
**인증 필요**: ✅

**Response (200 OK):**
```json
{
  "success": true,
  "message": "사용자 정보 조회 성공",
  "data": {
    "id": "1",
    "username": "johndoe",
    "email": "john@example.com",
    "name": "홍길동",
    "role": "USER",
    "status": "ACTIVE"
  }
}
```

---

### 6. 프로필 조회 (상세)

**GET** `/auth/profile`  
**인증 필요**: ✅

**Response (200 OK):**
```json
{
  "success": true,
  "message": "프로필 조회 성공",
  "data": {
    "id": "1",
    "username": "johndoe",
    "email": "john@example.com",
    "name": "홍길동",
    "role": "USER",
    "status": "ACTIVE",
    "birthDate": "1990-01-01",
    "phone": "010-1234-5678",
    "profileImage": "https://example.com/profile.jpg",
    "region": "서울특별시 강남구",
    "latitude": 37.4979,
    "longitude": 127.0276,
    "isPetOwner": true,
    "followerCount": 150,
    "followingCount": 120,
    "petCount": 2,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

---

## 반려동물 (Pets)

### 1. 반려동물 등록

**POST** `/pets`  
**인증 필요**: ✅

**Request Body:**
```json
{
  "petName": "뭉치",                    // 필수
  "species": "DOG",                     // 필수 (DOG, CAT, OTHER)
  "breed": "골든 리트리버",              // 선택
  "age": 3,                             // 선택
  "birthDate": "2021-03-15",           // 선택 (YYYY-MM-DD)
  "gender": "MALE",                     // 선택 (MALE, FEMALE)
  "isNeutered": true,                   // 선택
  "size": "LARGE",                      // 선택 (SMALL, MEDIUM, LARGE)
  "weight": 30.5,                       // 선택
  "personality": "온순하고 사람을 좋아함", // 선택
  "healthStatus": "건강함",              // 선택
  "specialNotes": "산책을 아주 좋아함",   // 선택
  "profileImage": "https://example.com/pet.jpg", // 선택
  "registrationNumber": "410000000000001", // 선택
  "microchipNumber": "900000000000001"    // 선택
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "반려동물 등록 성공",
  "data": {
    "id": "1",
    "petName": "뭉치",
    "species": "DOG",
    "breed": "골든 리트리버",
    "age": 3,
    "birthDate": "2021-03-15",
    "gender": "MALE",
    "isNeutered": true,
    "size": "LARGE",
    "weight": 30.5,
    "personality": "온순하고 사람을 좋아함",
    "healthStatus": "건강함",
    "specialNotes": "산책을 아주 좋아함",
    "profileImage": "https://example.com/pet.jpg",
    "registrationNumber": "410000000000001",
    "microchipNumber": "900000000000001",
    "ownerId": "1",
    "isVerified": false,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### 2. 내 반려동물 목록 조회

**GET** `/pets`  
**인증 필요**: ✅

**Response (200 OK):**
```json
{
  "success": true,
  "message": "반려동물 목록 조회 성공",
  "data": [
    {
      "id": "1",
      "petName": "뭉치",
      "species": "DOG",
      // ... (Pet 객체 전체)
    }
  ]
}
```

---

### 3. 반려동물 상세 조회

**GET** `/pets/{id}`

**Path Parameters:**
- `id` (string): 반려동물 ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "반려동물 조회 성공",
  "data": {
    "id": "1",
    "petName": "뭉치",
    // ... (Pet 객체 전체)
    "owner": {
      "id": "1",
      "username": "johndoe",
      "name": "홍길동",
      "profileImage": "https://example.com/profile.jpg"
    }
  }
}
```

**에러 응답:**
- `404`: 반려동물을 찾을 수 없음

---

### 4. 반려동물 정보 수정

**PATCH** `/pets/{id}`  
**인증 필요**: ✅

**Request Body (모든 필드 선택):**
```json
{
  "weight": 31.0,
  "healthStatus": "건강 양호"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "반려동물 정보 수정 성공",
  "data": { ... } // Pet 객체
}
```

**에러 응답:**
- `403`: 권한 없음

---

### 5. 반려동물 삭제

**DELETE** `/pets/{id}`  
**인증 필요**: ✅

**Response (200 OK):**
```json
{
  "success": true,
  "message": "반려동물 삭제 성공"
}
```

---

### 6. 반려동물 친구 요청

**POST** `/pets/{id}/friends`  
**인증 필요**: ✅

**Request Body:**
```json
{
  "targetPetId": "2"  // 필수
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "친구 요청을 전송했습니다",
  "data": {
    "id": "1",
    "status": "PENDING"
  }
}
```

---

### 7. 반려동물 친구 목록 조회

**GET** `/pets/{id}/friends`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "친구 목록 조회 성공",
  "data": [
    {
      "id": "1",
      "pet": { ... }, // Pet 객체
      "friendshipDate": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### 8. 받은 친구 요청 목록 조회

**GET** `/pets/friends/requests`  
**인증 필요**: ✅

**Response (200 OK):**
```json
{
  "success": true,
  "message": "친구 요청 목록 조회 성공",
  "data": [
    {
      "id": "1",
      "fromPet": { ... }, // Pet 객체
      "toPet": { ... },   // Pet 객체
      "status": "PENDING"
    }
  ]
}
```

---

### 9. 친구 요청 승인/거절

**PATCH** `/pets/friends/{id}`  
**인증 필요**: ✅

**Request Body:**
```json
{
  "accept": true  // 필수 (true: 승인, false: 거절)
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "친구 요청을 승인했습니다"
}
```

---

## 팔로우 (Follows)

### 1. 팔로우

**POST** `/follows/{userId}`  
**인증 필요**: ✅

**Path Parameters:**
- `userId` (string): 팔로우할 사용자 ID

**Response (201 Created):**
```json
{
  "success": true,
  "message": "팔로우 성공",
  "data": {
    "id": "1",
    "followerId": "1",
    "followingId": "2",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### 2. 언팔로우

**DELETE** `/follows/{userId}`  
**인증 필요**: ✅

**Response (200 OK):**
```json
{
  "success": true,
  "message": "언팔로우 성공"
}
```

---

### 3. 팔로우 상태 조회

**GET** `/follows/{userId}/status`  
**인증 필요**: ✅

**Response (200 OK):**
```json
{
  "success": true,
  "message": "팔로우 상태 조회 성공",
  "data": {
    "isFollowing": true
  }
}
```

---

### 4. 팔로워 목록 조회

**GET** `/follows/{userId}/followers`

**Query Parameters:**
- `limit` (integer, 기본값: 20)
- `offset` (integer, 기본값: 0)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "팔로워 목록 조회 성공",
  "data": {
    "followers": [
      {
        "id": "1",
        "username": "johndoe",
        "name": "홍길동",
        "profileImage": "https://example.com/profile.jpg",
        "followedAt": "2025-01-01T00:00:00Z"
      }
    ],
    "total": 150
  }
}
```

---

### 5. 팔로잉 목록 조회

**GET** `/follows/{userId}/following`

**Query Parameters:**
- `limit` (integer, 기본값: 20)
- `offset` (integer, 기본값: 0)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "팔로잉 목록 조회 성공",
  "data": {
    "following": [
      {
        "id": "2",
        "username": "janedoe",
        "name": "김철수",
        "profileImage": "https://example.com/profile2.jpg",
        "followedAt": "2025-01-01T00:00:00Z"
      }
    ],
    "total": 120
  }
}
```

---

### 6. 팔로우 통계 조회

**GET** `/follows/{userId}/stats`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "팔로우 통계 조회 성공",
  "data": {
    "followerCount": 150,
    "followingCount": 120
  }
}
```

---

## 산책로 (Routes)

### 1. 산책로 목록 조회

**GET** `/routes`

**Query Parameters:**
- `region` (string): 지역 필터
- `difficulty` (string): 난이도 (EASY, MODERATE, HARD)
- `minDistance` (number): 최소 거리 (km)
- `maxDistance` (number): 최대 거리 (km)
- `limit` (integer, 기본값: 20)
- `offset` (integer, 기본값: 0)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "산책로 목록 조회 성공",
  "data": {
    "routes": [
      {
        "id": "1",
        "routeName": "한강공원 산책로",
        "region": "서울특별시 영등포구",
        "distance": 3.5,
        "duration": 50,
        "difficulty": "EASY",
        "pathData": "[{\"lat\":37.5326,\"lng\":126.9012}]",
        "description": "한강을 따라 걷는 평탄한 산책로",
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "total": 45
  }
}
```

---

### 2. 산책로 생성

**POST** `/routes`  
**인증 필요**: ✅

**Request Body:**
```json
{
  "routeName": "한강공원 산책로",  // 필수
  "region": "서울특별시 영등포구",  // 선택
  "distance": 3.5,                 // 선택
  "duration": 50,                  // 선택
  "difficulty": "EASY",            // 선택 (EASY, MODERATE, HARD)
  "pathData": "[{\"lat\":37.5326,\"lng\":126.9012}]", // 선택
  "description": "한강을 따라 걷는 평탄한 산책로" // 선택
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "산책로 생성 성공",
  "data": { ... } // WalkingRoute 객체
}
```

---

### 3. 산책로 상세 조회

**GET** `/routes/{id}`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "산책로 조회 성공",
  "data": { ... } // WalkingRoute 객체
}
```

---

### 4. 산책로 수정

**PATCH** `/routes/{id}`  
**인증 필요**: ✅

**Request Body (모든 필드 선택):**
```json
{
  "description": "한강을 따라 걷는 평탄한 산책로 (업데이트)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "산책로 수정 성공",
  "data": { ... } // WalkingRoute 객체
}
```

---

### 5. 산책로 삭제

**DELETE** `/routes/{id}`  
**인증 필요**: ✅

**Response (200 OK):**
```json
{
  "success": true,
  "message": "산책로 삭제 성공"
}
```

---

### 6. 산책로 주변 시설 조회

**GET** `/routes/{id}/facilities`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "시설 목록 조회 성공",
  "data": [
    {
      "id": "1",
      "name": "펫프렌들리 카페",
      "type": "CAFE",
      // ... (Facility 객체)
    }
  ]
}
```

---

## 시설 (Facilities)

### 1. 시설 목록 조회

**GET** `/facilities`

**Query Parameters:**
- `type` (string): 시설 유형 (CAFE, SHOP, HOSPITAL, PARK, OTHER)
- `isSponsor` (boolean): 스폰서 여부
- `latitude` (number): 위도
- `longitude` (number): 경도
- `radiusKm` (number): 반경 (km)
- `limit` (integer, 기본값: 20)
- `offset` (integer, 기본값: 0)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "시설 목록 조회 성공",
  "data": {
    "facilities": [
      {
        "id": "1",
        "name": "펫프렌들리 카페",
        "type": "CAFE",
        "address": "서울특별시 강남구 테헤란로 123",
        "latitude": 37.4979,
        "longitude": 127.0276,
        "phone": "02-1234-5678",
        "description": "반려동물과 함께 즐길 수 있는 카페",
        "isSponsor": true,
        "discountInfo": "산책 후 방문 시 10% 할인",
        "openingHours": "평일 10:00-22:00, 주말 11:00-23:00",
        "imageUrl": "https://example.com/cafe.jpg",
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "total": 25
  }
}
```

---

### 2. 시설 생성 (관리자 전용)

**POST** `/facilities`  
**인증 필요**: ✅ (관리자)

**Request Body:**
```json
{
  "name": "펫프렌들리 카페",              // 필수
  "type": "CAFE",                      // 필수 (CAFE, SHOP, HOSPITAL, PARK, OTHER)
  "address": "서울특별시 강남구 테헤란로 123", // 필수
  "latitude": 37.4979,                 // 필수
  "longitude": 127.0276,               // 필수
  "phone": "02-1234-5678",            // 선택
  "description": "반려동물과 함께 즐길 수 있는 카페", // 선택
  "isSponsor": true,                   // 선택
  "discountInfo": "산책 후 방문 시 10% 할인", // 선택
  "openingHours": "평일 10:00-22:00, 주말 11:00-23:00", // 선택
  "imageUrl": "https://example.com/cafe.jpg" // 선택
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "시설 생성 성공",
  "data": { ... } // Facility 객체
}
```

**에러 응답:**
- `403`: 관리자 권한 필요

---

### 3. 시설 상세 조회

**GET** `/facilities/{id}`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "시설 조회 성공",
  "data": { ... } // Facility 객체
}
```

---

### 4. 시설 수정 (관리자 전용)

**PATCH** `/facilities/{id}`  
**인증 필요**: ✅ (관리자)

**Request Body (모든 필드 선택):**
```json
{
  "openingHours": "평일 09:00-22:00, 주말 10:00-23:00"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "시설 수정 성공",
  "data": { ... } // Facility 객체
}
```

---

### 5. 시설 삭제 (관리자 전용)

**DELETE** `/facilities/{id}`  
**인증 필요**: ✅ (관리자)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "시설 삭제 성공"
}
```

---

## 산책 메이트 (Walking Mates)

### 1. 산책 메이트 목록 조회

**GET** `/walking-mates`

**Query Parameters:**
- `status` (string): 상태 (OPEN, FULL, COMPLETED, CANCELLED)
- `region` (string): 지역
- `walkingDate` (string): 산책 날짜 (YYYY-MM-DD)
- `petSizeFilter` (string): 반려동물 크기 필터 (ALL, SMALL, MEDIUM, LARGE)
- `latitude` (number): 위도
- `longitude` (number): 경도
- `radiusKm` (number): 반경 (km)
- `limit` (integer, 기본값: 20)
- `offset` (integer, 기본값: 0)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "산책 메이트 목록 조회 성공",
  "data": {
    "mates": [
      {
        "id": "1",
        "hostId": "1",
        "routeId": "1",
        "walkingDate": "2025-11-25T14:00:00Z",
        "location": "한강공원 여의도 입구",
        "latitude": 37.5326,
        "longitude": 126.9012,
        "duration": 60,
        "maxParticipants": 5,
        "petSizeFilter": "ALL",
        "status": "OPEN",
        "description": "주말 오후 한강 산책 함께 하실 분!",
        "host": {
          "id": "1",
          "username": "johndoe",
          "name": "홍길동",
          "profileImage": "https://example.com/profile.jpg"
        },
        "currentParticipants": 2,
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "total": 35
  }
}
```

---

### 2. 산책 메이트 모집 생성

**POST** `/walking-mates`  
**인증 필요**: ✅

**Request Body:**
```json
{
  "routeId": "1",                    // 선택
  "walkingDate": "2025-11-25T14:00:00Z", // 필수 (ISO 8601)
  "location": "한강공원 여의도 입구",    // 필수
  "latitude": 37.5326,               // 선택
  "longitude": 126.9012,             // 선택
  "duration": 60,                    // 선택 (분)
  "maxParticipants": 5,              // 선택
  "petSizeFilter": "ALL",            // 선택 (ALL, SMALL, MEDIUM, LARGE)
  "description": "주말 오후 한강 산책 함께 하실 분!" // 선택
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "산책 메이트 모집 생성 성공",
  "data": { ... } // WalkingMate 객체
}
```

---

### 3. 산책 메이트 상세 조회

**GET** `/walking-mates/{id}`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "산책 메이트 조회 성공",
  "data": {
    "id": "1",
    // ... (WalkingMate 객체)
    "host": {
      "id": "1",
      "username": "johndoe",
      "name": "홍길동",
      "profileImage": "https://example.com/profile.jpg"
    },
    "participants": [
      {
        "id": "1",
        "user": {
          "id": "2",
          "username": "janedoe",
          "name": "김철수"
        },
        "pets": [ ... ], // Pet 배열
        "status": "ACCEPTED"
      }
    ]
  }
}
```

---

### 4. 산책 메이트 수정

**PATCH** `/walking-mates/{id}`  
**인증 필요**: ✅ (호스트만)

**Request Body (모든 필드 선택):**
```json
{
  "maxParticipants": 6,
  "description": "주말 오후 한강 산책 함께 하실 분! (인원 추가)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "산책 메이트 수정 성공",
  "data": { ... } // WalkingMate 객체
}
```

---

### 5. 산책 메이트 삭제

**DELETE** `/walking-mates/{id}`  
**인증 필요**: ✅ (호스트만)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "산책 메이트 삭제 성공"
}
```

---

### 6. 산책 메이트 참가 신청

**POST** `/walking-mates/{id}/join`  
**인증 필요**: ✅

**Request Body:**
```json
{
  "petIds": ["1", "2"]  // 필수 (배열)
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "참가 신청이 완료되었습니다",
  "data": {
    "type": "participant",  // 또는 "waitlist"
    "participantId": "1",    // type이 "participant"일 때
    "status": "PENDING",     // type이 "participant"일 때
    "waitlistId": "1",       // type이 "waitlist"일 때
    "priority": 1            // type이 "waitlist"일 때
  }
}
```

---

### 7. 산책 메이트 참가 취소

**DELETE** `/walking-mates/{id}/leave`  
**인증 필요**: ✅

**Response (200 OK):**
```json
{
  "success": true,
  "message": "참가 취소가 완료되었습니다"
}
```

---

### 8. 참가 승인 (호스트 전용)

**PATCH** `/walking-mates/participants/{id}/approve`  
**인증 필요**: ✅ (호스트만)

**Path Parameters:**
- `id` (string): 참가자(participant) ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "참가를 승인했습니다"
}
```

---

### 9. 참가 거절 (호스트 전용)

**PATCH** `/walking-mates/participants/{id}/reject`  
**인증 필요**: ✅ (호스트만)

**Path Parameters:**
- `id` (string): 참가자(participant) ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "참가를 거절했습니다"
}
```

---

### 10. 대기 취소

**DELETE** `/walking-mates/waitlist/{id}`  
**인증 필요**: ✅

**Path Parameters:**
- `id` (string): 대기열(waitlist) ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "대기를 취소했습니다"
}
```

---

## 산책 세션 (Sessions)

### 1. 산책 세션 목록 조회

**GET** `/sessions`

**Query Parameters:**
- `mateId` (string): 산책 메이트 ID
- `userId` (string): 사용자 ID
- `limit` (integer, 기본값: 20)
- `offset` (integer, 기본값: 0)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "산책 세션 목록 조회 성공",
  "data": {
    "sessions": [
      {
        "id": "1",
        "mateId": "1",
        "startTime": "2025-11-25T14:00:00Z",
        "endTime": "2025-11-25T15:00:00Z",
        "actualDistanceM": 3500,
        "actualDurationS": 3000,
        "pathData": "[{\"lat\":37.5326,\"lng\":126.9012,\"timestamp\":\"2025-11-25T14:00:00Z\"}]",
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "total": 12
  }
}
```

---

### 2. 산책 세션 시작 (호스트 전용)

**POST** `/sessions`  
**인증 필요**: ✅ (호스트만)

**Request Body:**
```json
{
  "mateId": "1"  // 필수
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "산책 세션 시작 성공",
  "data": { ... } // WalkingSession 객체
}
```

**에러 응답:**
- `403`: 호스트만 세션을 시작할 수 있습니다

---

### 3. 산책 세션 상세 조회

**GET** `/sessions/{id}`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "산책 세션 조회 성공",
  "data": { ... } // WalkingSession 객체
}
```

**에러 응답:**
- `404`: 산책 세션을 찾을 수 없습니다

---

### 4. 산책 세션 종료 (호스트 전용)

**PATCH** `/sessions/{id}/end`  
**인증 필요**: ✅ (호스트만)

**Request Body (선택):**
```json
{
  "actualDistanceM": 3500,
  "actualDurationS": 3000,
  "pathData": "[{\"lat\":37.5326,\"lng\":126.9012,\"timestamp\":\"2025-11-25T14:00:00Z\"}]"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "산책 세션 종료 성공",
  "data": { ... } // WalkingSession 객체
}
```

**에러 응답:**
- `403`: 호스트만 세션을 종료할 수 있습니다

---

## 건강 로그 (Health Logs)

### 1. 건강 로그 생성

**POST** `/health-logs`  
**인증 필요**: ✅

**Request Body:**
```json
{
  "participantPetId": "1",           // 필수
  "preWeight": 30.5,                 // 선택
  "preCondition": "GOOD",            // 선택 (EXCELLENT, GOOD, NORMAL, TIRED, SICK)
  "distanceM": 3500,                 // 선택
  "durationS": 3000,                 // 선택
  "avgSpeedMps": 1.17,               // 선택
  "maxSpeedMps": 3.5,                // 선택
  "caloriesBurned": 250,             // 선택
  "stepCount": 4500,                 // 선택
  "postCondition": "NORMAL",         // 선택 (EXCELLENT, GOOD, NORMAL, TIRED, SICK)
  "needsRest": false,                 // 선택
  "hydrationLevel": "GOOD",          // 선택 (GOOD, MODERATE, LOW)
  "notes": "산책 잘 마쳤습니다"        // 선택
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "건강 로그 생성 성공",
  "data": {
    "id": "1",
    "participantPetId": "1",
    "preWeight": 30.5,
    "preCondition": "GOOD",
    "distanceM": 3500,
    "durationS": 3000,
    "avgSpeedMps": 1.17,
    "maxSpeedMps": 3.5,
    "caloriesBurned": 250,
    "stepCount": 4500,
    "postCondition": "NORMAL",
    "needsRest": false,
    "hydrationLevel": "GOOD",
    "notes": "산책 잘 마쳤습니다",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

**에러 응답:**
- `400`: 필수 항목이 누락되었습니다

---

### 2. 건강 로그 상세 조회

**GET** `/health-logs/{id}`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "건강 로그 조회 성공",
  "data": { ... } // HealthLog 객체
}
```

**에러 응답:**
- `404`: 건강 로그를 찾을 수 없습니다

---

### 3. 건강 로그 수정

**PATCH** `/health-logs/{id}`  
**인증 필요**: ✅

**Request Body (모든 필드 선택):**
```json
{
  "postCondition": "TIRED",
  "needsRest": true,
  "notes": "산책 후 피곤해 보임"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "건강 로그 수정 성공",
  "data": { ... } // HealthLog 객체
}
```

**에러 응답:**
- `403`: 건강 로그를 수정할 권한이 없습니다

---

### 4. 건강 로그 삭제

**DELETE** `/health-logs/{id}`  
**인증 필요**: ✅

**Response (200 OK):**
```json
{
  "success": true,
  "message": "건강 로그 삭제 성공"
}
```

**에러 응답:**
- `403`: 건강 로그를 삭제할 권한이 없습니다

---

### 5. 반려동물의 건강 로그 목록 조회

**GET** `/health-logs/pets/{petId}`

**Query Parameters:**
- `limit` (integer, 기본값: 20)
- `offset` (integer, 기본값: 0)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "건강 로그 목록 조회 성공",
  "data": {
    "logs": [ ... ], // HealthLog 배열
    "total": 28
  }
}
```

**에러 응답:**
- `404`: 반려동물을 찾을 수 없습니다

---

## 후기 (Reviews)

### 1. 후기 작성

**POST** `/reviews`  
**인증 필요**: ✅

**Request Body:**
```json
{
  "sessionId": "1",                  // 필수
  "overallRating": 5,                // 필수 (1-5)
  "routeRating": 4,                  // 선택 (1-5)
  "groupRating": 5,                  // 선택 (1-5)
  "distance": 3.5,                   // 선택
  "duration": 50,                    // 선택
  "notes": "즐거운 산책이었습니다!",   // 선택
  "photoUrls": [                     // 선택
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg"
  ],
  "isPublic": true                   // 선택 (기본값: true)
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "후기 작성 성공",
  "data": {
    "id": "1",
    "sessionId": "1",
    "userId": "1",
    "overallRating": 5,
    "routeRating": 4,
    "groupRating": 5,
    "distance": 3.5,
    "duration": 50,
    "notes": "즐거운 산책이었습니다!",
    "photoUrls": [
      "https://example.com/photo1.jpg",
      "https://example.com/photo2.jpg"
    ],
    "isPublic": true,
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

**에러 응답:**
- `400`: 이미 해당 세션에 대한 후기를 작성했습니다

---

### 2. 후기 상세 조회

**GET** `/reviews/{id}`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "후기 조회 성공",
  "data": {
    "id": "1",
    // ... (Review 객체)
    "user": {
      "id": "1",
      "username": "johndoe",
      "name": "홍길동",
      "profileImage": "https://example.com/profile.jpg"
    }
  }
}
```

**에러 응답:**
- `404`: 후기를 찾을 수 없습니다

---

### 3. 후기 수정

**PATCH** `/reviews/{id}`  
**인증 필요**: ✅

**Request Body (모든 필드 선택):**
```json
{
  "overallRating": 4,
  "notes": "후기 수정 - 전반적으로 좋았습니다"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "후기 수정 성공",
  "data": { ... } // Review 객체
}
```

**에러 응답:**
- `403`: 후기를 수정할 권한이 없습니다

---

### 4. 후기 삭제

**DELETE** `/reviews/{id}`  
**인증 필요**: ✅

**Response (200 OK):**
```json
{
  "success": true,
  "message": "후기 삭제 성공"
}
```

**에러 응답:**
- `403`: 후기를 삭제할 권한이 없습니다

---

### 5. 세션의 후기 목록 조회

**GET** `/reviews/sessions/{sessionId}`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "후기 목록 조회 성공",
  "data": [
    {
      "id": "1",
      // ... (Review 객체)
      "user": {
        "id": "1",
        "username": "johndoe",
        "name": "홍길동",
        "profileImage": "https://example.com/profile.jpg"
      }
    }
  ]
}
```

---

### 6. 산책로의 후기 목록 조회

**GET** `/reviews/routes/{routeId}`

**Query Parameters:**
- `limit` (integer, 기본값: 20)
- `offset` (integer, 기본값: 0)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "후기 목록 조회 성공",
  "data": {
    "reviews": [
      {
        "id": "1",
        // ... (Review 객체)
        "user": {
          "id": "1",
          "username": "johndoe",
          "name": "홍길동",
          "profileImage": "https://example.com/profile.jpg"
        }
      }
    ],
    "total": 45,
    "averageRating": 4.5
  }
}
```

---

### 7. 사용자의 후기 목록 조회

**GET** `/reviews/users/{userId}`

**Query Parameters:**
- `limit` (integer, 기본값: 20)
- `offset` (integer, 기본값: 0)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "후기 목록 조회 성공",
  "data": {
    "reviews": [ ... ], // Review 배열
    "total": 18
  }
}
```

---

## 공통 데이터 타입

### User
```typescript
{
  id: string;
  username: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "BANNED";
  birthDate?: string; // YYYY-MM-DD
  phone?: string;
  profileImage?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  isPetOwner: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### Pet
```typescript
{
  id: string;
  petName: string;
  species: "DOG" | "CAT" | "OTHER";
  breed?: string;
  age?: number;
  birthDate?: string; // YYYY-MM-DD
  gender?: "MALE" | "FEMALE";
  isNeutered: boolean;
  size?: "SMALL" | "MEDIUM" | "LARGE";
  weight?: number;
  personality?: string;
  healthStatus?: string;
  specialNotes?: string;
  profileImage?: string;
  registrationNumber?: string;
  microchipNumber?: string;
  ownerId: string;
  isVerified: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### WalkingRoute
```typescript
{
  id: string;
  routeName: string;
  region?: string;
  distance?: number; // km
  duration?: number; // 분
  difficulty?: "EASY" | "MODERATE" | "HARD";
  pathData?: string; // JSON string
  description?: string;
  createdAt: string; // ISO 8601
}
```

### Facility
```typescript
{
  id: string;
  name: string;
  type: "CAFE" | "SHOP" | "HOSPITAL" | "PARK" | "OTHER";
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  description?: string;
  isSponsor: boolean;
  discountInfo?: string;
  openingHours?: string;
  imageUrl?: string;
  createdAt: string; // ISO 8601
}
```

### WalkingMate
```typescript
{
  id: string;
  hostId: string;
  routeId?: string;
  walkingDate: string; // ISO 8601
  location: string;
  latitude?: number;
  longitude?: number;
  duration?: number; // 분
  maxParticipants: number;
  petSizeFilter: "ALL" | "SMALL" | "MEDIUM" | "LARGE";
  status: "OPEN" | "FULL" | "COMPLETED" | "CANCELLED";
  description?: string;
  createdAt: string; // ISO 8601
}
```

### WalkingSession
```typescript
{
  id: string;
  mateId: string;
  startTime: string; // ISO 8601
  endTime?: string; // ISO 8601
  actualDistanceM?: number; // 미터
  actualDurationS?: number; // 초
  pathData?: string; // JSON string
  createdAt: string; // ISO 8601
}
```

### HealthLog
```typescript
{
  id: string;
  participantPetId: string;
  preWeight?: number;
  preCondition?: "EXCELLENT" | "GOOD" | "NORMAL" | "TIRED" | "SICK";
  distanceM?: number; // 미터
  durationS?: number; // 초
  avgSpeedMps?: number; // m/s
  maxSpeedMps?: number; // m/s
  caloriesBurned?: number;
  stepCount?: number;
  postCondition?: "EXCELLENT" | "GOOD" | "NORMAL" | "TIRED" | "SICK";
  needsRest: boolean;
  hydrationLevel?: "GOOD" | "MODERATE" | "LOW";
  notes?: string;
  createdAt: string; // ISO 8601
}
```

### Review
```typescript
{
  id: string;
  sessionId: string;
  userId: string;
  overallRating: number; // 1-5
  routeRating?: number; // 1-5
  groupRating?: number; // 1-5
  distance?: number;
  duration?: number;
  notes?: string;
  photoUrls?: string[];
  isPublic: boolean;
  createdAt: string; // ISO 8601
}
```

---

## 인증 헤더

대부분의 API는 인증이 필요합니다. 인증이 필요한 요청에는 다음 헤더를 포함해야 합니다:

```
Authorization: Bearer {accessToken}
```

`accessToken`은 로그인 또는 회원가입 시 받은 토큰입니다.

---

## 에러 코드

- `400`: 잘못된 요청 (Bad Request)
- `401`: 인증 필요 (Unauthorized)
- `403`: 권한 없음 (Forbidden)
- `404`: 리소스를 찾을 수 없음 (Not Found)
- `409`: 충돌 (Conflict, 예: 중복된 데이터)
- `500`: 서버 오류 (Internal Server Error)

---

## 주의사항

1. **ID 타입**: 모든 ID는 문자열(string)로 전송하지만, 서버 내부에서는 BigInt로 처리됩니다.
2. **날짜 형식**: 
   - 날짜만 필요한 경우: `YYYY-MM-DD` (예: `2025-01-01`)
   - 날짜와 시간이 필요한 경우: ISO 8601 형식 (예: `2025-01-01T14:00:00Z`)
3. **페이징**: 목록 조회 API는 `limit`과 `offset` 파라미터를 지원합니다.
4. **토큰 갱신**: `accessToken`이 만료되면 `refreshToken`을 사용하여 갱신해야 합니다.

