# 🎓 삼육대학교 AI 코딩 실습 환경 설정 정보

**계정명:** eboram  
**생성일:** 2025년 11월 07일

---

## 📌 기본 정보

### 🔐 계정 정보
- **Linux 계정명:** eboram
- **Linux 비밀번호:** lGRGaNtK
- **홈 디렉토리:** /home/eboram
- **작업 디렉토리:** /www/eboram

### 🌐 도메인 및 포트
- **도메인:** https://eboram.syu.my
- **백엔드 포트 (NestJS):** 3028
- **프론트엔드 포트 (Next.js):** 4028

### 🗄️ 데이터베이스 (MariaDB)
- **데이터베이스명:** eboram_db
- **DB 사용자명:** eboram
- **DB 비밀번호:** lGRGaNtK
- **호스트:** localhost

**접속 명령어:**
```bash
mariadb -u eboram -plGRGaNtK eboram_db
```

---

## 📁 프로젝트 구조

```
/www/eboram/
├── backend/          # NestJS 백엔드 프로젝트
│   ├── src/
│   ├── package.json
│   └── ...
├── frontend/         # Next.js 프론트엔드 프로젝트
│   ├── app/
│   ├── package.json
│   └── ...
└── SETUP_INFO.md     # 이 파일
```

---

## 🚀 프로젝트 시작 방법

### 백엔드 (NestJS) 시작

```bash
cd /www/eboram/backend

# 개발 모드로 실행
npm run start:dev
# 또는
yarn start:dev

# 포트 3028 에서 실행됩니다
```

### 프론트엔드 (Next.js) 시작

```bash
cd /www/eboram/frontend

# 개발 모드로 실행 (포트 지정)
npm run dev -- -p 4028
# 또는
yarn dev -p 4028

# 포트 4028 에서 실행됩니다
```

---

## 🔧 설치된 도구

### PM2 (프로세스 관리자)

PM2는 Node.js 애플리케이션을 백그라운드에서 실행하고 관리하는 도구입니다.

**사용 예시:**

```bash
# 백엔드 실행
cd /www/eboram/backend
pm2 start "npm run start:dev" --name "eboram-backend"

# 프론트엔드 실행
cd /www/eboram/frontend
pm2 start "npm run dev -- -p 4028" --name "eboram-frontend"

# 프로세스 목록 확인
pm2 list

# 로그 확인
pm2 logs eboram-backend
pm2 logs eboram-frontend

# 프로세스 중지
pm2 stop eboram-backend
pm2 stop eboram-frontend

# 프로세스 재시작
pm2 restart eboram-backend

# 프로세스 삭제
pm2 delete eboram-backend
```

### Yarn (패키지 관리자)

Yarn은 npm보다 빠른 패키지 관리자입니다.

**사용 예시:**

```bash
# 패키지 설치
yarn install
# 또는
yarn

# 패키지 추가
yarn add <package-name>

# 개발 의존성 추가
yarn add -D <package-name>

# 스크립트 실행
yarn dev
yarn build
yarn start
```

---

## 🌍 Nginx 프록시 설정

도메인 eboram.syu.my 은 다음과 같이 프록시 설정되어 있습니다:

- **/ (루트)** → 프론트엔드 (localhost:4028)
- **/api** → 백엔드 (localhost:3028)

백엔드 API를 호출할 때는 `/api` 경로를 사용하세요:
```javascript
// 예시: Next.js에서 API 호출
fetch('/api/endpoint')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 💡 유용한 명령어

### 포트 사용 확인
```bash
# 내 포트가 사용 중인지 확인
ss -tlnp | grep -E "3028|4028"

# 특정 포트 프로세스 종료
lsof -ti:3028 | xargs kill -9
lsof -ti:4028 | xargs kill -9
```

### 로그 확인
```bash
# Nginx 에러 로그
sudo tail -f /var/log/nginx/error.log

# Nginx 액세스 로그
sudo tail -f /var/log/nginx/access.log
```

### 파일 권한 확인
```bash
ls -la /www/eboram/
```

---

## 📚 참고 자료

- **NestJS 문서:** https://docs.nestjs.com/
- **Next.js 문서:** https://nextjs.org/docs
- **PM2 문서:** https://pm2.keymetrics.io/docs/
- **Yarn 문서:** https://yarnpkg.com/

---

## ⚠️ 주의사항

1. 이 파일은 root 소유권으로 보호되어 있어 삭제할 수 없습니다.
2. 포트 번호(3028, 4028)는 다른 사용자와 겹치지 않도록 배정되어 있습니다.
3. 실습이 끝나면 실행 중인 프로세스를 반드시 종료해주세요.
4. 데이터베이스 비밀번호는 안전하게 보관하세요.

---

**문의사항이 있으시면 관리자에게 연락하세요.**
