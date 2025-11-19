# 🚀 시선이 있는날 - 서버 배포 가이드

## 📋 목차
1. [사전 준비사항](#사전-준비사항)
2. [파일 구조](#파일-구조)
3. [환경 변수 설정](#환경-변수-설정)
4. [백엔드 배포](#백엔드-배포)
5. [프론트엔드 배포](#프론트엔드-배포)
6. [데이터베이스 설정](#데이터베이스-설정)
7. [트러블슈팅](#트러블슈팅)

---

## 사전 준비사항

### 필수 소프트웨어
- **Node.js**: v18.x 이상
- **npm**: v9.x 이상
- **Git**: (선택사항)

### 필수 서비스 계정
- **Cloudinary** 무료 계정 (이미지 저장소)
  - 가입: https://cloudinary.com
  - 필요 정보: Cloud Name, API Key, API Secret

---

## 파일 구조

```
online-gallery/
├── backend/               # 백엔드 (NestJS)
│   ├── src/              # 소스 코드
│   ├── prisma/           # 데이터베이스 스키마
│   ├── package.json      # 의존성
│   ├── tsconfig.json     # TypeScript 설정
│   └── nest-cli.json     # NestJS 설정
│
├── frontend/             # 프론트엔드 (Next.js)
│   ├── src/              # 소스 코드
│   ├── public/           # 정적 파일
│   ├── package.json      # 의존성
│   ├── next.config.ts    # Next.js 설정
│   └── tailwind.config.ts
│
└── DEPLOYMENT_GUIDE.md   # 이 파일
```

---

## 환경 변수 설정

### 1. 백엔드 환경 변수

`backend/.env` 파일 생성:

```env
# 데이터베이스 (SQLite)
DATABASE_URL="file:./prisma/dev.db"

# Cloudinary (필수!)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# 서버 설정
PORT=3001
NODE_ENV=production

# CORS (프론트엔드 주소)
CORS_ORIGIN=http://your-frontend-domain.com
```

**⚠️ 중요:**
- `CLOUDINARY_*` 값을 실제 Cloudinary 계정 정보로 교체
- `CORS_ORIGIN`을 실제 프론트엔드 도메인으로 교체

### 2. 프론트엔드 환경 변수

`frontend/.env.local` 파일 생성:

```env
# API URL (백엔드 주소)
NEXT_PUBLIC_API_URL=http://your-backend-domain.com:3001

# 사이트 URL
NEXT_PUBLIC_SITE_URL=http://your-frontend-domain.com
```

---

## 백엔드 배포

### 1. 서버에 파일 업로드
프로젝트 전체를 서버에 업로드합니다.

### 2. 백엔드 디렉토리로 이동
```bash
cd online-gallery/backend
```

### 3. 의존성 설치
```bash
npm install
```

### 4. 환경 변수 설정
위의 백엔드 환경 변수를 `.env` 파일에 작성합니다.

### 5. 데이터베이스 마이그레이션
```bash
npx prisma migrate deploy
```

### 6. 샘플 데이터 생성 (선택사항)
```bash
npx prisma db seed
```

### 7. 프로덕션 빌드
```bash
npm run build
```

### 8. 서버 시작
```bash
npm run start:prod
```

**또는 PM2 사용 (권장):**
```bash
# PM2 설치 (전역)
npm install -g pm2

# 서버 시작
pm2 start npm --name "backend" -- run start:prod

# 서버 상태 확인
pm2 status

# 로그 확인
pm2 logs backend

# 서버 재시작
pm2 restart backend
```

### 9. 서버 확인
```bash
curl http://localhost:3001
# "온라인 갤러리 API에 오신 것을 환영합니다! 🎨" 메시지가 나와야 함
```

---

## 프론트엔드 배포

### 1. 프론트엔드 디렉토리로 이동
```bash
cd online-gallery/frontend
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
위의 프론트엔드 환경 변수를 `.env.local` 파일에 작성합니다.

### 4. 프로덕션 빌드
```bash
npm run build
```

### 5. 서버 시작
```bash
npm run start
```

**또는 PM2 사용 (권장):**
```bash
pm2 start npm --name "frontend" -- run start

# 서버 상태 확인
pm2 status

# 로그 확인
pm2 logs frontend
```

### 6. 서버 확인
브라우저에서 `http://your-server-ip:3000` 접속

---

## 데이터베이스 설정

### SQLite (기본 설정)
- 별도 설치 불필요
- 파일 기반: `backend/prisma/dev.db`
- 자동 생성됨

### PostgreSQL로 변경 (선택사항)

**1. PostgreSQL 설치**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# 데이터베이스 생성
sudo -u postgres createdb gallery
```

**2. 환경 변수 수정**
`backend/.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/gallery?schema=public"
```

**3. 스키마 파일 수정**
`backend/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // sqlite에서 변경
  url      = env("DATABASE_URL")
}
```

**4. 마이그레이션**
```bash
npx prisma migrate deploy
```

---

## 포트 설정

### 기본 포트
- 백엔드: `3001`
- 프론트엔드: `3000`

### 포트 변경 방법

**백엔드 포트 변경:**
`backend/.env`:
```env
PORT=8080  # 원하는 포트로 변경
```

**프론트엔드 포트 변경:**
```bash
# package.json의 start 스크립트 수정
"start": "next start -p 8080"

# 또는 실행 시 지정
PORT=8080 npm run start
```

---

## 방화벽 설정

서버 방화벽에서 다음 포트를 열어야 합니다:

```bash
# Ubuntu/Debian (ufw)
sudo ufw allow 3000  # 프론트엔드
sudo ufw allow 3001  # 백엔드

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload
```

---

## Nginx 리버스 프록시 (권장)

### 1. Nginx 설치
```bash
sudo apt update
sudo apt install nginx
```

### 2. Nginx 설정
`/etc/nginx/sites-available/gallery`:
```nginx
# 프론트엔드
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 백엔드 API
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. 설정 활성화
```bash
sudo ln -s /etc/nginx/sites-available/gallery /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 자동 시작 설정 (PM2)

### 부팅 시 자동 시작
```bash
# PM2 startup 스크립트 생성
pm2 startup

# 현재 프로세스 저장
pm2 save
```

### 모든 프로세스 확인
```bash
pm2 list
```

---

## 트러블슈팅

### 1. 백엔드가 시작되지 않음

**확인사항:**
```bash
# 로그 확인
pm2 logs backend

# 포트 충돌 확인
lsof -i :3001
```

**해결방법:**
- `.env` 파일이 올바르게 설정되었는지 확인
- Cloudinary 인증 정보 확인
- 포트 충돌 시 다른 포트로 변경

### 2. 프론트엔드 이미지가 안 보임

**원인:** Next.js 이미지 최적화 설정

**해결방법:**
`frontend/next.config.ts` 확인:
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
    },
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
  ],
}
```

### 3. CORS 에러

**원인:** 백엔드와 프론트엔드 도메인 불일치

**해결방법:**
`backend/.env`:
```env
CORS_ORIGIN=http://your-actual-frontend-domain.com
```

### 4. 데이터베이스 연결 실패

**확인:**
```bash
# 백엔드 디렉토리에서
npx prisma studio
```

**해결:**
```bash
# 마이그레이션 재실행
npx prisma migrate reset
npx prisma migrate deploy
```

---

## 유지보수 명령어

### 로그 확인
```bash
# 백엔드 로그
pm2 logs backend

# 프론트엔드 로그
pm2 logs frontend

# 모든 로그
pm2 logs
```

### 서버 재시작
```bash
# 백엔드만
pm2 restart backend

# 프론트엔드만
pm2 restart frontend

# 모든 서버
pm2 restart all
```

### 서버 중지
```bash
pm2 stop backend
pm2 stop frontend
```

### 서버 삭제
```bash
pm2 delete backend
pm2 delete frontend
```

---

## 백업 권장사항

### 정기 백업
```bash
# 데이터베이스 백업
cp backend/prisma/dev.db backup/dev.db.$(date +%Y%m%d)

# 환경 변수 백업 (안전한 곳에 보관)
cp backend/.env backup/.env.backend
cp frontend/.env.local backup/.env.frontend
```

---

## 보안 권장사항

1. ✅ `.env` 파일 권한 설정
   ```bash
   chmod 600 backend/.env
   chmod 600 frontend/.env.local
   ```

2. ✅ 방화벽 설정으로 필요한 포트만 열기

3. ✅ 정기적인 의존성 업데이트
   ```bash
   npm audit fix
   ```

4. ✅ HTTPS 사용 (Let's Encrypt)
   ```bash
   sudo certbot --nginx
   ```

---

## 성공 확인 체크리스트

- [ ] 백엔드 서버가 정상 실행됨 (`http://서버주소:3001`)
- [ ] 프론트엔드 서버가 정상 실행됨 (`http://서버주소:3000`)
- [ ] 사진 업로드가 정상 작동함
- [ ] 갤러리에서 사진이 정상 표시됨
- [ ] 부서 필터가 정상 작동함
- [ ] PM2로 자동 재시작 설정됨

---

## 문의

문제 발생 시:
1. 로그 확인: `pm2 logs`
2. 서버 상태 확인: `pm2 status`
3. 포트 확인: `lsof -i :3000`, `lsof -i :3001`

---

**배포 성공을 기원합니다! 🚀**





