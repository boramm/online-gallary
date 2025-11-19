# 🧪 API 테스트 가이드

## 사진 업로드 API 테스트

### 준비 사항

1. **백엔드 실행**
```bash
cd backend
npm run start:dev
```

2. **Cloudinary 설정**
- `.env` 파일에 Cloudinary 자격 증명 추가
- [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) 참고

3. **데이터베이스 실행**
```bash
docker-compose up -d
```

---

## 📡 테스트 방법

### 1. cURL로 테스트

#### 사진 업로드
```bash
curl -X POST http://localhost:3001/photos \
  -F "file=@/path/to/your/image.jpg" \
  -F "departmentName=디자인팀" \
  -F "title=테스트 사진 제목" \
  -F "description=이것은 테스트 설명입니다. 최대 100자까지 가능합니다."
```

#### 사진 목록 조회
```bash
curl http://localhost:3001/photos
```

#### 특정 사진 조회
```bash
curl http://localhost:3001/photos/{photo-id}
```

#### 부서별 필터링
```bash
curl "http://localhost:3001/photos?departmentName=디자인팀"
```

#### 페이지네이션
```bash
curl "http://localhost:3001/photos?page=1&limit=10"
```

#### 좋아요
```bash
curl -X POST http://localhost:3001/photos/{photo-id}/like
```

#### 관리자 추천 토글
```bash
curl -X POST http://localhost:3001/photos/{photo-id}/top-pick
```

#### 사진 정보 수정
```bash
curl -X PATCH http://localhost:3001/photos/{photo-id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "수정된 제목",
    "description": "수정된 설명"
  }'
```

#### 사진 삭제
```bash
curl -X DELETE http://localhost:3001/photos/{photo-id}
```

---

### 2. Postman으로 테스트

#### 사진 업로드

1. **New Request** 생성
2. **Method**: `POST`
3. **URL**: `http://localhost:3001/photos`
4. **Body** 탭 클릭
5. **form-data** 선택
6. 필드 추가:
   - Key: `file`, Type: **File** → 이미지 파일 선택
   - Key: `departmentName`, Type: **Text** → "디자인팀"
   - Key: `title`, Type: **Text** → "테스트 제목"
   - Key: `description`, Type: **Text** → "테스트 설명"
7. **Send** 클릭

#### 사진 목록 조회

1. **Method**: `GET`
2. **URL**: `http://localhost:3001/photos`
3. **Params** 탭에서 쿼리 파라미터 추가 (선택):
   - `page`: 1
   - `limit`: 20
   - `departmentName`: 디자인팀
4. **Send** 클릭

---

### 3. JavaScript/TypeScript로 테스트

```javascript
// 사진 업로드
async function uploadPhoto(file, data) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('departmentName', data.departmentName);
  formData.append('title', data.title);
  formData.append('description', data.description);

  const response = await fetch('http://localhost:3001/photos', {
    method: 'POST',
    body: formData,
  });

  return await response.json();
}

// 사진 목록 조회
async function getPhotos(page = 1, limit = 20, departmentName = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (departmentName) {
    params.append('departmentName', departmentName);
  }

  const response = await fetch(`http://localhost:3001/photos?${params}`);
  return await response.json();
}

// 특정 사진 조회
async function getPhoto(id) {
  const response = await fetch(`http://localhost:3001/photos/${id}`);
  return await response.json();
}

// 좋아요
async function likePhoto(id) {
  const response = await fetch(`http://localhost:3001/photos/${id}/like`, {
    method: 'POST',
  });
  return await response.json();
}

// 사진 수정
async function updatePhoto(id, data) {
  const response = await fetch(`http://localhost:3001/photos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

// 사진 삭제
async function deletePhoto(id) {
  const response = await fetch(`http://localhost:3001/photos/${id}`, {
    method: 'DELETE',
  });
  return await response.json();
}

// 사용 예시
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const result = await uploadPhoto(file, {
  departmentName: '디자인팀',
  title: '신규 프로젝트',
  description: '2024년 상반기 신규 프로젝트 디자인',
});

