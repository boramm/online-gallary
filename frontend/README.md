# 온라인 갤러리 - Frontend

Next.js로 구축된 온라인 갤러리의 프론트엔드입니다.

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)를 열어주세요.

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

## 🎨 기술 스택

- **Next.js 16** - React 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 유틸리티 CSS
- **shadcn/ui** - UI 컴포넌트
- **Framer Motion** - 애니메이션
- **next-themes** - 다크모드
- **Pretendard** - 한글 폰트

## 📁 구조

```
src/
├── app/              # Next.js App Router
│   ├── layout.tsx   # 루트 레이아웃
│   ├── page.tsx     # 홈페이지
│   └── globals.css  # 글로벌 스타일
├── components/       # React 컴포넌트
│   ├── ui/          # shadcn/ui 컴포넌트
│   └── theme-provider.tsx
└── lib/             # 유틸리티 함수
    ├── utils.ts
    └── api.ts       # API 클라이언트
```

## 🎨 커스텀 스타일

### 유틸리티 클래스

- `.glass` - Glassmorphism 효과
- `.gradient-primary` - 딥 블루 그라데이션
- `.gradient-accent` - 골드 그라데이션
- `.gradient-mixed` - 혼합 그라데이션
- `.text-gradient` - 그라데이션 텍스트
- `.hover-lift` - 호버 리프트 효과

### 색상 시스템

- **Primary**: Deep Blue (#1E40AF)
- **Accent**: Gold (#F59E0B)
- 라이트/다크 모드 모두 지원

## 🔗 API 연결

`.env.local` 파일에 백엔드 API URL을 설정하세요:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📝 라이선스

MIT
