# 🔐 환경변수 설정 가이드

환경변수를 올바르게 설정하는 방법입니다.

---

## 📝 Frontend 환경변수

### `.env.local` (로컬 개발용)

`frontend/.env.local` 파일을 생성하고 다음을 추가하세요:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Analytics (선택사항)
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### `.env.production` (프로덕션용)

Vercel 대시보드에서 설정:

```env
NEXT_PUBLIC_API_URL=https://your-backend.herokuapp.com
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 📝 Backend 환경변수

### `.env` (로컬 개발용)

`backend/.env` 파일을 생성하고 다음을 추가하세요:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/gallery?schema=public

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=4000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

### 프로덕션 (Heroku/Railway)

Heroku Dashboard → Settings → Config Vars:

```env
DATABASE_URL=<자동 생성됨>
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-domain.vercel.app
```

---

## ⚠️ 주의사항

1. **절대 Git에 커밋하지 마세요!**
   - `.env` 파일은 `.gitignore`에 포함되어 있습니다
   - 민감한 정보 (API Key, Secret) 보호

2. **NEXT_PUBLIC_ 접두사**
   - 브라우저에서 접근 가능한 변수만 `NEXT_PUBLIC_` 사용
   - 서버 전용 변수는 접두사 없이 사용

3. **Vercel 자동 재배포**
   - 환경변수 변경 후 자동 재배포됩니다
   - 수동 재배포: `Deployments` → `...` → `Redeploy`

---

## 🚀 빠른 시작

### 1단계: 파일 생성

```bash
# Frontend
cd frontend
cp .env.local.example .env.local

# Backend
cd backend
cp .env.example .env
```

### 2단계: 값 입력

각 파일을 열어 실제 값으로 교체하세요.

### 3단계: 서버 재시작

```bash
# Frontend
npm run dev

# Backend
npm run start:dev
```

---

## ✅ 확인 방법

### Frontend

```tsx
console.log(process.env.NEXT_PUBLIC_API_URL);
// http://localhost:4000 (로컬)
// https://your-backend.herokuapp.com (프로덕션)
```

### Backend

```typescript
console.log(process.env.DATABASE_URL);
console.log(process.env.CLOUDINARY_CLOUD_NAME);
```

---

이제 환경변수 설정이 완료되었습니다! 🎉

