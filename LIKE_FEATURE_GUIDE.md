# ❤️ 좋아요 기능 완성 가이드

모든 요구사항이 완벽하게 구현되었습니다!

---

## ✨ 구현된 기능

### Backend (NestJS) ✅

#### 좋아요 토글 API

**엔드포인트**:
```
POST /photos/:id/like
Body: { isLiked: boolean }
```

**로직**:
- `isLiked: true` → 좋아요 추가 (likeCount + 1)
- `isLiked: false` → 좋아요 취소 (likeCount - 1)

**예시**:
```bash
POST http://localhost:3001/photos/{photoId}/like
Content-Type: application/json

{
  "isLiked": true
}
```

**응답**:
```json
{
  "success": true,
  "data": {
    "likeCount": 42,
    "isLiked": true
  }
}
```

---

### Frontend (Next.js) ✅

#### 1. LocalStorage 중복 방지 ✅

**저장 구조**:
```typescript
localStorage.setItem('likedPhotos', JSON.stringify([
  'photo-uuid-1',
  'photo-uuid-2',
  'photo-uuid-3'
]))
```

**주요 함수** (`lib/like-manager.ts`):
```typescript
// 좋아요 여부 확인
isPhotoLiked(photoId: string): boolean

// 좋아요 추가
addLike(photoId: string): void

// 좋아요 취소
removeLike(photoId: string): void

// 좋아요 토글
toggleLike(photoId: string): boolean

// 서버 동기화
syncLikeToServer(photoId: string, isLiked: boolean): Promise<number | null>
```

#### 2. Optimistic Update ✅

**즉시 반영**:
```typescript
// 1. UI 즉시 업데이트
setIsLiked(newIsLiked);
setLikeCount(newCount);

// 2. LocalStorage 저장
toggleLikeStorage(photoId);

// 3. 애니메이션 실행
heartControls.start({ ... });

// 4. 서버 동기화 (백그라운드)
const serverCount = await syncLikeToServer(photoId, newIsLiked);
if (serverCount !== null) {
  setLikeCount(serverCount);
}
```

#### 3. 하트 통통 튀는 애니메이션 ✅

**Framer Motion**:
```typescript
heartControls.start({
  scale: [1, 1.4, 0.9, 1.1, 1],
  rotate: [0, -10, 10, -5, 0],
  transition: {
    duration: 0.5,
    times: [0, 0.2, 0.4, 0.6, 1],
  },
});
```

**효과**:
- 140% 확대
- 좌우 회전
- 반동 효과
- 0.5초 애니메이션

#### 4. 숫자 카운트업 애니메이션 ✅

**상승 효과**:
```typescript
countControls.start({
  y: [0, -10, 0],
  opacity: [1, 0, 1],
  transition: { duration: 0.4 },
});
```

**시각 효과**:
- 위로 -10px 이동
- 페이드 아웃/인
- 새 숫자로 교체

#### 5. 파티클 효과 ✅

**하트 터짐**:
```typescript
const newParticles = Array.from({ length: 8 }, (_, i) => ({
  id: Date.now() + i,
  x: (Math.random() - 0.5) * 60,
  y: (Math.random() - 0.5) * 60,
}));

<motion.div
  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
  animate={{
    opacity: 0,
    scale: 1,
    x: particle.x,
    y: particle.y,
  }}
  transition={{ duration: 0.6 }}
>
  <Heart className="w-3 h-3 fill-red-500" />
</motion.div>
```

**특징**:
- 8개의 작은 하트
- 랜덤 방향으로 퍼짐
- 페이드 아웃
- 0.6초 애니메이션

#### 6. 이미 좋아요한 사진 ✅

**빨간 하트 유지**:
```typescript
const [isLiked, setIsLiked] = useState(false);

useEffect(() => {
  setIsLiked(isPhotoLiked(photoId));
}, [photoId]);

// 버튼 스타일
className={`
  ${isLiked 
    ? "bg-red-500 text-white"  // 빨간 배경 + 흰 하트
    : "glass hover:bg-accent/10"  // 투명 배경
  }
