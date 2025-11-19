# ✅ 사진 업로드 API 완료!

## 🎉 구현 완료

NestJS에서 Cloudinary를 사용한 완전한 사진 업로드 API가 구현되었습니다!

### 요구사항 체크리스트

- ✅ **Cloudinary 연동** - 자동 리사이징, WebP 변환
- ✅ **원본 이미지** - 최대 2000px 제한
- ✅ **썸네일 생성** - 400px WebP 자동 생성
- ✅ **파일 형식 검증** - jpg, png, heic, webp만 허용
- ✅ **파일 크기 제한** - 최대 10MB
- ✅ **EXIF 데이터 추출** - 촬영 날짜 자동 추출
- ✅ **멀티파트 처리** - 부서명, 제목, 설명과 함께 업로드

---

## 📦 설치된 패키지

```json
{
  "cloudinary": "^2.x",
  "multer": "^1.x",
  "exifreader": "^4.x",
  "streamifier": "^0.x",
  "class-validator": "^0.x",
  "class-transformer": "^0.x",
  "@nestjs/mapped-types": "^2.x"
}
```

---

## 📁 생성된 파일 구조

```
backend/src/
├── cloudinary/
│   ├── cloudinary.module.ts          # Cloudinary 모듈
│   ├── cloudinary.provider.ts        # Cloudinary 설정
│   └── cloudinary.service.ts         # 업로드/삭제 서비스
│
├── photos/
│   ├── dto/
│   │   ├── create-photo.dto.ts      # 생성 DTO (validation)
│   │   └── update-photo.dto.ts      # 수정 DTO
│   ├── photos.controller.ts         # REST API 컨트롤러
│   ├── photos.service.ts            # 비즈니스 로직
│   └── photos.module.ts             # Photos 모듈
│
└── common/
    ├── pipes/
    │   └── file-validation.pipe.ts  # 파일 검증 파이프
    ├── filters/
    │   └── http-exception.filter.ts # 에러 핸들링
    └── utils/
        └── exif-extractor.ts        # EXIF 추출 유틸
```

---

## 🔌 API 엔드포인트

### POST /photos - 사진 업로드
**Content-Type**: `multipart/form-data`

**필드**:
- `file` (File, 필수) - 이미지 파일
- `departmentName` (String, 필수) - 부서명
- `title` (String, 필수) - 제목
- `description` (String, 필수) - 설명 (최대 100자)

**응답**:
```json
{
  "success": true,
  "message": "사진이 성공적으로 업로드되었습니다.",
  "data": {
    "id": "uuid",
    "imageUrl": "https://res.cloudinary.com/...",
    "thumbnailUrl": "https://res.cloudinary.com/.../w_400...",
    "exifData": {
      "dateTaken": "2024-01-15T10:25:30.000Z",
      "camera": "Apple iPhone 14 Pro"
    }
  }
}
```

### GET /photos - 사진 목록 조회
**쿼리 파라미터**:
- `page` (Number, 선택) - 페이지 번호
- `limit` (Number, 선택) - 페이지당 개수
- `departmentName` (String, 선택) - 부서 필터링

### 기타 엔드포인트
- `GET /photos/:id` - 특정 사진 조회
- `PATCH /photos/:id` - 사진 정보 수정
- `DELETE /photos/:id` - 사진 삭제
- `POST /photos/:id/like` - 좋아요 증가
- `POST /photos/:id/top-pick` - 관리자 추천 토글

---

## ⚙️ 환경 변수 설정

`backend/.env` 파일:

```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/online_gallery"

# Server
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

---

## 🚀 시작하기

### 1. Cloudinary 계정 생성
[console.cloudinary.com](https://console.cloudinary.com/)에서 무료 계정 생성

### 2. 환경 변수 설정
`backend/.env` 파일에 Cloudinary 자격 증명 추가

### 3. 백엔드 실행
```bash
cd backend
npm run start:dev
```

### 4. 테스트
```bash
curl -X POST http://localhost:3001/photos \
  -F "file=@./test-image.jpg" \
  -F "departmentName=디자인팀" \
  -F "title=테스트 사진" \
  -F "description=테스트 설명입니다."
