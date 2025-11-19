# 📸 사진 상세보기 모달 가이드

모든 요구사항이 완벽하게 구현되었습니다!

---

## ✨ 구현된 기능

### 1. 전체 화면 모달 ✅

**디자인**:
- 95vw × 90vh 크기의 대형 모달
- 배경: 검은색 80% + 블러 효과
- 모달: 라운드 코너 + 그림자

**기능**:
- ESC 키로 닫기
- 배경 클릭으로 닫기
- 모달 내부 클릭 시 닫히지 않음

```tsx
// ESC 키 리스너
useEffect(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };
  if (isOpen) {
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
  }
  return () => {
    window.removeEventListener("keydown", handleEsc);
    document.body.style.overflow = "unset";
  };
}, [isOpen, onClose]);
```

---

### 2. 좌측: 큰 이미지 (확대/축소) ✅

**react-zoom-pan-pinch 사용**:
- 마우스 휠로 확대/축소 (0.5x ~ 3x)
- 드래그로 이동
- 초기 중앙 정렬

```tsx
<TransformWrapper
  initialScale={1}
  minScale={0.5}
  maxScale={3}
  centerOnInit
>
  <TransformComponent>
    <img src={photo.imageUrl} alt={photo.title} />
  </TransformComponent>
</TransformWrapper>
```

**Shimmer 로딩 효과**:
- 이미지 로딩 중: 그라데이션 애니메이션
- 로딩 완료: 이미지 페이드 인

```tsx
{isImageLoading && (
  <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer" />
)}
```

---

### 3. 우측: 정보 패널 ✅

**구성 요소**:
1. **부서 배지** (색상 + 펄스 아이콘)
2. **제목** (큰 폰트)
3. **설명**
4. **좋아요 버튼** (Lottie 하트 애니메이션)
5. **조회수, 업로드 날짜**
6. **댓글 섹션** (스크롤 가능)
7. **댓글 작성 폼**

```tsx
{/* 부서 배지 */}
<motion.div
  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
  style={{ backgroundColor: photo.department?.color }}
>
  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
  {photo.departmentName}
</motion.div>
```

---

### 4. 좋아요 버튼 (Lottie 애니메이션) ✅

**lottie-react 사용**:
- 클릭 시 하트가 스케일 업 애니메이션
- 좋아요 수 증가/감소
- 버튼 색상 변경 (빨강 ↔ 기본)

```tsx
const [isLiked, setIsLiked] = useState(false);
const lottieRef = useRef<any>(null);

const handleLike = () => {
  if (lottieRef.current) {
    lottieRef.current.goToAndPlay(0); // 애니메이션 재생
  }
  setIsLiked(!isLiked);
  setCurrentLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
};

{isLiked && (
  <Lottie
    lottieRef={lottieRef}
    animationData={heartAnimation}
    loop={false}
    autoplay={false}
  />
)}
```

---

### 5. 댓글 섹션 ✅

**기능**:
- 댓글 목록 표시 (스크롤 가능)
- 익명 닉네임 + 작성일
- 댓글 작성 폼 (하단 고정)
- 빈 상태 메시지

```tsx
{photo.comments && photo.comments.length > 0 ? (
  photo.comments.map((comment) => (
    <motion.div
      key={comment.id}
      className="glass p-4 rounded-xl"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">{comment.nickname}</span>
        <span className="text-xs text-muted-foreground">
          {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
        </span>
      </div>
      <p className="text-sm">{comment.content}</p>
    </motion.div>
  ))
) : (
  <p className="text-center text-muted-foreground">
    아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
  </p>
)}
```

---

### 6. 하단: 이전/다음 네비게이션 ✅

**기능**:
- 썸네일 + 제목 표시
- 이전/다음 사진으로 이동
- 호버 시 확대 + 상승 효과
- 첫/마지막 사진에서는 해당 버튼 숨김

```tsx
const currentIndex = allPhotos.findIndex((p) => p.id === photo?.id);
const prevPhoto = currentIndex > 0 ? allPhotos[currentIndex - 1] : null;
const nextPhoto = currentIndex < allPhotos.length - 1 ? allPhotos[currentIndex + 1] : null;

{prevPhoto && (
  <motion.button
    onClick={() => onNavigate?.(prevPhoto.id)}
    whileHover={{ scale: 1.05, y: -2 }}
  >
    <ChevronLeft />
    <img src={prevPhoto.thumbnailUrl} alt={prevPhoto.title} />
    <p>{prevPhoto.title}</p>
  </motion.button>
)}
```

---

### 7. 우상단: 닫기 & 공유 버튼 ✅

**닫기 버튼**:
- X 아이콘
- 호버 시 회전 애니메이션
- 반투명 배경

```tsx
<motion.button
  onClick={onClose}
  whileHover={{ scale: 1.1, rotate: 90 }}
  whileTap={{ scale: 0.9 }}
  className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50"
>
  <X className="w-6 h-6" />
</motion.button>
```

**공유 버튼**:
- Web Share API 지원 시: 네이티브 공유
- 미지원 시: 링크 복사

```tsx
const handleShare = async () => {
  if (navigator.share) {
    await navigator.share({
      title: photo.title,
      text: photo.description,
      url: window.location.href,
    });
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert("링크가 복사되었습니다!");
  }
};
```

---