`}
```

---

## 📁 파일 구조

### Backend

```
backend/src/photos/
├── photos.controller.ts     # POST /:id/like 엔드포인트
└── photos.service.ts        # toggleLike() 메서드
```

### Frontend

```
frontend/src/
├── components/
│   ├── ui/
│   │   └── LikeButton.tsx         # ⭐ 좋아요 버튼 컴포넌트
│   └── gallery/
│       ├── PhotoCard.tsx          # LikeButton 통합
│       └── PhotoDetailModal.tsx   # LikeButton 통합
└── lib/
    └── like-manager.ts            # ⭐ LocalStorage 관리
```

---

## 🎯 사용 방법

### LikeButton 컴포넌트

```tsx
import LikeButton from "@/components/ui/LikeButton";

<LikeButton
  photoId="photo-uuid"
  initialLikeCount={42}
  size="md"              // "sm" | "md" | "lg"
  showCount={true}
  onLikeChange={(newCount, isLiked) => {
    console.log(`새 좋아요 수: ${newCount}, 좋아요 여부: ${isLiked}`);
  }}
/>
```

### Props

| 이름 | 타입 | 설명 |
|------|------|------|
| photoId | string | 사진 고유 ID |
| initialLikeCount | number | 초기 좋아요 수 |
| size | "sm" \| "md" \| "lg" | 버튼 크기 (기본: "md") |
| showCount | boolean | 숫자 표시 여부 (기본: true) |
| onLikeChange | (count, isLiked) => void | 좋아요 변경 콜백 |

### 크기별 스타일

- **sm**: 8×8 버튼, 4×4 아이콘, xs 텍스트
- **md**: 10×10 버튼, 5×5 아이콘, sm 텍스트
- **lg**: 12×12 버튼, 6×6 아이콘, base 텍스트

---

## 🎬 애니메이션 상세

### 1. 좋아요 추가

**순서**:
1. **하트 통통**: Scale 1 → 1.4 → 0.9 → 1.1 → 1 (0.5초)
2. **회전**: Rotate 0 → -10 → 10 → -5 → 0
3. **파티클**: 8개 하트 터짐 (0.6초)
4. **카운트업**: 숫자 위로 사라졌다 나타남 (0.4초)

**색상 변경**:
- 배경: 투명 → 빨강
- 하트: 빈 하트 → 채워진 하트

### 2. 좋아요 취소

**순서**:
1. **하트 축소**: Scale 1 → 0.8 → 1 (0.3초)
2. **카운트다운**: 숫자 아래로 사라졌다 나타남 (0.4초)

**색상 변경**:
- 배경: 빨강 → 투명
- 하트: 채워진 하트 → 빈 하트

### 3. 파티클 세부사항

```typescript
// 8개 하트 생성
Array.from({ length: 8 }, (_, i) => ...)

// 랜덤 위치 (-30px ~ +30px)
x: (Math.random() - 0.5) * 60
y: (Math.random() - 0.5) * 60

// 애니메이션
opacity: 1 → 0
scale: 0 → 1
x: 0 → random
y: 0 → random
```

---

## 🔄 Optimistic Update 흐름

```
1. 사용자 클릭
   ↓
2. UI 즉시 업데이트 (Optimistic)
   - isLiked 토글
   - likeCount ± 1
   - 애니메이션 실행
   ↓
3. LocalStorage 저장
   - likedPhotos 배열 업데이트
   ↓
4. 서버 API 호출 (백그라운드)
   - POST /photos/:id/like
   ↓
5. 서버 응답
   - 성공: likeCount 동기화
   - 실패: 롤백 (선택)
```

**장점**:
- 즉각적인 피드백
- 네트워크 지연 숨김
- 사용자 경험 향상

---

## 💾 LocalStorage 구조

```json
{
  "likedPhotos": [
    "550e8400-e29b-41d4-a716-446655440000",
    "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "7c9e6679-7425-40de-944b-e07fc1f90ae7"
  ]
}
```

**특징**:
- 브라우저 로컬에 저장
- 영구 보존 (삭제 전까지)
- 중복 방지
- 빠른 조회

