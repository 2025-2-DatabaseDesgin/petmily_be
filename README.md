# Node.js Backend Settings

Node.js 기반 백엔드 초기 설정입니다.

## 🚀 초기 설정 및 실행 방법

### 1. 프로젝트 클론

```bash
git clone 
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경 변수들을 설정하세요:

```env
# 서버 설정
PORT=8000

# 데이터베이스 설정
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# JWT 설정
JWT_SECRET=your_jwt_secret_key

```

### 4. Prisma 설정

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션 (필요시)
npx prisma migrate dev

# Prisma Studio 실행 (데이터베이스 GUI)
npx prisma studio
```

### 5. 개발 서버 실행

```bash
# 개발 모드로 실행
npm run dev

# 또는 nodemon으로 실행 (자동 재시작)
npx nodemon
```

### 6. 프로덕션 빌드 및 실행

```bash
# 프로젝트 빌드
npm run build

# 프로덕션 서버 실행
npm start

# PM2로 프로덕션 실행
npm run start:prod
```

## 📁 프로젝트 구조

```
src/
├── controllers/     # 컨트롤러
├── dtos/           # 데이터 전송 객체
├── repositories/   # 데이터 접근 계층
├── routes/         # 라우터
├── services/       # 비즈니스 로직
├── swagger/        # API 문서
├── utils/          # 유틸리티 함수
└── index.ts        # 메인 진입점
```

## 🛠 사용 기술

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL (Prisma ORM)
- **Authentication**: JWT + Session
- **Documentation**: Swagger/OpenAPI
- **Process Manager**: PM2

## 📚 API 문서

개발 서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:

- Swagger UI: `http://localhost:4000/api-docs`

## 🔧 주요 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm start`: 프로덕션 서버 실행
- `npm run start:prod`: PM2로 프로덕션 실행
- `npm run api-docs`: Swagger 문서 생성

## 📝 주의사항

1. **데이터베이스 설정**: MySQL 데이터베이스가 필요하며, `.env` 파일에서 `DATABASE_URL`을 올바르게 설정해야 합니다.
2. **환경 변수**: 프로덕션 환경에서는 보안을 위해 환경 변수를 적절히 설정하세요.
3. **포트 충돌**: 기본 포트 4000이 사용 중인 경우 `.env` 파일에서 `PORT`를 변경하세요.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 ISC 라이선스 하에 배포됩니다.