```

---

## 🎨 주요 기능 상세

### 1. Cloudinary 자동 처리

**원본 이미지**:
- 최대 2000x2000px로 자동 리사이징
- 품질: `auto:good`
- 포맷: 자동 WebP 변환 (`fetch_format: auto`)

**썸네일**:
- 400x400px 크기 제한
- 품질: `auto:eco` (최적화)
- 포맷: 강제 WebP

**코드**:
```typescript
transformation: [
  {
    width: 2000,
    height: 2000,
    crop: 'limit',
    quality: 'auto:good',
    fetch_format: 'auto',
  },
],
eager: [
  {
    width: 400,
    height: 400,
    crop: 'limit',
    quality: 'auto:eco',
    fetch_format: 'webp',
  },
],
```

### 2. 파일 검증

**허용 형식**:
- `image/jpeg`
- `image/jpg`
- `image/png`
- `image/heic`
- `image/webp`

**크기 제한**: 10MB

**코드**:
```typescript
@UploadedFile(new FileValidationPipe()) file: Express.Multer.File
```

### 3. EXIF 데이터 추출

자동으로 추출되는 정보:
- 촬영 날짜 (`DateTimeOriginal`)
- 카메라 제조사 및 모델
- 렌즈 정보
- 초점 거리, 조리개, ISO
- 노출 시간
- 이미지 크기

**주요 기능**:
- EXIF에서 촬영 날짜를 찾으면 자동으로 `uploadDate`에 설정
- EXIF가 없으면 현재 시간 사용
- 모든 EXIF 데이터는 응답에 포함

---

## 🧪 테스트 방법

### cURL
```bash
curl -X POST http://localhost:3001/photos \
  -F "file=@/path/to/image.jpg" \
  -F "departmentName=개발팀" \
  -F "title=팀 워크샵" \
  -F "description=2024년 상반기 팀 워크샵 사진입니다."
```

### Postman
1. POST `http://localhost:3001/photos`
2. Body → form-data
3. 필드 추가 (file, departmentName, title, description)

### JavaScript
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('departmentName', '디자인팀');
formData.append('title', '신규 프로젝트');
formData.append('description', '설명');

const response = await fetch('http://localhost:3001/photos', {
  method: 'POST',
  body: formData,
});
```

---

## 📚 관련 문서

1. **[CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)**
   - Cloudinary 상세 설정 가이드
   - API 엔드포인트 전체 설명
   - EXIF 추출 상세
   - 프론트엔드 예시 코드

2. **[API_TEST.md](./API_TEST.md)**
   - 모든 API 테스트 방법
   - cURL, Postman, JavaScript 예시
   - 에러 응답 예시
   - 검증 체크리스트

3. **[DATABASE.md](./DATABASE.md)**
   - 데이터베이스 구조
   - Prisma 사용법

4. **[SETUP.md](./SETUP.md)**
   - 전체 프로젝트 시작 가이드

---

## 🎯 다음 단계 추천

### 백엔드
- [ ] Comment CRUD API 구현
- [ ] Department API 구현
- [ ] 검색 기능 추가
- [ ] 정렬 옵션 추가 (인기순, 최신순 등)
- [ ] 인증/인가 시스템

### 프론트엔드
- [ ] 사진 업로드 폼 UI
- [ ] 갤러리 그리드 레이아웃
- [ ] 사진 상세 모달
- [ ] 무한 스크롤
- [ ] 이미지 레이지 로딩
- [ ] 드래그 앤 드롭 업로드

### 최적화
- [ ] 이미지 CDN 캐싱
- [ ] 썸네일 미리보기
- [ ] Progressive 이미지 로딩
- [ ] 업로드 진행률 표시

---

## ✨ 축하합니다!

완전한 기능의 사진 업로드 API가 구현되었습니다! 🎉

모든 요구사항이 충족되었으며, 프로덕션 수준의 코드 품질을 갖추고 있습니다:

- ✅ 타입 안정성 (TypeScript)
- ✅ 유효성 검증 (class-validator)
- ✅ 에러 핸들링
- ✅ 파일 검증
- ✅ EXIF 데이터 추출
- ✅ Cloudinary 자동 최적화
- ✅ REST API 베스트 프랙티스
- ✅ 페이지네이션
- ✅ 필터링

즐거운 개발 되세요! 🚀

