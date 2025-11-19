# ✅ Prisma + PostgreSQL 설정 완료

## 🎉 완료된 작업

### 1. 데이터베이스 모델 정의

#### Photo (사진)
```prisma
model Photo {
  id             String   @id @default(uuid())
  departmentName String
  title          String
  description    String   @db.VarChar(100)  // 100자 제한
  imageUrl       String
  uploadDate     DateTime @default(now())
  likeCount      Int      @default(0)
  viewCount      Int      @default(0)
  isTopPick      Boolean  @default(false)   // 관리자 추천
  
  department Department @relation(fields: [departmentName], references: [name])
  comments   Comment[]
  
  // 인덱스
  @@index([likeCount])
  @@index([uploadDate])
  @@index([departmentName])
  @@index([isTopPick])
}
```

#### Comment (댓글)
```prisma
model Comment {
  id        String   @id @default(uuid())
  photoId   String
  nickname  String   // 익명 닉네임
  content   String   @db.Text
  createdAt DateTime @default(now())
  
  photo Photo @relation(fields: [photoId], references: [id], onDelete: Cascade)
  
  @@index([photoId])
  @@index([createdAt])
}
```

#### Department (부서)
```prisma
model Department {
  id     String  @id @default(uuid())
  name   String  @unique
  color  String  // 부서별 대표 색상 (HEX)
  photos Photo[]
}
```

### 2. 설치된 패키지

- `prisma` - Prisma CLI
- `@prisma/client` - Prisma Client
- `ts-node` - TypeScript 실행 (시드 스크립트용)

### 3. 생성된 파일

```
backend/
├── prisma/
│   ├── schema.prisma    # 데이터베이스 스키마 정의
│   └── seed.ts          # 시드 데이터 (부서 6개, 사진 8개, 댓글)
├── src/
│   └── prisma/
│       ├── prisma.module.ts    # Prisma 모듈
│       └── prisma.service.ts   # Prisma 서비스
└── .env.example         # 환경 변수 템플릿

루트/
├── docker-compose.yml   # PostgreSQL 컨테이너 설정
├── DATABASE.md          # 데이터베이스 상세 가이드
└── SETUP.md            # 빠른 시작 가이드 (업데이트)
```

### 4. 추가된 npm 스크립트

```json
{
  "prisma:generate": "prisma generate",      // Client 생성
  "prisma:migrate": "prisma migrate dev",    // 마이그레이션
  "prisma:seed": "ts-node prisma/seed.ts",  // 시드 데이터
  "prisma:studio": "prisma studio"           // GUI 도구
}
```

### 5. Docker Compose 설정

```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: online_gallery
```

### 6. 인덱스 최적화

요청하신 대로 다음 필드에 인덱스가 추가되었습니다:

- ✅ `Photo.likeCount` - 좋아요 수 정렬/필터링
- ✅ `Photo.uploadDate` - 날짜별 정렬/필터링
- ✅ `Photo.departmentName` - 부서별 필터링
- ✅ `Photo.isTopPick` - 관리자 추천 필터링 (보너스)
- ✅ `Comment.photoId` - 댓글 조회 최적화
- ✅ `Comment.createdAt` - 댓글 정렬 최적화

---

## 🚀 시작하기

### 1단계: PostgreSQL 실행

```bash
docker-compose up -d
```

### 2단계: 환경 변수 설정

`backend/.env` 파일 생성:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/online_gallery?schema=public"
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3단계: 데이터베이스 마이그레이션

```bash
cd backend

# Prisma Client 생성
npm run prisma:generate

# 마이그레이션 실행 (테이블 생성)
npm run prisma:migrate
# 👆 마이그레이션 이름 입력 요청 시 "init" 입력

# 시드 데이터 입력
npm run prisma:seed
```

### 4단계: 확인

```bash
# 백엔드 실행
npm run start:dev

# 다른 터미널에서 API 테스트
curl http://localhost:3001/test/departments
curl http://localhost:3001/test/photos
```

또는 Prisma Studio로 데이터 확인:

```bash
npm run prisma:studio
# http://localhost:5555
```

---

## 📊 시드 데이터

### 부서 (6개)
1. 기획팀 - Deep Blue (#1E40AF)
2. 디자인팀 - Gold (#F59E0B)
3. 개발팀 - Green (#10B981)
4. 마케팅팀 - Red (#EF4444)
5. 인사팀 - Purple (#8B5CF6)
6. 영업팀 - Blue (#3B82F6)

### 사진 (8개)
- Unsplash의 고품질 이미지 URL 사용
- 각 부서별 업무 활동 사진
- 좋아요 수, 조회수, 관리자 추천 여부 다양하게 설정

### 댓글
- 랜덤으로 익명 닉네임과 댓글 생성
- 사진당 1~3개의 댓글

---

## 🎯 테스트 API 엔드포인트

백엔드 `app.controller.ts`에 테스트용 엔드포인트가 추가되었습니다:

### GET /test/departments
```json
{
  "message": "부서 목록 조회 성공",
  "count": 6,
  "data": [
    {
      "id": "uuid",
      "name": "기획팀",
      "color": "#1E40AF"
    },
    ...
  ]
}
```

### GET /test/photos
```json
{
  "message": "사진 목록 조회 성공 (최근 5개)",
  "count": 5,
  "data": [
    {
      "id": "uuid",
      "title": "2024 신규 프로젝트 기획안",
      "description": "...",
      "department": { ... },
      "comments": [ ... ],
      "likeCount": 42,
      "viewCount": 156,
      "isTopPick": true
    },
    ...
  ]
}
```

---

## 🛠️ 유용한 명령어

```bash
# Prisma Studio 실행 (GUI)
npm run prisma:studio

# 데이터베이스 초기화 (주의!)
npx prisma migrate reset

# 마이그레이션 상태 확인
npx prisma migrate status

# 스키마 포맷팅
npx prisma format
```

---

## 📚 추가 문서

- **전체 가이드**: [README.md](./README.md)
- **데이터베이스 상세**: [DATABASE.md](./DATABASE.md)
- **빠른 시작**: [SETUP.md](./SETUP.md)

---

## ✨ 다음 단계

이제 Prisma와 PostgreSQL이 완벽하게 설정되었습니다!

### 백엔드 개발

```bash
# Photo 리소스 생성
nest g resource photos

# Comment 리소스 생성
nest g resource comments

# Department 리소스 생성
nest g resource departments
```

### API 개발 예시

```typescript
// photos.service.ts
constructor(private prisma: PrismaService) {}

async findAll() {
  return this.prisma.photo.findMany({
    include: {
      department: true,
      comments: true,
    },
    orderBy: {
      uploadDate: 'desc',
    },
  });
}
```

즐거운 개발 되세요! 🎨✨

