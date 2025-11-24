# feat: 산책 중심 DB 스키마 재설계

## 📋 Summary

산책 도메인을 중심으로 DB 스키마를 전면 재설계하고, 불필요한 소셜 기능 및 통계 모델을 제거하여 산책 시스템에 집중한 깔끔한 설계로 개선했습니다.

---

## ✨ 새로 추가된 모델 (7개)

### 산책 시스템
- **Facility**: 후원 시설 (애견카페, 애견용품샵, 병원 등)
- **FacilityRoute**: 산책로-시설 M:N 매핑
- **WalkingWaitlist**: 산책 메이트 대기열 시스템
- **WalkingSession**: 실제 진행된 산책 기록
- **WalkingReview**: 산책 후기 (평가 + 기록)
- **WalkingParticipantPet**: 참가자별 반려동물 (다중 반려동물 지원)
- **PetWalkingHealthLog**: 반려동물 건강 수치 로그 (1:1 관계)

---

## 🗑️ 제거된 모델 (11개)

### 소셜 기능 (7개)
- Post, Comment, Like
- Notification, Hashtag, PostHashtag, PostImage

### 통계 및 활동 (4개)
- UserActivityStats, UserAgreement
- DailyStatistics, SystemLog

---

## 🎯 핵심 DB 설계 포인트

### 1. 다중 반려동물 산책 지원
```
WalkingParticipant (참가자)
    └─< WalkingParticipantPet (M:N)
            └─> Pet
```

### 2. 대기열 시스템
```
WalkingMate (모집)
    ├─< WalkingParticipant (확정 참가자)
    └─< WalkingWaitlist (대기 중)
```
- 취소 발생 시 `SELECT FOR UPDATE`로 동시성 제어
- 대기 순서(priority) 기반 자동 승격

### 3. 모집 → 실행 → 기록 분리
```
WalkingMate (계획/모집)
    └─< WalkingSession (실제 진행)
            └─< WalkingReview (참가자별 후기)
```

### 4. 반려동물 건강 로그 (1:1 관계)
```
WalkingParticipantPet (1) ─── (1) PetWalkingHealthLog
```
- UNIQUE 제약조건으로 1:1 관계 보장
- 산책 전/중/후 건강 수치 기록

### 5. 후원 시설 연동 (M:N)
```
WalkingRoute (M) ←→ (N) Facility
        └── FacilityRoute (매핑 테이블)
```

---

## 💡 DB 기술 논의 가능 영역

1. **동시성 제어**: 대기열 승격 시 `SELECT FOR UPDATE`
2. **관계 모델링**: M:N, 1:1, 자기참조 관계
3. **정규화**: 모집/실행/후기 분리 (관심사 분리 원칙)
4. **인덱스 전략**: 위치 기반, 날짜 범위, 복합 인덱스
5. **제약조건**: UNIQUE, CHECK, CASCADE

---

## 📊 변경 통계

- **스키마 크기**: 737줄 → 501줄 (32% 축소)
- **모델 수**: 26개 → 15개
- **Enum 수**: 15개 → 10개

---

## 🔍 주요 커밋

1. `f686f41` - feat: 산책 중심 DB 스키마 재설계
2. `00f09e4` - refactor: 소셜 기능 및 통계 모델 제거

---

## ✅ 체크리스트

- [x] 산책 핵심 기능 모델 추가
- [x] 소셜 기능 모델 제거
- [x] 통계 및 활동 모델 제거
- [x] 불필요한 Enum 제거
- [x] Relations 정리
- [x] Prisma 스키마 포맷팅

---

## 📝 PR 생성 방법

### GitHub에서 직접 생성:
1. https://github.com/2025-2-DatabaseDesgin/petmily_be/pull/new/claude/petmily-db-schema-016FUbkDP8Vgbu2EzDMfoW7b
2. Base branch: `dev`
3. Compare branch: `claude/petmily-db-schema-016FUbkDP8Vgbu2EzDMfoW7b`
4. 위 내용을 PR Description에 복사

### 또는 명령줄에서:
```bash
gh pr create --base dev --title "feat: 산책 중심 DB 스키마 재설계" --body-file PR_DESCRIPTION.md
```
