# 🖼️ 갤러리 메인 페이지 완성!

## ✨ 구현된 기능

모든 요구사항이 완벽하게 구현되었습니다!

### 1. 히어로 섹션 ✅
- **타이틀**: "시선이 있는날"
- **서브카피 애니메이션**: 3개 문구 순환 표시
- **그라데이션 배경**: 하늘색 → 보라색 → 핑크색
- **스크롤 인디케이터**: 부드러운 애니메이션

### 2. TOP 3 배너 ✅
- **가로 슬라이드**: 좌우 버튼으로 이동
- **메달 배지**: 🥇 금 / 🥈 은 / 🥉 동
- **좋아요/조회수 표시**: 아이콘 + 숫자
- **부서 정보**: 각 사진의 부서 표시
- **그라데이션 오버레이**: 정보 가독성 향상

### 3. 필터 & 정렬 바 ✅
- **Sticky 헤더**: 스크롤 시 상단 고정
- **부서 필터**: 컬러풀한 태그 버튼
  - 전체, 기획팀, 디자인팀, 개발팀, 마케팅팀, 인사팀, 영업팀
  - 각 부서별 색상 표시
- **정렬**: 최신순/인기순/조회순 토글 스위치
- **검색창**: 제목/설명 실시간 검색
- **활성 필터 표시**: 현재 적용된 필터 표시

### 4. 사진 그리드 ✅
- **Masonry 레이아웃**: react-masonry-css 사용
- **반응형**: 1열/2열/3열 자동 조정
- **무한 스크롤**: react-infinite-scroll-component
- **Lazy Loading**: 이미지 지연 로딩
- **Skeleton Loader**: shimmer 애니메이션

### 5. 카드 디자인 ✅
- **호버 효과**:
  - 확대 (translateY: -8px)
  - 그림자 증가
  - 오버레이 나타남
- **오버레이 정보**:
  - 부서명 (색상 배지)
  - 제목
  - 설명
  - 좋아요/댓글/조회수
- **부서별 색상 테두리**: 각 부서 고유 색상
- **글로우 효과**: 호버 시 부서 색상 글로우

### 6. 전체 디자인 ✅
- **그라데이션 배경**: 하늘색 → 보라색 → 핑크색
- **Glassmorphism**: 모든 UI 요소
- **다크모드 지원**: 자동 테마 전환
- **부드러운 애니메이션**: Framer Motion

---

## 📁 생성된 파일

```
frontend/src/
├── app/
│   └── gallery/
│       └── page.tsx              # 메인 갤러리 페이지 ⭐
│
└── components/
    └── gallery/
        ├── HeroSection.tsx       # 히어로 섹션 ⭐
        ├── TopThreeBanner.tsx    # TOP 3 배너 ⭐
        ├── FilterBar.tsx         # 필터 & 정렬 바 ⭐
        └── PhotoCard.tsx         # 사진 카드 ⭐

문서/
└── GALLERY_PAGE_GUIDE.md         # 이 가이드
```

---

## 🚀 사용 방법

### 1. 개발 서버 실행

```bash
# 프론트엔드
cd frontend
npm run dev

# 백엔드
cd backend
npm run start:dev

# PostgreSQL
docker-compose up -d
```

### 2. 페이지 접속

http://localhost:3000/gallery

---

## 🎨 주요 컴포넌트

### HeroSection

```tsx
<HeroSection />
```

**기능**:
- 타이틀 "시선이 있는날" 표시
- 3개 서브카피 순환 애니메이션
- 그라데이션 배경 + 장식 요소
- 스크롤 인디케이터

### TopThreeBanner

```tsx
<TopThreeBanner photos={topPhotos} />
```

**Props**:
- `photos`: TOP 3 사진 배열

**기능**:
- 가로 슬라이드 (좌우 버튼)
- 금/은/동 메달 배지
- 좋아요/조회수 표시
- 인디케이터 (현재 슬라이드)

### FilterBar

```tsx
<FilterBar
  selectedDepartment={selectedDepartment}
  onDepartmentChange={setSelectedDepartment}
  sortBy={sortBy}
  onSortChange={setSortBy}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
/>
```

**기능**:
- Sticky 헤더 (top: 20px)
- 부서 필터 버튼 (7개)
- 정렬 토글 (최신순/인기순/조회순)
- 검색창 (실시간)
- 활성 필터 표시

### PhotoCard

```tsx
<PhotoCard photo={photo} onClick={handleClick} />
```

**Props**:
- `photo`: 사진 정보
- `onClick`: 클릭 핸들러

**기능**:
- 이미지 표시 + lazy loading
- Skeleton loader
- 호버 오버레이
- 부서 색상 테두리/글로우
- 통계 정보

---

## 🎯 API 연동

### 초기 데이터 로드

```typescript
const loadInitialData = async () => {
  // TOP 3 로드
  const topResponse = await fetch(
    "http://localhost:3001/photos?page=1&limit=3"
  );
  const topResult = await topResponse.json();
  setTopPhotos(topResult.data || []);

  // 일반 사진 로드
  await loadPhotos(1, true);
};
```

### 필터링 & 페이지네이션

