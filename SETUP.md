# 🚀 빠른 시작 가이드

## 전체 설치 및 실행

### 1단계: PostgreSQL 시작

프로젝트 루트에서:

```bash
# Docker로 PostgreSQL 실행
docker-compose up -d

# 컨테이너 상태 확인
docker-compose ps
```

### 2단계: 백엔드 설정

```bash
cd backend

# 의존성 설치
npm install

# .env 파일 생성 (.env.example 참고)
cp .env.example .env

# Prisma Client 생성
npm run prisma:generate

# 데이터베이스 마이그레이션
npm run prisma:migrate

# 시드 데이터 입력
npm run prisma:seed
```

마이그레이션 이름을 입력하라고 나오면 `init` 또는 원하는 이름을 입력하세요.

### 3단계: 프론트엔드 설치

```bash
cd ../frontend
npm install
```

### 4단계: 개발 서버 실행

**옵션 A: 한 번에 실행 (권장)**

프로젝트 루트에서:

```bash
npm run dev
```

**옵션 B: 개별 실행**

터미널 1 (백엔드):
```bash
cd backend
npm run start:dev
```

터미널 2 (프론트엔드):
```bash
cd frontend
npm run dev
```

### 5단계: 확인

- 🎨 **프론트엔드**: http://localhost:3000
- 🔷 **백엔드 API**: http://localhost:3001
- 📊 **Prisma Studio**: `cd backend && npm run prisma:studio` (http://localhost:5555)

---

## 🧪 API 테스트

### 기본 엔드포인트

```bash
# API 상태 확인
curl http://localhost:3001

# 헬스 체크
curl http://localhost:3001/health

# 부서 목록 조회 (테스트용)
curl http://localhost:3001/test/departments

# 사진 목록 조회 (테스트용)
curl http://localhost:3001/test/photos
```

---

## 🎨 주요 기능 확인

### 프론트엔드

1. **다크모드**: 우측 상단 달/해 아이콘 클릭
2. **Glassmorphism**: 헤더의 유리 효과 확인
3. **애니메이션**: 페이지 스크롤 시 부드러운 전환 효과
4. **그라데이션**: Primary, Accent, Mixed 카드 호버
5. **Pretendard 폰트**: 한글 텍스트 렌더링 확인

### 백엔드

1. **Prisma Studio**: 
   ```bash
   cd backend
   npm run prisma:studio
   ```
   브라우저에서 http://localhost:5555 접속하여 데이터 확인

2. **데이터베이스 구조**:
   - **Department**: 6개 부서 (기획팀, 디자인팀, 개발팀, 마케팅팀, 인사팀, 영업팀)
   - **Photo**: 8개 샘플 사진
   - **Comment**: 랜덤 댓글

---

## 🔧 문제 해결

### PostgreSQL 연결 오류

```bash
# Docker 컨테이너 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs postgres

# 컨테이너 재시작
docker-compose restart
```

### 포트 충돌

**백엔드 포트 변경 (3001 → 다른 포트):**

`backend/.env`:
```env
PORT=3002
```

`frontend/.env.local` (새로 생성):
```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### Prisma 오류

```bash
cd backend

# Client 재생성
npm run prisma:generate

# 마이그레이션 초기화
npx prisma migrate reset

# 다시 마이그레이션
npm run prisma:migrate
```

### 의존성 오류

```bash
# 전체 재설치
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json

# 루트에서
npm install
cd backend && npm install
cd ../frontend && npm install
```

---

## 📊 데이터베이스 관리

### 유용한 명령어

```bash
cd backend

# Prisma Studio (GUI) 실행
npm run prisma:studio

# 마이그레이션 생성
npm run prisma:migrate

# 시드 데이터 재입력
npm run prisma:seed

# 데이터베이스 초기화 (주의!)
npx prisma migrate reset
```

### Docker 명령어

```bash
# PostgreSQL 시작
docker-compose up -d

# PostgreSQL 중지
docker-compose down

# PostgreSQL 중지 및 데이터 삭제
docker-compose down -v

# PostgreSQL 로그 확인
docker-compose logs -f postgres
```

---

## 🎯 다음 단계

### 백엔드 개발

```bash
cd backend

# 새 모듈 생성
nest g module photos
nest g controller photos
nest g service photos

# 또는 한 번에
nest g resource photos
```

### 프론트엔드 개발

```bash
cd frontend

# shadcn/ui 컴포넌트 추가
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add form
```

### 추천 shadcn/ui 컴포넌트

```bash
# 갤러리 UI에 유용한 컴포넌트들
npx shadcn@latest add button card dialog dropdown-menu input label select textarea badge avatar skeleton tabs
```

---

## 📚 참고 문서

- **프로젝트 전체**: [README.md](./README.md)
- **데이터베이스**: [DATABASE.md](./DATABASE.md)
- **프론트엔드**: [frontend/README.md](./frontend/README.md)
- **백엔드**: [backend/README.md](./backend/README.md)

---

## 🌟 Quick Commands

```bash
# 모든 것을 한 번에 시작
docker-compose up -d && npm run dev

# Prisma Studio + 개발 서버
cd backend && npm run prisma:studio & npm run start:dev

# 데이터베이스 리셋 + 시드
cd backend && npx prisma migrate reset --force
```

즐거운 개발 되세요! 🎨✨
