# 🎨 온라인 갤러리

모던하고 세련된 온라인 아트 갤러리 플랫폼입니다. NestJS와 Next.js를 활용한 풀스택 애플리케이션입니다.

## 🚀 기술 스택

### Frontend
- **Next.js 16** - React 기반 풀스택 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **shadcn/ui** - 재사용 가능한 UI 컴포넌트 라이브러리
- **Framer Motion** - 부드러운 애니메이션
- **next-themes** - 다크모드 지원
- **Pretendard Variable** - 한글 폰트

### Backend
- **NestJS** - 프로그레시브 Node.js 프레임워크
- **TypeScript** - 타입 안정성
- **Prisma** - 차세대 ORM
- **PostgreSQL** - 관계형 데이터베이스

## 🎨 디자인 시스템

### 컬러 팔레트
- **Primary (Deep Blue)**: #1E40AF - 전문적이고 신뢰감 있는 딥 블루
- **Accent (Gold)**: #F59E0B - 고급스러운 골드 액센트
- 부드러운 그라데이션 효과
- Glassmorphism 스타일 적용

### 주요 특징
- 📱 반응형 디자인
- 🌓 다크모드 지원
- ✨ 부드러운 애니메이션 (Framer Motion)
- 🎭 Glassmorphism 효과
- 🎨 그라데이션 UI 요소
- 🔤 Pretendard Variable 폰트

## 📁 프로젝트 구조

```
온라인갤러리/
├── backend/          # NestJS 백엔드
│   ├── src/
│   ├── test/
│   └── package.json
├── frontend/         # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── public/
│   └── package.json
└── README.md
```

## 🛠️ 설치 및 실행

### 사전 요구사항
- Node.js 18+ 
- npm 또는 yarn
- Docker (PostgreSQL 실행용)

### 1. 데이터베이스 시작

프로젝트 루트에서:

```bash
# PostgreSQL 컨테이너 시작
docker-compose up -d
```

### 2. 환경 변수 설정

`backend/.env` 파일 생성:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/online_gallery?schema=public"
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. 데이터베이스 마이그레이션

```bash
cd backend
npm install

# Prisma Client 생성
npm run prisma:generate

# 마이그레이션 실행
npm run prisma:migrate

# 시드 데이터 입력
npm run prisma:seed
```

### 4. Backend (NestJS)

```bash
cd backend
npm run start:dev
```

백엔드는 `http://localhost:3001`에서 실행됩니다.

### 5. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

### 한 번에 실행 (선택사항)

프로젝트 루트에서:

```bash
# 모든 의존성 설치
npm run install:all

# 백엔드 + 프론트엔드 동시 실행
npm run dev
```

## 🎨 디자인 유틸리티 클래스

프로젝트에 포함된 커스텀 유틸리티 클래스:

### Glassmorphism
```tsx
<div className="glass">
  // 라이트 모드 glass 효과
</div>

<div className="glass-dark">
  // 다크 모드 glass 효과
</div>
```

### 그라데이션
```tsx
<div className="gradient-primary">
  // 딥 블루 그라데이션
</div>

<div className="gradient-accent">
  // 골드 그라데이션
</div>

<div className="gradient-mixed">
  // 블루에서 골드로 이어지는 그라데이션
</div>
```

### 텍스트 그라데이션
```tsx
<h1 className="text-gradient">
  그라데이션 텍스트
</h1>
```

### 호버 효과
```tsx
<div className="hover-lift">
  // 호버 시 올라오는 효과
</div>
```

## 🗄️ 데이터베이스

### 모델 구조

- **Photo**: 사진 정보 (제목, 설명, 부서, 좋아요, 조회수 등)
- **Comment**: 사진 댓글 (익명 닉네임, 내용)
- **Department**: 부서 정보 (이름, 대표 색상)

자세한 내용은 [DATABASE.md](./DATABASE.md)를 참고하세요.

### 주요 명령어

```bash
# Prisma Studio (GUI) 실행
npm run prisma:studio

# 데이터베이스 초기화
npx prisma migrate reset
```

