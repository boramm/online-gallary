# 🔥 실시간 HOT 3 배너 완성!

## ✨ 구현된 기능

모든 요구사항이 완벽하게 구현되었습니다!

### 주요 특징

#### 1. 배너 제목 ✅
- **메인**: "실시간 HOT 3" (그라데이션)
- **서브**: "지금 가장 인기있는 사진"
- **시간 표시**: "{현재시간} 기준 좋아요 순"
- **불꽃 아이콘**: 양쪽에 애니메이션 🔥

#### 2. Swiper 캐러슬 ✅
- **swiper.js** 사용
- **3D Coverflow 효과**
- **자동 슬라이드**: 5초 간격
- **무한 루프**
- **Grab cursor**: 드래그 가능

#### 3. 순위별 디자인 ✅

**TOP 1 (1위)**:
- 큰 사이즈 (600px/400px 높이)
- 🔥 불꽃 이모지
- 빛나는 효과 (펄스 애니메이션)
- 그라데이션: 빨강 → 오렌지 → 노랑
- 외부 글로우 애니메이션

**TOP 2 (2위)**:
- 중간 사이즈 (500px/350px 높이)
- ❤️ 하트 이모지
- 그라데이션: 핑크 → 로즈 → 빨강

**TOP 3 (3위)**:
- 중간 사이즈 (500px/350px 높이)
- ⭐ 별 이모지
- 그라데이션: 블루 → 퍼플 → 핑크

#### 4. 카드 구성 ✅
- **이미지**: 전체 배경
- **부서명**: 그라데이션 배지
- **제목**: 크게 표시 (2줄 제한)
- **좋아요 수**: 하트 아이콘 + 숫자
- **조회수**: 눈 아이콘 + 숫자
- **자세히 보기 버튼**: 우측 하단

#### 5. 배경 효과 ✅
- **그라데이션**: 퍼플 → 핑크 → 레드
- **별 반짝임**: 20개 별 랜덤 애니메이션
- **각 별**: 페이드 인/아웃 + 스케일

#### 6. 애니메이션 ✅
- **TOP 배지**: 회전하며 등장
- **정보**: 순차적 페이드 인
- **불꽃 아이콘**: 스케일 + 회전
- **TOP 1 빛남**: 라디얼 그라데이션 펄스
- **외부 글로우**: 페이드 + 스케일 (TOP 1만)
- **호버**: 글로우 오버레이

---

## 📁 생성된 파일

```
frontend/src/
└── components/
    └── gallery/
        └── RealTimeHotBanner.tsx  # 실시간 HOT 3 배너 ⭐

문서/
└── REALTIME_HOT_BANNER.md         # 이 가이드
```

---

## 🚀 사용 방법

### 컴포넌트 사용

```tsx
import RealTimeHotBanner from "@/components/gallery/RealTimeHotBanner";

<RealTimeHotBanner photos={topPhotos} />
```

**Props**:
- `photos`: Photo 배열 (최소 1개, 최대 3개 사용)

---

## 🎨 디자인 상세

### 순위별 설정

```typescript
const RANK_CONFIG = [
  {
    rank: "TOP 1",
    emoji: "🔥",
    gradient: "from-red-500 via-orange-500 to-yellow-500",
    glow: "shadow-red-500/50",
    size: "large",
  },
  {
    rank: "TOP 2",
    emoji: "❤️",
    gradient: "from-pink-500 via-rose-500 to-red-500",
    glow: "shadow-pink-500/50",
    size: "medium",
  },
  {
    rank: "TOP 3",
    emoji: "⭐",
    gradient: "from-blue-500 via-purple-500 to-pink-500",
    glow: "shadow-purple-500/50",
    size: "medium",
  },
];
```

### Swiper 설정

```typescript
<Swiper
  modules={[Autoplay, EffectCoverflow]}
  effect="coverflow"              // 3D 효과
  grabCursor={true}               // 드래그 커서
  centeredSlides={true}           // 중앙 정렬
  slidesPerView="auto"            // 자동 크기
  coverflowEffect={{
    rotate: 50,                   // 회전 각도
    stretch: 0,
    depth: 100,                   // 깊이
    modifier: 1,
    slideShadows: true,
  }}
  autoplay={{
    delay: 5000,                  // 5초 간격
    disableOnInteraction: false,
  }}
  loop={true}                     // 무한 루프
/>
```

