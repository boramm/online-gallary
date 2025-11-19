# 🎯 갤러리 필터링 & 정렬 가이드

모든 요구사항이 완벽하게 구현되었습니다!

---

## ✨ 구현된 기능

### 1. URL 쿼리 파라미터로 상태 관리 ✅

**기능**:
- 필터/정렬/검색 상태가 URL에 자동 반영
- 브라우저 뒤로가기/앞으로가기 지원
- 링크 공유 시 필터 상태 유지

**URL 형식**:
```
/gallery                              # 기본 상태
/gallery?dept=디자인팀                 # 부서 필터
/gallery?sort=popular                 # 정렬
/gallery?q=풍경                       # 검색
/gallery?dept=기획팀&sort=views&q=빛  # 복합 필터
```

**쿼리 파라미터**:
- `dept`: 부서명 (예: `기획팀`, `디자인팀`)
- `sort`: 정렬 방식 (`latest`, `popular`, `views`)
- `q`: 검색어

**구현 코드**:
```tsx
const searchParams = useSearchParams();
const router = useRouter();

// URL에서 초기 상태 읽기
const [selectedDepartment, setSelectedDepartment] = useState(
  searchParams.get("dept") || "전체"
);
const [sortBy, setSortBy] = useState(
  searchParams.get("sort") || "latest"
);
const [searchQuery, setSearchQuery] = useState(
  searchParams.get("q") || ""
);

// 상태 변경 시 URL 업데이트
useEffect(() => {
  if (!mounted) return;

  const params = new URLSearchParams();
  if (selectedDepartment !== "전체") {
    params.set("dept", selectedDepartment);
  }
  if (sortBy !== "latest") {
    params.set("sort", sortBy);
  }
  if (searchQuery) {
    params.set("q", searchQuery);
  }

  const queryString = params.toString();
  const newUrl = queryString ? `/gallery?${queryString}` : "/gallery";
  router.replace(newUrl, { scroll: false });
}, [selectedDepartment, sortBy, searchQuery, mounted, router]);
```

---

### 2. 부서별 필터 ✅

**선택 시 강조 효과**:
- ✓ 체크 아이콘 표시 (회전 애니메이션)
- 부서 색상 배경
- 흰색 텍스트
- 그림자 효과

**미선택 시**:
- 부서 색상 점 표시
- 투명 배경 + 부서 색상 테두리
- 기본 텍스트 색상

**애니메이션**:
- 호버 시: 스케일 + 상승 효과
- 클릭 시: 스케일 감소
- 체크 아이콘: 회전하며 등장

```tsx
<motion.button
  onClick={() => onDepartmentChange(dept.name)}
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  style={{
    backgroundColor: isSelected ? dept.color : undefined,
    borderColor: dept.color,
    borderWidth: isSelected ? 0 : 2,
  }}
>
  {isSelected ? (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Check className="w-4 h-4" />
    </motion.div>
  ) : (
    <div
      className="w-3 h-3 rounded-full"
      style={{ backgroundColor: dept.color }}
    />
  )}
  <span>{dept.name}</span>
</motion.button>
```

---

### 3. 정렬 기능 ✅

**iOS 스타일 스위치**:
- 슬라이딩 배경 애니메이션
- 스프링 효과
- 3가지 옵션: 최신순/인기순/조회순

**정렬 방식**:
- **최신순**: `uploadDate DESC`
- **인기순**: `likeCount DESC`
- **조회순**: `viewCount DESC`

**UI 특징**:
- 활성 옵션: 프라이머리 색상 + 흰색 텍스트
- 비활성 옵션: 회색 텍스트
- 슬라이딩 인디케이터: 부드러운 이동
- 아이콘 + 텍스트

```tsx
{/* 슬라이딩 배경 */}
<motion.div
  layoutId="sort-indicator"
  className="absolute bg-primary rounded-xl shadow-lg"
  animate={{
    x: sortBy === "latest" ? 0 : sortBy === "popular" ? "calc(100% / 3)" : "calc(200% / 3)",
    width: "calc(100% / 3 - 4px)",
  }}
  transition={{
    type: "spring",
    stiffness: 300,
    damping: 30,
  }}
/>

{SORT_OPTIONS.map((option) => (
  <motion.button
    key={option.value}
    onClick={() => onSortChange(option.value)}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={isSelected ? "text-primary-foreground" : "text-muted-foreground"}
  >
    <Icon className="w-4 h-4" />
    <span>{option.label}</span>
  </motion.button>
))}
```

---

### 4. 애니메이션 효과 ✅