console.log(result);
```

---

## 📝 예상 응답

### 성공 응답 (업로드)

```json
{
  "success": true,
  "message": "사진이 성공적으로 업로드되었습니다.",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "departmentName": "디자인팀",
    "title": "테스트 사진 제목",
    "description": "이것은 테스트 설명입니다.",
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/gallery/abcd1234.jpg",
    "uploadDate": "2024-01-15T14:30:00.000Z",
    "likeCount": 0,
    "viewCount": 0,
    "isTopPick": false,
    "thumbnailUrl": "https://res.cloudinary.com/your-cloud/image/upload/w_400/gallery/abcd1234.webp",
    "exifData": {
      "dateTaken": "2024-01-15T10:25:30.000Z",
      "camera": "Apple iPhone 14 Pro",
      "width": 4032,
      "height": 3024,
      "iso": 400,
      "aperture": "f/1.78",
      "exposureTime": "1/120"
    }
  }
}
```

### 에러 응답 (파일 없음)

```json
{
  "statusCode": 400,
  "timestamp": "2024-01-15T14:30:00.000Z",
  "message": "파일이 필요합니다."
}
```

### 에러 응답 (파일 크기 초과)

```json
{
  "statusCode": 400,
  "timestamp": "2024-01-15T14:30:00.000Z",
  "message": "파일 크기는 10MB를 초과할 수 없습니다."
}
```

### 에러 응답 (허용되지 않는 형식)

```json
{
  "statusCode": 400,
  "timestamp": "2024-01-15T14:30:00.000Z",
  "message": "허용되지 않는 파일 형식입니다. 허용 형식: image/jpeg, image/jpg, image/png, image/heic, image/webp"
}
```

---

## ✅ 검증 체크리스트

### 업로드 테스트
- [ ] JPG 파일 업로드 성공
- [ ] PNG 파일 업로드 성공
- [ ] HEIC 파일 업로드 성공 (iPhone)
- [ ] WebP 파일 업로드 성공
- [ ] 10MB 이하 파일 성공
- [ ] 10MB 초과 파일 거부
- [ ] 허용되지 않는 형식 (PDF, GIF 등) 거부
- [ ] 부서명, 제목, 설명 필수 검증
- [ ] 설명 100자 제한 검증

### EXIF 데이터
- [ ] EXIF가 있는 사진: 촬영 날짜 자동 추출
- [ ] EXIF가 없는 사진: 현재 시간 사용
- [ ] 카메라 정보 추출 (있는 경우)
- [ ] 이미지 크기 추출

### Cloudinary
- [ ] 원본 이미지 2000px 제한 확인
- [ ] 썸네일 400px WebP 생성 확인
- [ ] Cloudinary 대시보드에서 이미지 확인

### API 기능
- [ ] 페이지네이션 동작
- [ ] 부서별 필터링 동작
- [ ] 좋아요 증가 동작
- [ ] 관리자 추천 토글 동작
- [ ] 조회수 자동 증가
- [ ] 사진 수정 동작
- [ ] 사진 삭제 동작

---

## 🐛 문제 해결

### "CLOUDINARY_CLOUD_NAME is not defined"

`.env` 파일에 Cloudinary 자격 증명을 추가하세요:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### "Failed to connect to database"

PostgreSQL 컨테이너가 실행 중인지 확인:
```bash
docker-compose ps
docker-compose up -d
```

### "Department not found"

먼저 시드 데이터를 입력하세요:
```bash
npm run prisma:seed
```

### CORS 에러

백엔드의 `.env` 파일에서 CORS 설정 확인:
```env
CORS_ORIGIN=http://localhost:3000
```

---

## 📚 관련 문서

- [CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md) - Cloudinary 상세 설정
- [DATABASE.md](./DATABASE.md) - 데이터베이스 가이드
- [README.md](./README.md) - 프로젝트 전체 문서

즐거운 테스트 되세요! 🎨✨