### 별 반짝임 애니메이션

```tsx
{[...Array(20)].map((_, i) => (
  <motion.div
    key={i}
    className="absolute w-1 h-1 bg-white rounded-full"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
    }}
    transition={{
      duration: 2 + Math.random() * 2,
      repeat: Infinity,
      delay: Math.random() * 2,
    }}
  />
))}
```

---

## 🔥 TOP 1 특별 효과

### 빛나는 효과

```tsx
<motion.div
  className="absolute inset-0 pointer-events-none"
  animate={{
    background: [
      "radial-gradient(circle at 50% 50%, rgba(255, 200, 0, 0.3) 0%, transparent 50%)",
      "radial-gradient(circle at 50% 50%, rgba(255, 100, 0, 0.3) 0%, transparent 50%)",
      "radial-gradient(circle at 50% 50%, rgba(255, 200, 0, 0.3) 0%, transparent 50%)",
    ],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
  }}
/>
```

### 외부 글로우

```tsx
<motion.div
  animate={{
    opacity: [0.3, 0.6, 0.3],
    scale: [1, 1.05, 1],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
  }}
  className="absolute inset-0 rounded-3xl blur-2xl -z-10 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"
/>
```

---

## 📱 반응형

### 크기

- **TOP 1**: 600px → 700px (데스크톱)
- **TOP 2/3**: 500px → 600px (데스크톱)
- **높이**: TOP 1 (400px), TOP 2/3 (350px)

### 텍스트

- **TOP 1 제목**: text-3xl
- **TOP 2/3 제목**: text-2xl
- **모바일**: 자동 조정

---

## 🎯 실시간 강조

### 현재 시간 표시

```typescript
const currentTime = new Date().toLocaleTimeString("ko-KR", {
  hour: "2-digit",
  minute: "2-digit",
});

<p className="text-xs text-muted-foreground mt-2">
  {currentTime} 기준 좋아요 순
</p>
```

### 하단 안내

```tsx
<p>실시간으로 업데이트되는 인기 순위입니다</p>
```

---

## 🎨 색상 시스템

### 그라데이션

- **TOP 1**: 🔥 빨강 → 오렌지 → 노랑 (불꽃)
- **TOP 2**: ❤️ 핑크 → 로즈 → 빨강 (하트)
- **TOP 3**: ⭐ 블루 → 퍼플 → 핑크 (별)

### 배경

- **그라데이션**: 퍼플/핑크/레드 (어두움)
- **별**: 흰색 (투명도 애니메이션)

---

## 🆚 기존 배너와 차이점

### 기존 TopThreeBanner
- 금/은/동 메달 🥇🥈🥉
- "이달의 인기작"
- 최종 시상 느낌
- 단순 슬라이드

### 새로운 RealTimeHotBanner
- TOP 1/2/3 + 이모지 🔥❤️⭐
- "실시간 HOT 3"
- 실시간 업데이트 강조
- 3D Coverflow 효과
- 빛나는 애니메이션
- 별 반짝임 배경
- 현재 시간 표시

---

## 💡 사용 팁

### 데이터 정렬

```typescript
// 좋아요 순으로 정렬된 상위 3개
const topPhotos = photos
  .sort((a, b) => b.likeCount - a.likeCount)
  .slice(0, 3);
```

### 자동 새로고침

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    // 5분마다 데이터 새로고침
    loadTopPhotos();
  }, 5 * 60 * 1000);

  return () => clearInterval(interval);
}, []);
```

---

## 🎉 완성!

실시간 느낌이 강조된 HOT 3 배너가 완성되었습니다!

### 주요 특징
- ✅ swiper.js 3D Coverflow
- ✅ TOP 1/2/3 표시
- ✅ 순위별 이모지 (🔥❤️⭐)
- ✅ 빛나는 효과 (TOP 1)
- ✅ 별 반짝임 배경
- ✅ 자동 슬라이드 (5초)
- ✅ 현재 시간 표시
- ✅ "자세히 보기" 버튼
- ✅ 반응형 디자인

### 실시간 강조
- ✅ "실시간 HOT 3" 타이틀
- ✅ 현재 시간 기준 명시
- ✅ 지속적 업데이트 안내
- ✅ 금/은/동 메달 미사용

즐거운 개발 되세요! 🔥✨

