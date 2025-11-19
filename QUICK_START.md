# 🚀 빠른 시작 가이드

웹에서 결과물을 보는 방법입니다!

---

## 📋 준비사항

1. **Node.js** (v18 이상)
2. **PostgreSQL** (Docker 또는 로컬 설치)
3. **Cloudinary 계정** (이미지 업로드용)

---

## ⚡ 빠른 실행 (3단계)

### 1단계: 패키지 설치

```bash
# 루트 디렉토리에서
cd /Users/boramlee/온라인갤러리

# 모든 패키지 설치 (Frontend + Backend)
npm run install:all
```

또는 개별 설치:

```bash
# Frontend 패키지 설치
cd frontend
npm install

# Backend 패키지 설치
cd ../backend
npm install
```

---

### 2단계: 환경변수 설정

#### Frontend 환경변수

`frontend/.env.local` 파일 생성:

```bash
cd frontend
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF
```

#### Backend 환경변수

`backend/.env` 파일 생성:

```bash
cd ../backend
cat > .env << EOF
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/gallery?schema=public

# Cloudinary (임시 - 나중에 실제 값으로 변경)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=4000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
EOF
```

---

### 3단계: 데이터베이스 시작

#### Docker 사용 (권장):

```bash
# 루트 디렉토리에서
cd /Users/boramlee/온라인갤러리
docker-compose up -d
```

#### 로컬 PostgreSQL 사용:

```bash
# PostgreSQL 실행 후 데이터베이스 생성
createdb gallery
```

---

### 4단계: 데이터베이스 마이그레이션

```bash
cd backend

# Prisma 마이그레이션
npx prisma migrate dev

# 초기 데이터 삽입 (부서 정보 등)
npx prisma db seed
```

---

### 5단계: 서버 실행

#### 방법 1: 동시 실행 (권장)

루트 디렉토리에서:

```bash
npm run dev
```

이 명령어는 Frontend와 Backend를 동시에 실행합니다!

#### 방법 2: 개별 실행

**터미널 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**터미널 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🌐 웹 접속

### Frontend (Next.js)
```
http://localhost:3000
```

### Backend API (NestJS)
```
http://localhost:4000
```

### API 테스트
```
http://localhost:4000/health
```

---

## 📸 페이지 둘러보기

### 1. 홈 페이지
```
http://localhost:3000
```
- 시작 페이지
- 갤러리/업로드 링크

### 2. 갤러리 페이지
```
http://localhost:3000/gallery
```
- 실시간 HOT 3 배너
- 부서별 필터
- Masonry 레이아웃
- 무한 스크롤

### 3. 업로드 페이지
```
http://localhost:3000/upload
```
- 드래그 앤 드롭
- 이미지 크롭
- 필터 효과
- Confetti 애니메이션

---

## 🔧 문제 해결

### 1. 패키지 설치 오류

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 2. PostgreSQL 연결 오류

```bash
# Docker 상태 확인
docker ps

# 재시작
docker-compose restart

# 로그 확인
docker-compose logs postgres
```

### 3. Prisma 오류

```bash
# Prisma 재생성
npx prisma generate

# 마이그레이션 재실행
npx prisma migrate reset
```

### 4. 포트 충돌

**3000 포트 사용 중:**
```bash
# 프로세스 확인
lsof -i :3000

# 종료
kill -9 <PID>
```

**4000 포트 사용 중:**
```bash
lsof -i :4000
kill -9 <PID>
```

---

## 🎨 기능 테스트

### 1. 사진 업로드 테스트

⚠️ **Cloudinary 설정 필요!**

Cloudinary 계정이 없다면:
1. https://cloudinary.com 회원가입
2. Dashboard → Settings
3. Cloud Name, API Key, API Secret 복사
4. `backend/.env`에 입력

```bash
# backend/.env 수정
CLOUDINARY_CLOUD_NAME=실제_cloud_name
CLOUDINARY_API_KEY=실제_api_key
CLOUDINARY_API_SECRET=실제_api_secret
```

Backend 재시작:
```bash
cd backend
npm run start:dev
```

### 2. 테스트 사진 없이 둘러보기

데이터가 없으면 빈 상태가 표시됩니다:
- "아직 사진이 없어요" 일러스트
- "사진 업로드하기" 버튼

### 3. 다크모드 테스트

- 우상단 테마 토글 버튼 클릭
- 자동으로 다크/라이트 모드 전환

---

## 📊 개발 도구

### Prisma Studio (데이터베이스 GUI)

```bash
cd backend
npx prisma studio
```

→ http://localhost:5555 접속

### API 문서 (Swagger) - 선택사항

```bash
# backend/src/main.ts에서 활성화 필요
```

---

## 🎯 다음 단계

### 1. Cloudinary 설정
- 이미지 업로드 기능 활성화

### 2. 테스트 데이터 추가
- 사진 몇 개 업로드해보기
- 댓글 작성해보기
- 좋아요 눌러보기

### 3. 반응형 테스트
- 모바일 크기 (DevTools)
- 태블릿 크기
- 데스크톱 크기

### 4. 배포 준비
- Vercel에 배포
- Backend Heroku/Railway 배포

---

## ✅ 체크리스트

실행 전:
- [ ] Node.js 설치 확인 (`node -v`)
- [ ] PostgreSQL 실행 확인
- [ ] 환경변수 파일 생성
- [ ] 패키지 설치 완료

실행 후:
- [ ] Frontend 접속 (localhost:3000)
- [ ] Backend 접속 (localhost:4000/health)
- [ ] 콘솔 오류 확인
- [ ] 페이지 로딩 확인

---

## 🎉 완료!

이제 웹에서 아름다운 갤러리를 볼 수 있습니다!

### 주요 페이지:

1. **홈**: http://localhost:3000
2. **갤러리**: http://localhost:3000/gallery  
3. **업로드**: http://localhost:3000/upload

즐거운 개발 되세요! 🚀✨