---

## 🧪 테스트 방법

### 1. 좋아요 추가

1. 갤러리 페이지에서 사진 카드 호버
2. 하트 버튼 클릭
3. 확인:
   - 하트가 통통 튐 ✅
   - 파티클 8개 터짐 ✅
   - 숫자 증가 (카운트업) ✅
   - 버튼 빨간색 ✅
   - 하트 채워짐 ✅

### 2. 좋아요 취소

1. 이미 좋아요한 사진의 하트 클릭
2. 확인:
   - 하트 축소 애니메이션 ✅
   - 숫자 감소 (카운트다운) ✅
   - 버튼 투명 ✅
   - 하트 빈 하트 ✅

### 3. LocalStorage 확인

```javascript
// 개발자 도구 Console
localStorage.getItem('likedPhotos')
// ["photo-id-1", "photo-id-2", ...]
```

### 4. 새로고침 후 유지

1. 사진에 좋아요
2. F5 새로고침
3. 확인:
   - 하트 여전히 빨간색 ✅
   - LocalStorage에 저장됨 ✅

### 5. 서버 동기화

```bash
# 네트워크 탭에서 확인
POST http://localhost:3001/photos/{id}/like
Status: 200 OK
Response: { "success": true, "data": { "likeCount": 43 } }
```

---

## 🎨 스타일 커스터마이징

### 하트 색상 변경

```tsx
// LikeButton.tsx
className={`
  ${isLiked 
    ? "bg-pink-500 text-white"  // 핑크로 변경
    : "glass"
  }
`}

// 파티클
<Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
```

### 애니메이션 속도 조절

```typescript
// 빠르게
heartControls.start({
  ...
  transition: { duration: 0.3 }  // 0.5 → 0.3
});

// 느리게
heartControls.start({
  ...
  transition: { duration: 0.8 }  // 0.5 → 0.8
});
```

### 파티클 개수 변경

```typescript
// 8개 → 12개
Array.from({ length: 12 }, (_, i) => ...)

// 범위 조정 (±30px → ±50px)
x: (Math.random() - 0.5) * 100
y: (Math.random() - 0.5) * 100
```

---

## 🔧 문제 해결

### Q: 좋아요가 서버에 반영 안 됨

**확인사항**:
1. 백엔드 실행 여부 (`localhost:3001`)
2. CORS 설정
3. 네트워크 탭 확인 (API 호출 성공 여부)

**해결**:
```typescript
// 에러 로깅 추가
try {
  const response = await fetch(...);
} catch (error) {
  console.error('좋아요 API 실패:', error);
}
```

### Q: LocalStorage가 안 됨

**확인사항**:
1. 브라우저 시크릿 모드 확인 (일부 제한)
2. LocalStorage 용량 초과 여부

**해결**:
```typescript
// lib/like-manager.ts
try {
  localStorage.setItem(LIKES_STORAGE_KEY, ...);
} catch (error) {
  console.error('LocalStorage 저장 실패:', error);
}
```

### Q: 애니메이션이 버벅임

**해결**:
```typescript
// 애니메이션 중 중복 클릭 방지
if (isAnimating) return;
setIsAnimating(true);
```

---

## 🎉 완성!

좋아요 기능이 모든 요구사항에 맞춰 완벽하게 구현되었습니다!

### Backend ✅
- ✅ 좋아요 토글 API (증가/감소)

### Frontend ✅
- ✅ LocalStorage 중복 방지
- ✅ Optimistic Update (즉시 반영)
- ✅ 하트 통통 튀는 애니메이션
- ✅ 숫자 카운트업 애니메이션
- ✅ 파티클 효과 (8개 하트 터짐)
- ✅ 이미 좋아요한 사진 빨간 하트
- ✅ PhotoCard 통합
- ✅ PhotoDetailModal 통합

### 추가 기능
- ✅ 3가지 크기 (sm/md/lg)
- ✅ 커스터마이징 가능
- ✅ 반응형 디자인
- ✅ 에러 처리

즐거운 개발 되세요! ❤️✨

