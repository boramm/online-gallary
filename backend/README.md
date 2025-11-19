# 🎨 온라인 갤러리 Backend

NestJS 기반의 온라인 갤러리 백엔드 API

---

## 🚀 기술 스택

- **NestJS** - 프로그레시브 Node.js 프레임워크
- **TypeScript** - 타입 안정성
- **Prisma** - 차세대 ORM
- **PostgreSQL** - 관계형 데이터베이스
- **Cloudinary** - 이미지 저장 및 변환
- **Multer** - 파일 업로드
- **ExifReader** - EXIF 데이터 추출

---

## 📦 설치

```bash
npm install
```

---

## ⚙️ 환경 변수

`.env` 파일 생성:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/online_gallery?schema=public"

# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🗄️ 데이터베이스 설정

### 1. PostgreSQL 시작

```bash
# Docker Compose 사용
docker-compose up -d
```

### 2. Prisma 마이그레이션

```bash
# Prisma Client 생성
npm run prisma:generate

# 마이그레이션 실행
npm run prisma:migrate

# 시드 데이터 입력
npm run prisma:seed

# Prisma Studio (GUI) 실행
npm run prisma:studio
```

---

## 🏃 실행

```bash
# 개발 모드
npm run start:dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm run start:prod
```

서버는 `http://localhost:3001`에서 실행됩니다.

---

## 📡 API 엔드포인트

### Health Check

```
GET /health
```

### Photos

```
POST   /photos              # 사진 업로드
GET    /photos              # 사진 목록 조회 (페이지네이션)
GET    /photos/:id          # 사진 상세 조회
PATCH  /photos/:id          # 사진 정보 수정
DELETE /photos/:id          # 사진 삭제
POST   /photos/:id/like     # 좋아요 토글 (증가/감소)
```

**쿼리 파라미터 (GET /photos)**:
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 개수 (기본값: 10)
- `departmentName`: 부서명 필터
- `isTopPick`: 관리자 추천 필터 (true/false)

**사진 업로드 예시**:
```bash
POST http://localhost:3001/photos
Content-Type: multipart/form-data

{
  "file": <이미지 파일>,
  "departmentName": "디자인팀",
  "title": "겨울 풍경",
  "description": "아름다운 겨울 산의 모습"
}
```

**응답 예시**:
```json
{
  "id": "uuid",
  "departmentName": "디자인팀",
  "title": "겨울 풍경",
  "description": "아름다운 겨울 산의 모습",
  "imageUrl": "https://res.cloudinary.com/.../original.webp",
  "thumbnailUrl": "https://res.cloudinary.com/.../thumb.webp",
  "uploadDate": "2025-01-01T12:00:00.000Z",
  "likeCount": 0,
  "viewCount": 0,
  "isTopPick": false
}
```

### Comments

```
POST   /comments                      # 댓글 생성
GET    /comments/photo/:photoId       # 특정 사진의 댓글 조회
GET    /comments/:id                  # 특정 댓글 조회
PATCH  /comments/:id                  # 댓글 수정
DELETE /comments/:id                  # 댓글 삭제
GET    /comments/photo/:photoId/count # 댓글 수 조회
```

**댓글 생성 예시**:
```bash
POST http://localhost:3001/comments
Content-Type: application/json

{
  "photoId": "uuid",
  "nickname": "반짝이는 호랑이",
  "content": "정말 멋진 사진이네요!"
}
```

**응답 예시**:
```json
{
  "id": "uuid",
  "photoId": "uuid",
  "nickname": "반짝이는 호랑이",
  "content": "정말 멋진 사진이네요!",
  "createdAt": "2025-01-01T12:00:00.000Z"
}
```

**스팸 방지**:
- 같은 IP에서 1분 내 3개 이상 댓글 작성 시 에러
- 에러 메시지: "너무 많은 댓글을 작성하셨습니다. 1분 후에 다시 시도해주세요."

---

## 🔧 주요 기능

### 이미지 처리 (Cloudinary)

- **자동 리사이징**:
  - 원본: 최대 2000px
  - 썸네일: 400px
- **WebP 변환**: 자동 포맷 변환
- **최적화**: 화질 80%

### 파일 검증

- **허용 형식**: jpg, jpeg, png, heic, webp
- **파일 크기**: 최대 10MB
- **EXIF 데이터**: 촬영 날짜 자동 추출

### 스팸 방지

- **IP 추적**: 인메모리 Map
- **제한**: 1분 내 3개
- **자동 정리**: 1시간마다 오래된 데이터 삭제

---

## 📊 데이터베이스 모델

### Photo

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | 고유 ID |
| departmentName | String | 부서명 |
| title | String | 제목 |
| description | String | 설명 (최대 100자) |
| imageUrl | String | 이미지 URL |
| uploadDate | DateTime | 업로드 날짜 |
| likeCount | Int | 좋아요 수 |
| viewCount | Int | 조회수 |
| isTopPick | Boolean | 관리자 추천 여부 |

### Comment

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | 고유 ID |
| photoId | UUID | 사진 ID (FK) |
| nickname | String | 닉네임 (최대 50자) |
| content | String | 내용 (최대 200자) |
| createdAt | DateTime | 작성일 |

### Department

| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | 고유 ID |
| name | String | 부서명 (고유) |
| color | String | 대표 색상 |

---

## 🧪 테스트

```bash
# 단위 테스트
npm run test

# e2e 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov
```

---

## 📝 스크립트

```bash
# Prisma
npm run prisma:generate    # Client 생성
npm run prisma:migrate     # 마이그레이션 실행
npm run prisma:seed        # 시드 데이터 입력
npm run prisma:studio      # Prisma Studio 실행

# 개발
npm run start:dev          # 개발 모드 (hot-reload)
npm run start:debug        # 디버그 모드

# 빌드
npm run build              # 프로덕션 빌드
npm run start:prod         # 프로덕션 실행
```

---

## 🎯 다음 단계

- [x] 좋아요 API 구현
- [x] 댓글 CRUD API 구현
- [x] 스팸 방지 기능
- [ ] 사진 검색 기능
- [ ] 댓글 신고 기능
- [ ] 사진 신고 기능
- [ ] 관리자 페이지 API

---

## 📄 라이선스

MIT License

---

## 👨‍💻 개발자

온라인 갤러리 프로젝트