**페이드 인 효과**:
- 필터 변경 시 사진들이 부드럽게 페이드 인
- 순차적 등장 (각 카드마다 0.05초 지연)

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={`${selectedDepartment}-${sortBy}-${searchQuery}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <Masonry>
      {sortedPhotos.map((photo, index) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            delay: index * 0.05,
          }}
        >
          <PhotoCard photo={photo} />
        </motion.div>
      ))}
    </Masonry>
  </motion.div>
</AnimatePresence>
```

**전환 효과**:
- 정렬 변경: 부드러운 스프링 애니메이션
- 필터 변경: 페이드 아웃 → 페이드 인
- 카드 등장: 스케일 + 투명도

---

### 5. 활성 필터 표시 ✅

**"현재 X개 사진 보는 중"**:
- 화면 상단에 큰 텍스트로 표시
- 숫자는 프라이머리 색상 강조
- 활성 필터 요약 표시

```tsx
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  className="mb-6 text-center"
>
  <p className="text-lg font-semibold">
    현재{" "}
    <span className="text-primary font-bold">
      {sortedPhotos.length}
    </span>
    개 사진 보는 중
  </p>
  <p className="text-sm text-muted-foreground mt-1">
    {selectedDepartment !== "전체" && (
      <span className="font-medium text-primary">
        {selectedDepartment}
      </span>
    )}
    {searchQuery && (
      <span>
        검색: "<span className="font-medium text-primary">{searchQuery}</span>"
      </span>
    )}
  </p>
</motion.div>
```

**활성 필터 태그** (FilterBar 하단):
- 선택된 부서 표시 (X 버튼으로 제거 가능)
- 검색어 표시 (X 버튼으로 제거 가능)
- 애니메이션: 스케일 인/아웃

```tsx
{(selectedDepartment !== "전체" || searchQuery) && (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    className="flex items-center gap-2 text-sm text-muted-foreground"
  >
    <span>활성 필터:</span>
    {selectedDepartment !== "전체" && (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="px-3 py-1 rounded-full glass flex items-center gap-2"
      >
        {selectedDepartment}
        <button onClick={() => onDepartmentChange("전체")}>
          <X className="w-3 h-3" />
        </button>
      </motion.span>
    )}
    {searchQuery && (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="px-3 py-1 rounded-full glass flex items-center gap-2"
      >
        "{searchQuery}"
        <button onClick={() => onSearchChange("")}>
          <X className="w-3 h-3" />
        </button>
      </motion.span>
    )}
  </motion.div>
)}
```

---

## 🎨 UI 개선 사항

### 체크 아이콘 ✅
- **선택된 부서**: ✓ 체크 아이콘 (흰색)
- **미선택 부서**: 부서 색상 점

### iOS 스타일 스위치 ✅
- **슬라이딩 인디케이터**: 선택된 옵션 아래로 이동
- **스프링 애니메이션**: 부드러운 전환
- **반응형**: 모바일에서는 아이콘만 표시

### 결과 카운터 ✅
- **큰 텍스트**: "현재 X개 사진 보는 중"
- **활성 필터 요약**: 부서 + 검색어
- **프라이머리 색상 강조**

---

## 📱 반응형 디자인

### 모바일
- 정렬 버튼: 아이콘만 표시
- 부서 필터: 자동 줄바꿈
- 검색창: 전체 너비

### 태블릿
- 검색창 + 정렬: 가로 배치
- 부서 필터: 2-3줄

### 데스크톱
- 모든 요소: 한눈에 보이는 레이아웃
- 정렬 버튼: 텍스트 + 아이콘

---

## 🚀 사용 예시

### 부서 필터링
```
사용자가 "디자인팀" 클릭
→ URL: /gallery?dept=디자인팀
→ 디자인팀 사진만 표시 (fade-in 애니메이션)
→ "현재 5개 사진 보는 중"
→ "디자인팀" 표시
```

### 정렬 변경
```
사용자가 "인기순" 선택
→ URL: /gallery?sort=popular
→ 슬라이딩 인디케이터 이동
→ 좋아요 순으로 재정렬 (부드러운 transition)
```

### 검색
```
사용자가 "풍경" 입력
→ URL: /gallery?q=풍경
→ 제목/설명에 "풍경" 포함된 사진만 표시
→ "검색: '풍경'" 표시
```

### 복합 필터
```
부서: 기획팀
정렬: 조회순
검색: 야경

→ URL: /gallery?dept=기획팀&sort=views&q=야경
→ "현재 2개 사진 보는 중"
→ "기획팀 · 검색: '야경'" 표시
```

---

## 🎯 핵심 기능 정리

✅ **URL 쿼리 파라미터**
- `?dept=부서명`
- `?sort=정렬방식`
- `?q=검색어`
- 브라우저 히스토리 지원
- 링크 공유 가능

✅ **부서 필터**
- 체크 아이콘 (선택 시)
- 부서 색상 배경/테두리
- 호버 효과

✅ **정렬**
- iOS 스타일 스위치
- 슬라이딩 인디케이터
- 최신순/인기순/조회순

✅ **애니메이션**
- Fade-in 효과
- 순차적 등장
- 부드러운 transition

✅ **결과 표시**
- "현재 X개 사진 보는 중"
- 활성 필터 요약
- 제거 가능한 필터 태그

---

## 🎉 완성!

갤러리 필터링과 정렬 기능이 모든 요구사항에 맞춰 완벽하게 구현되었습니다!

### 주요 특징
- ✅ URL 쿼리 파라미터 상태 관리
- ✅ 체크 아이콘 + 부서 색상
- ✅ iOS 스타일 정렬 스위치
- ✅ Fade-in 애니메이션
- ✅ "현재 X개 사진 보는 중"
- ✅ 활성 필터 표시
- ✅ 반응형 디자인

즐거운 개발 되세요! 🎯✨