```typescript
const loadPhotos = async (pageNum: number, reset = false) => {
  const params = new URLSearchParams({
    page: pageNum.toString(),
    limit: "12",
  });

  if (selectedDepartment !== "전체") {
    params.append("departmentName", selectedDepartment);
  }

  const response = await fetch(
    `http://localhost:3001/photos?${params.toString()}`
  );
  const result = await response.json();
  
  if (reset) {
    setPhotos(result.data);
  } else {
    setPhotos((prev) => [...prev, ...result.data]);
  }
};
```

### 무한 스크롤

```tsx
<InfiniteScroll
  dataLength={sortedPhotos.length}
  next={loadMore}
  hasMore={hasMore && !searchQuery}
  loader={<LoadingSpinner />}
  endMessage={<EndMessage />}
>
  <Masonry ...>
    {/* 카드들 */}
  </Masonry>
</InfiniteScroll>
```

---

## 🎨 Masonry 레이아웃

```typescript
const breakpointColumns = {
  default: 3,  // 3열 (데스크톱)
  1100: 2,     // 2열 (태블릿)
  700: 1,      // 1열 (모바일)
};

<Masonry
  breakpointCols={breakpointColumns}
  className="flex -ml-4 w-auto"
  columnClassName="pl-4 bg-clip-padding"
>
  {sortedPhotos.map((photo) => (
    <div key={photo.id} className="mb-4">
      <PhotoCard photo={photo} />
    </div>
  ))}
</Masonry>
```

---

## 🎨 디자인 특징

### 그라데이션 배경

```tsx
<div className="fixed inset-0 bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 dark:from-sky-950 dark:via-purple-950 dark:to-pink-950 -z-10" />
```

- 라이트 모드: 하늘색 → 보라색 → 핑크색 (밝음)
- 다크 모드: 하늘색 → 보라색 → 핑크색 (어두움)

### 부서별 색상

```typescript
const DEPARTMENT_COLORS: Record<string, string> = {
  기획팀: "#1E40AF",   // Deep Blue
  디자인팀: "#F59E0B",  // Gold
  개발팀: "#10B981",   // Green
  마케팅팀: "#EF4444",  // Red
  인사팀: "#8B5CF6",   // Purple
  영업팀: "#3B82F6",   // Blue
};
```

### Glassmorphism

모든 UI 요소에 적용:
- 헤더
- 필터 바
- 버튼
- 카드

---

## 🔍 필터 & 검색 로직

### 부서 필터 (서버 사이드)

```typescript
if (selectedDepartment !== "전체") {
  params.append("departmentName", selectedDepartment);
}
```

### 검색 (클라이언트 사이드)

```typescript
const filteredPhotos = photos.filter((photo) => {
  if (!searchQuery) return true;
  const query = searchQuery.toLowerCase();
  return (
    photo.title.toLowerCase().includes(query) ||
    photo.description.toLowerCase().includes(query)
  );
});
```

### 정렬 (클라이언트 사이드)

```typescript
const sortedPhotos = [...filteredPhotos].sort((a, b) => {
  switch (sortBy) {
    case "popular":
      return b.likeCount - a.likeCount;
    case "views":
      return b.viewCount - a.viewCount;
    case "latest":
    default:
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
  }
});
```

---

## ⚡ 성능 최적화

### 1. Lazy Loading

```tsx
<img
  src={photo.thumbnailUrl || photo.imageUrl}
  alt={photo.title}
  loading="lazy"  // 브라우저 네이티브 lazy loading
  onLoad={() => setImageLoaded(true)}
/>
```

### 2. Skeleton Loader

```tsx
{!imageLoaded && (
  <div className="absolute inset-0 bg-muted animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
  </div>
)}
```

### 3. 무한 스크롤

- 한 번에 12개씩 로드
- 스크롤 이벤트 최적화
- 로딩 상태 표시

### 4. 썸네일 사용

```typescript
src={photo.thumbnailUrl || photo.imageUrl}
```

Cloudinary에서 생성된 400px 썸네일 우선 사용

---

## 📱 반응형 디자인

### 브레이크포인트

- **모바일 (< 700px)**: 1열
- **태블릿 (700px - 1100px)**: 2열
- **데스크톱 (> 1100px)**: 3열

### 헤더

- 모바일: 아이콘만 표시
- 데스크톱: 텍스트 + 아이콘

---

## 🐛 문제 해결

### 이미지가 안 보임

1. 백엔드 실행 확인
2. CORS 설정 확인
3. 시드 데이터 입력 확인

```bash
cd backend
npm run prisma:seed
```

### 무한 스크롤이 작동 안 함

1. `hasMore` 상태 확인
2. API 응답 데이터 길이 확인
3. 브라우저 콘솔 에러 확인

### Masonry 레이아웃이 깨짐

1. `react-masonry-css` 설치 확인
2. CSS 클래스 확인
3. 브레이크포인트 설정 확인

---

## 🎉 완성!

모든 요구사항이 구현된 완벽한 갤러리 페이지입니다!

### 주요 특징

- ✅ 히어로 섹션 + 애니메이션
- ✅ TOP 3 배너 (슬라이드)
- ✅ 필터 & 정렬 (sticky)
- ✅ Masonry 레이아웃
- ✅ 무한 스크롤
- ✅ Lazy loading
- ✅ Skeleton loader
- ✅ 호버 효과
- ✅ 그라데이션 배경
- ✅ 다크모드
- ✅ 부서별 색상

### 다음 단계

- [ ] 사진 상세 모달
- [ ] 좋아요 버튼
- [ ] 댓글 시스템
- [ ] 공유 기능
- [ ] 필터 프리셋 저장

즐거운 개발 되세요! 🚀✨