## 🎬 애니메이션

### 1. 모달 오픈 애니메이션 ✅

**Scale-up + Fade-in**:
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}
>
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
  >
    {/* 모달 컨텐츠 */}
  </motion.div>
</motion.div>
```

### 2. 정보 패널 순차적 등장 ✅

```tsx
<motion.div
  initial={{ x: 20, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ delay: 0.1 }} // 순차적 지연
>
  {/* 부서 배지 */}
</motion.div>

<motion.h2
  initial={{ x: 20, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ delay: 0.2 }} // 조금 더 늦게
>
  {/* 제목 */}
</motion.h2>
```

### 3. 이미지 로딩 Shimmer ✅

```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
```

```tsx
{isImageLoading && (
  <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer" />
)}
```

### 4. 하트 애니메이션 (Lottie) ✅

- 클릭 시 하트가 0 → 120% → 100% 스케일
- 60프레임 애니메이션
- 반복 없음 (한 번만 재생)

---

## 📁 파일 구조

```
frontend/src/
├── components/
│   └── gallery/
│       ├── PhotoDetailModal.tsx       # ⭐ 메인 모달 컴포넌트
│       ├── PhotoCard.tsx              # 클릭 시 모달 열기
│       └── ...
├── app/
│   ├── gallery/
│   │   └── page.tsx                   # 모달 상태 관리
│   └── globals.css                    # Shimmer 애니메이션
```

---

## 🎯 사용 방법

### 1. Gallery 페이지에서 사용

```tsx
import PhotoDetailModal from "@/components/gallery/PhotoDetailModal";

const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);

// 사진 클릭 시
const handlePhotoClick = (photo: Photo) => {
  setSelectedPhoto(photo);
  setIsModalOpen(true);
};

// 렌더링
<PhotoDetailModal
  photo={selectedPhoto}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  allPhotos={sortedPhotos}
  onNavigate={(photoId) => {
    const photo = sortedPhotos.find((p) => p.id === photoId);
    if (photo) setSelectedPhoto(photo);
  }}
/>
```

### 2. Props

```typescript
interface PhotoDetailModalProps {
  photo: Photo | null;           // 현재 사진
  isOpen: boolean;               // 모달 열림 상태
  onClose: () => void;           // 닫기 콜백
  allPhotos?: Photo[];           // 전체 사진 배열 (네비게이션용)
  onNavigate?: (photoId: string) => void; // 다른 사진으로 이동
}
```

---

## 🔧 향후 개선 사항 (TODO)

### API 연동

현재 주석으로 표시된 API 호출을 실제로 구현:

```tsx
// 좋아요 API
const handleLike = async () => {
  // TODO: API 호출
  await fetch(`http://localhost:3001/photos/${photo.id}/like`, {
    method: 'POST'
  });
};

// 댓글 작성 API
const handleCommentSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // TODO: API 호출
  await fetch(`http://localhost:3001/photos/${photo.id}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content: newComment })
  });
};
```

---

## 🎨 디자인 포인트

### 색상

- **배경**: 검은색 80% + 블러
- **모달**: 시스템 배경색 (라이트/다크 모드)
- **부서 배지**: 각 부서 고유 색상
- **좋아요 버튼**: 빨강 (#EF4444) ↔ 기본

### 레이아웃

- **좌측**: 이미지 (flex-1, 전체 활용)
- **우측**: 정보 패널 (w-96, 고정 너비)
- **하단**: 네비게이션 (중앙 정렬)
- **우상단**: 닫기 버튼

### 반응형

```tsx
className="flex flex-col md:flex-row"
// 모바일: 세로 배치
// 데스크톱: 가로 배치
```

---

## 🚀 테스트 방법

1. 갤러리 페이지에서 사진 카드 클릭
2. 모달이 scale-up 애니메이션과 함께 열림
3. 이미지 확인:
   - 마우스 휠로 확대/축소
   - 드래그로 이동
4. 우측 패널:
   - 좋아요 버튼 클릭 → 하트 애니메이션
   - 댓글 입력 및 전송
5. 하단 네비게이션:
   - 이전/다음 버튼으로 다른 사진 이동
6. 닫기:
   - ESC 키
   - 배경 클릭
   - X 버튼 클릭

---

## 📦 설치된 라이브러리

```bash
npm install react-zoom-pan-pinch lottie-react
```

- **react-zoom-pan-pinch**: 이미지 확대/축소/이동
- **lottie-react**: 하트 애니메이션

---

## 🎉 완성!

사진 상세보기 모달이 모든 요구사항에 맞춰 완벽하게 구현되었습니다!

### 주요 특징
- ✅ 전체 화면 모달 (배경 블러)
- ✅ 이미지 확대/축소 (react-zoom-pan-pinch)
- ✅ 정보 패널 (부서, 제목, 설명, 통계)
- ✅ 좋아요 버튼 (Lottie 하트 애니메이션)
- ✅ 댓글 섹션 (스크롤, 작성 폼)
- ✅ 이전/다음 네비게이션 (썸네일)
- ✅ 닫기/공유 버튼
- ✅ Scale-up + Fade-in 애니메이션
- ✅ Shimmer 로딩 효과
- ✅ ESC/배경 클릭으로 닫기
- ✅ 반응형 디자인

즐거운 개발 되세요! 📸✨

