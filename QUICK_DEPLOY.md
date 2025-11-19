# ⚡ 빠른 배포 가이드

서버 관리자를 위한 간단한 배포 절차입니다.

---

## 1️⃣ 사전 준비 (5분)

### Cloudinary 계정 준비
1. https://cloudinary.com 접속
2. 무료 가입
3. Dashboard에서 확인:
   - Cloud Name
   - API Key  
   - API Secret

---

## 2️⃣ 서버에 파일 업로드

전체 프로젝트 폴더를 서버에 업로드:
```bash
scp -r online-gallery user@server:/home/user/
```

---

## 3️⃣ 백엔드 설정 (10분)

```bash
# 1. 백엔드 디렉토리로 이동
cd online-gallery/backend

# 2. 환경 변수 설정
cat > .env << EOF
DATABASE_URL="file:./prisma/dev.db"
CLOUDINARY_CLOUD_NAME=여기에_Cloud_Name_입력
CLOUDINARY_API_KEY=여기에_API_Key_입력
CLOUDINARY_API_SECRET=여기에_API_Secret_입력
PORT=3001
NODE_ENV=production
CORS_ORIGIN=http://서버주소:3000
EOF

# 3. 의존성 설치
npm install

# 4. 데이터베이스 설정
npx prisma migrate deploy
npx prisma db seed

# 5. 빌드 및 실행
npm run build
npm install -g pm2
pm2 start npm --name "backend" -- run start:prod
```

---

## 4️⃣ 프론트엔드 설정 (10분)

```bash
# 1. 프론트엔드 디렉토리로 이동
cd ../frontend

# 2. 환경 변수 설정
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://서버주소:3001
NEXT_PUBLIC_SITE_URL=http://서버주소:3000
EOF

# 3. 의존성 설치
npm install

# 4. 빌드 및 실행
npm run build
pm2 start npm --name "frontend" -- run start
```

---

## 5️⃣ 확인

### 서버 상태 확인
```bash
pm2 status
```

### 브라우저 확인
- 프론트엔드: `http://서버주소:3000`
- 백엔드 API: `http://서버주소:3001`

---

## 6️⃣ 자동 재시작 설정

```bash
pm2 startup
pm2 save
```

---

## 🚨 문제 해결

### 로그 확인
```bash
pm2 logs
```

### 서버 재시작
```bash
pm2 restart all
```

### 포트 충돌 확인
```bash
lsof -i :3000
lsof -i :3001
```

---

## ✅ 성공!

- ✅ `http://서버주소:3000` 접속 → 갤러리 페이지
- ✅ 사진 업로드 테스트
- ✅ 부서 필터 작동 확인

---

**더 자세한 내용은 `DEPLOYMENT_GUIDE.md` 참고**





