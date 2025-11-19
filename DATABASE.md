# 🗄️ 데이터베이스 가이드

## PostgreSQL + Prisma 설정 가이드

### 1. 데이터베이스 구조

#### Photo (사진)
- `id` - UUID (Primary Key)
- `departmentName` - 부서명 (Foreign Key → Department.name)
- `title` - 제목
- `description` - 설명 (최대 100자)
- `imageUrl` - 이미지 URL
- `uploadDate` - 업로드 날짜
- `likeCount` - 좋아요 수
- `viewCount` - 조회수
- `isTopPick` - 관리자 추천 여부

**인덱스**: likeCount, uploadDate, departmentName, isTopPick

#### Comment (댓글)
- `id` - UUID (Primary Key)
- `photoId` - 사진 ID (Foreign Key → Photo.id)
- `nickname` - 익명 닉네임
- `content` - 댓글 내용
- `createdAt` - 작성일시

**인덱스**: photoId, createdAt

#### Department (부서)
- `id` - UUID (Primary Key)
- `name` - 부서명 (Unique)
- `color` - 부서 대표 색상 (HEX)

---

## 🚀 빠른 시작

### Docker로 PostgreSQL 실행

프로젝트 루트에서:

```bash
# PostgreSQL 컨테이너 시작
docker-compose up -d

# 컨테이너 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs -f postgres
```

### 환경 변수 설정

`backend/.env` 파일을 생성하고:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/online_gallery?schema=public"
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 데이터베이스 마이그레이션

```bash
cd backend

# Prisma Client 생성
npm run prisma:generate

# 마이그레이션 실행 (테이블 생성)
npm run prisma:migrate

# 시드 데이터 입력
npm run prisma:seed
```

---

## 📝 주요 명령어

### Prisma CLI

```bash
# Prisma Client 재생성
npm run prisma:generate

# 마이그레이션 생성 및 실행
npm run prisma:migrate

# 시드 데이터 입력
npm run prisma:seed

# Prisma Studio 열기 (GUI)
npm run prisma:studio
```

### Docker

```bash
# PostgreSQL 시작
docker-compose up -d

# PostgreSQL 중지
docker-compose down

# PostgreSQL 중지 및 데이터 삭제
docker-compose down -v

# PostgreSQL 재시작
docker-compose restart
```

---

## 🎨 시드 데이터

`prisma/seed.ts`에 정의된 샘플 데이터:

- **부서**: 6개 (기획팀, 디자인팀, 개발팀, 마케팅팀, 인사팀, 영업팀)
- **사진**: 8개 (각 부서별 활동 사진)
- **댓글**: 랜덤 생성

---

## 🔍 Prisma Studio

Prisma Studio는 데이터베이스를 시각적으로 관리할 수 있는 GUI 도구입니다.

```bash
npm run prisma:studio
```

브라우저에서 `http://localhost:5555` 접속

---

## 📊 ERD (Entity Relationship Diagram)

```
┌─────────────┐
│ Department  │
│─────────────│
│ id (PK)     │
│ name (UQ)   │◄──┐
│ color       │   │
└─────────────┘   │
                  │
                  │ 1:N
                  │
┌─────────────┐   │
│ Photo       │   │
│─────────────│   │
│ id (PK)     │   │
│ department──┼───┘
│   Name (FK) │
│ title       │
│ description │
│ imageUrl    │
│ uploadDate  │◄──────── 인덱스
│ likeCount   │◄──────── 인덱스
│ viewCount   │
│ isTopPick   │◄──────── 인덱스
└─────────────┘
       │
       │ 1:N
       │
       ▼
┌─────────────┐
│ Comment     │
│─────────────│
│ id (PK)     │
│ photoId(FK) │◄──────── 인덱스
│ nickname    │
│ content     │
│ createdAt   │◄──────── 인덱스
└─────────────┘
```

---

## 🛠️ 트러블슈팅

### 연결 오류

```bash
# PostgreSQL 실행 여부 확인
docker-compose ps

# 포트 충돌 확인
lsof -i :5432
```

### 마이그레이션 오류

```bash
# 마이그레이션 초기화
npx prisma migrate reset

# 다시 마이그레이션
npm run prisma:migrate
```

### Prisma Client 오류

```bash
# Client 재생성
npm run prisma:generate

# node_modules 재설치
rm -rf node_modules
npm install
```

---

## 📚 참고 자료

- [Prisma 공식 문서](https://www.prisma.io/docs)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [NestJS Prisma 가이드](https://docs.nestjs.com/recipes/prisma)

