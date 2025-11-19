# ☁️ Cloudinary 설정 가이드

## 📸 사진 업로드 API 완료!

NestJS에 Cloudinary를 사용한 사진 업로드 API가 구현되었습니다.

### ✨ 주요 기능

- ✅ **Cloudinary 연동** - 자동 리사이징 및 WebP 변환
- ✅ **원본 이미지** - 최대 2000px로 자동 리사이징
- ✅ **썸네일 자동 생성** - 400px WebP 썸네일
- ✅ **파일 형식 검증** - jpg, png, heic, webp만 허용
- ✅ **파일 크기 제한** - 최대 10MB
- ✅ **EXIF 데이터 추출** - 촬영 날짜, 카메라 정보 등
- ✅ **멀티파트 폼** - 부서명, 제목, 설명과 함께 업로드

---

## 🚀 Cloudinary 계정 설정

### 1단계: 계정 생성

1. [Cloudinary](https://cloudinary.com/) 접속
2. **Sign Up** 클릭하여 무료 계정 생성
3. 이메일 인증 완료

### 2단계: API 키 확인

1. [Cloudinary Console](https://console.cloudinary.com/) 접속
2. 대시보드에서 다음 정보 확인:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 3단계: 환경 변수 설정

`backend/.env` 파일에 Cloudinary 정보 추가:

```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_api_secret_here
```

---

## 📡 API 엔드포인트

### 1. 사진 업로드

**POST** `/photos`

**Content-Type**: `multipart/form-data`

**요청 필드**:
- `file` (필수) - 이미지 파일
- `departmentName` (필수) - 부서명
- `title` (필수) - 제목
- `description` (필수) - 설명 (최대 100자)

**예시 (cURL)**:
```bash
curl -X POST http://localhost:3001/photos \
  -F "file=@/path/to/image.jpg" \
  -F "departmentName=디자인팀" \
  -F "title=신규 프로젝트 디자인" \
  -F "description=2024년 상반기 신규 프로젝트의 UI/UX 디자인 작업입니다."
```

**예시 (JavaScript)**:
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('departmentName', '디자인팀');
formData.append('title', '신규 프로젝트 디자인');
formData.append('description', '2024년 상반기 신규 프로젝트의 UI/UX 디자인 작업입니다.');

const response = await fetch('http://localhost:3001/photos', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
console.log(result);
```

**응답**:
```json
{
  "success": true,
  "message": "사진이 성공적으로 업로드되었습니다.",
  "data": {
    "id": "uuid",
    "departmentName": "디자인팀",
    "title": "신규 프로젝트 디자인",
    "description": "2024년 상반기 신규 프로젝트의 UI/UX 디자인 작업입니다.",
    "imageUrl": "https://res.cloudinary.com/...",
    "thumbnailUrl": "https://res.cloudinary.com/.../w_400...",
    "uploadDate": "2024-01-15T10:30:00.000Z",
    "likeCount": 0,
    "viewCount": 0,
    "isTopPick": false,
    "exifData": {
      "dateTaken": "2024-01-15T10:25:30.000Z",
      "camera": "Apple iPhone 14 Pro",
      "width": 4032,
      "height": 3024
    }
  }
}
```

### 2. 모든 사진 조회

**GET** `/photos?page=1&limit=20&departmentName=디자인팀`

**쿼리 파라미터**:
- `page` (선택) - 페이지 번호 (기본값: 1)
- `limit` (선택) - 페이지당 개수 (기본값: 20)
- `departmentName` (선택) - 부서별 필터링

**응답**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "신규 프로젝트 디자인",
      "imageUrl": "https://...",
      "department": {
        "name": "디자인팀",
        "color": "#F59E0B"
      },
      "comments": [],
      "likeCount": 15,
      "viewCount": 120
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

### 3. 특정 사진 조회

**GET** `/photos/:id`

### 4. 사진 정보 수정

**PATCH** `/photos/:id`

**Body**:
```json
{
  "title": "수정된 제목",
  "description": "수정된 설명"
}
```

### 5. 사진 삭제

**DELETE** `/photos/:id`

### 6. 좋아요 증가

**POST** `/photos/:id/like`

### 7. 관리자 추천 토글

**POST** `/photos/:id/top-pick`

---

## 🛡️ 파일 검증

### 허용되는 파일 형식
- `image/jpeg`
- `image/jpg`
- `image/png`
- `image/heic` (Apple HEIC)
- `image/webp`

### 파일 크기 제한
- **최대 10MB**

### 자동 처리
- **원본 이미지**: 최대 2000x2000px로 제한
- **썸네일**: 400x400px WebP 포맷으로 자동 생성
- **WebP 변환**: 자동으로 최적 포맷 제공 (fetch_format: auto)

---

## 📸 EXIF 데이터 추출

업로드된 이미지에서 자동으로 다음 정보를 추출합니다:

- **촬영 날짜** (`dateTaken`) - 사진의 실제 촬영 시간
- **카메라** (`camera`) - 제조사 및 모델명
- **렌즈** (`lens`) - 렌즈 모델
- **초점 거리** (`focalLength`)
- **조리개** (`aperture`)
- **ISO** (`iso`)
- **노출 시간** (`exposureTime`)
- **이미지 크기** (`width`, `height`)

EXIF 데이터가 있는 경우, `uploadDate`는 자동으로 촬영 날짜로 설정됩니다.

---

## 🎨 Cloudinary 변환 설정

### 원본 이미지
```javascript
{
  width: 2000,
  height: 2000,
  crop: 'limit',          // 원본 비율 유지, 최대 크기만 제한
  quality: 'auto:good',   // 자동 품질 최적화
  fetch_format: 'auto'    // WebP 자동 변환
}
```

### 썸네일
```javascript
{
  width: 400,
  height: 400,
  crop: 'limit',
  quality: 'auto:eco',    // 낮은 품질 (썸네일용)
  fetch_format: 'webp'    // 강제 WebP
}
```

---

## 🧪 테스트

### 1. Postman으로 테스트

1. **New Request** 생성
2. **Method**: POST
3. **URL**: `http://localhost:3001/photos`
4. **Body** 탭 선택
5. **form-data** 선택
6. 필드 추가:
   - `file` (File 타입) - 이미지 파일 선택
   - `departmentName` (Text) - "디자인팀"
   - `title` (Text) - "테스트 이미지"
   - `description` (Text) - "설명"
7. **Send** 클릭

### 2. cURL로 테스트

```bash
# 사진 업로드
curl -X POST http://localhost:3001/photos \
  -F "file=@./test-image.jpg" \
  -F "departmentName=개발팀" \
  -F "title=테스트 사진" \
  -F "description=개발팀 워크샵 사진입니다."

# 사진 목록 조회
curl http://localhost:3001/photos

# 특정 사진 조회
curl http://localhost:3001/photos/{photo-id}

# 좋아요
curl -X POST http://localhost:3001/photos/{photo-id}/like
```

### 3. 프론트엔드 예시 (React)

```jsx
import { useState } from 'react';

function PhotoUpload() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    departmentName: '',
    title: '',
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('file', file);
    data.append('departmentName', formData.departmentName);
    data.append('title', formData.title);
    data.append('description', formData.description);

    try {
      const response = await fetch('http://localhost:3001/photos', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();
      console.log('업로드 성공:', result);
    } catch (error) {
      console.error('업로드 실패:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <input
        type="text"
        placeholder="부서명"
        value={formData.departmentName}
        onChange={(e) =>
          setFormData({ ...formData, departmentName: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="제목"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <textarea
        placeholder="설명 (최대 100자)"
        maxLength={100}
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />
      <button type="submit">업로드</button>
    </form>
  );
}
```

---

## 📁 생성된 파일

```
backend/src/
├── cloudinary/
│   ├── cloudinary.module.ts      # Cloudinary 모듈
│   ├── cloudinary.provider.ts    # Cloudinary 설정
│   └── cloudinary.service.ts     # 업로드/삭제 서비스
├── photos/
│   ├── dto/
│   │   ├── create-photo.dto.ts   # 생성 DTO
│   │   └── update-photo.dto.ts   # 수정 DTO
│   ├── photos.controller.ts      # 컨트롤러
│   ├── photos.module.ts          # 모듈
│   └── photos.service.ts         # 비즈니스 로직
└── common/
    ├── pipes/
    │   └── file-validation.pipe.ts  # 파일 검증 파이프
    ├── filters/
    │   └── http-exception.filter.ts  # 에러 필터
    └── utils/
        └── exif-extractor.ts        # EXIF 추출 유틸
```

---

## 🔧 Cloudinary 대시보드

업로드된 이미지는 [Cloudinary Console](https://console.cloudinary.com/)에서 확인할 수 있습니다.

- **Media Library** - 업로드된 모든 이미지
- **Transformations** - 이미지 변환 내역
- **Usage** - 사용량 통계 (무료: 25 credits/월)

---

## 💡 팁

### 1. 개발 환경에서 로컬 파일 사용

개발 중에는 Cloudinary 대신 로컬 파일 시스템을 사용할 수도 있습니다.
프로덕션에서만 Cloudinary를 활성화하려면 환경 변수를 확인하세요.

### 2. 이미지 최적화

Cloudinary는 자동으로 다양한 최적화를 제공합니다:
- WebP 변환
- 품질 자동 조정
- 레이지 로딩 지원
- 반응형 이미지

### 3. 비용 관리

무료 플랜:
- **Storage**: 25GB
- **Bandwidth**: 25GB/월
- **Transformations**: 25,000/월

초과 시 유료 플랜으로 업그레이드하거나, 오래된 이미지를 삭제하세요.

---

## 📚 참고 문서

- [Cloudinary 공식 문서](https://cloudinary.com/documentation)
- [Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [Upload API](https://cloudinary.com/documentation/upload_images)

---

축하합니다! 사진 업로드 API가 완성되었습니다! 🎉