## 🎯 다음 단계

- [x] PostgreSQL + Prisma 데이터베이스 설정
- [x] Photo, Comment, Department 모델 정의
- [x] 시드 데이터 생성
- [x] Photo CRUD API 엔드포인트
- [x] Cloudinary 이미지 업로드 (자동 리사이징, WebP 변환)
- [x] EXIF 데이터 추출
- [x] 파일 검증 (형식, 크기)
- [x] 좋아요 기능
- [x] 사진 업로드 페이지 (드래그 앤 드롭, 크롭, 필터)
- [x] 업로드 진행 상태 및 confetti 효과
- [x] 갤러리 메인 페이지 (히어로, TOP 3, 필터, Masonry)
- [x] 실시간 HOT 3 배너 (swiper.js, 3D Coverflow, 빛나는 효과)
- [x] 무한 스크롤
- [x] 검색 및 정렬 기능
- [x] URL 쿼리 파라미터로 필터 상태 관리
- [x] Fade-in 애니메이션 + 순차적 카드 등장
- [x] iOS 스타일 정렬 스위치
- [x] 반응형 레이아웃
- [x] 사진 상세보기 모달 (react-zoom-pan-pinch, lottie-react)
- [x] 이미지 확대/축소 및 Shimmer 로딩 효과
- [x] 좋아요 버튼 (Lottie 하트 애니메이션)
- [x] 댓글 섹션 UI (스크롤, 작성 폼)
- [x] 이전/다음 사진 썸네일 네비게이션
- [x] Comment CRUD API 엔드포인트 (백엔드)
- [x] 스팸 방지 기능 (IP별 1분 내 3개 제한)
- [x] 랜덤 닉네임 생성기 (형용사 + 동물)
- [x] DiceBear 아바타 (닉네임별 고정)
- [x] 카카오톡 스타일 댓글 말풍선
- [x] 확장 가능한 textarea + 200자 제한
- [x] 상대적 시간 표시 ("방금 전", "5분 전" 등)
- [x] 댓글 애니메이션 (Spring 효과)
- [x] 좋아요 API 엔드포인트 (백엔드)
- [x] LocalStorage 좋아요 중복 방지
- [x] Optimistic Update (즉시 반영)
- [x] 하트 통통 튀는 애니메이션
- [x] 숫자 카운트업 애니메이션
- [x] 파티클 효과 (하트 터짐)
- [x] PhotoCard & PhotoDetailModal 좋아요 통합
- [x] 반응형 디자인 (Mobile 1열 / Tablet 2열 / Desktop 3-4열)
- [x] 모바일 하단 네비게이션
- [x] 모달 모바일 전체화면
- [x] Next.js Image 컴포넌트 (WebP/AVIF)
- [x] Lazy Loading & 코드 스플리팅
- [x] ISR (10분 revalidate)
- [x] CDN 캐싱 설정
- [x] 로딩 스피너 (카메라 아이콘)
- [x] 404 에러 페이지 (일러스트)
- [x] 빈 상태 컴포넌트
- [x] 토스트 알림 시스템
- [x] 스크롤 탑 버튼
- [x] 커서 스타일 최적화
- [x] Open Graph & Twitter Card
- [x] 동적 메타데이터 (사진별)
- [x] Sitemap.xml 자동 생성
- [x] Robots.txt 설정
- [x] PWA Manifest
- [x] Vercel 배포 준비
- [x] 빌드 최적화 (번들 스플리팅)
- [x] Analytics 준비 (GA4, Vercel)
- [x] Unsplash 스타일 그리드 레이아웃
- [x] Dribbble 스타일 컬러풀 필터
- [x] Instagram 스타일 모달
- [x] Pinterest 스타일 Masonry
- [x] 0.3초 통일 Transition
- [x] WCAG AA 색상 접근성
- [x] 다크모드 최적화

## 📄 라이선스

MIT License

## 👨‍💻 개발자

온라인 갤러리 프로젝트

