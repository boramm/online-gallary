# 💬 댓글 기능 완성 가이드

모든 요구사항이 완벽하게 구현되었습니다!

---

## ✨ 구현된 기능

### Backend (NestJS)

#### 1. 댓글 CRUD API ✅

**엔드포인트**:
```
POST   /comments                      # 댓글 생성
GET    /comments/photo/:photoId       # 특정 사진의 댓글 조회
GET    /comments/:id                  # 특정 댓글 조회
PATCH  /comments/:id                  # 댓글 수정
DELETE /comments/:id                  # 댓글 삭제
GET    /comments/photo/:photoId/count # 댓글 수 조회
```

**생성 예시**:
```bash
POST http://localhost:3001/comments
Content-Type: application/json

{
  "photoId": "uuid-here",
  "nickname": "반짝이는 호랑이",
  "content": "정말 멋진 사진이네요!"
}
```

#### 2. 스팸 방지 ✅

**기능**:
- 같은 IP에서 1분 내 3개 이상 댓글 작성 제한
- 인메모리 Map으로 IP별 요청 추적
- 1시간마다 오래된 데이터 자동 정리

**구현**:
```typescript
interface SpamTracker {
  count: number;
  firstRequest: Date;
}

private readonly spamTracker = new Map<string, SpamTracker>();

checkSpam(ip: string): void {
  const tracker = this.spamTracker.get(ip);
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

  if (tracker && tracker.count >= 3 && tracker.firstRequest > oneMinuteAgo) {
    throw new BadRequestException(
      '너무 많은 댓글을 작성하셨습니다. 1분 후에 다시 시도해주세요.'
    );
  }
}
```

---

### Frontend (Next.js)

#### 3. 랜덤 닉네임 생성기 ✅

**형용사 + 동물 조합**:
- 형용사 40개: 반짝이는, 쾌활한, 사랑스러운, 용감한 등
- 동물 40개: 호랑이, 펭귄, 토끼, 여우 등
- 예시: "반짝이는 호랑이", "쾌활한 펭귄"

**로컬스토리지 저장**:
```typescript
const storedNickname = localStorage.getItem("userNickname");
if (!storedNickname) {
  const newNickname = generateRandomNickname();
  localStorage.setItem("userNickname", newNickname);
}
```

#### 4. DiceBear 아바타 ✅

**닉네임별 일관된 아바타**:
- 닉네임을 해시하여 시드값 생성
- DiceBear API로 SVG 아바타 생성
- 같은 닉네임은 항상 같은 아바타

```typescript
export function getAvatarUrl(nickname: string): string {
  const seed = getNicknameHash(nickname);
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
}
```

#### 5. 카카오톡 스타일 말풍선 ✅

**디자인**:
- 좌측: 아바타 (원형, 10×10)
- 우측: 말풍선 (glass 효과, 둥근 모서리)
- 좌측 상단 모서리만 직각 (rounded-tl-none)

```tsx
<div className="flex gap-3">
  {/* 아바타 */}
  <img
    src={getAvatarUrl(comment.nickname)}
    alt={comment.nickname}
    className="w-10 h-10 rounded-full"
  />
  
  {/* 말풍선 */}
  <div className="glass backdrop-blur-sm p-3 rounded-2xl rounded-tl-none">
    <p className="text-sm">{comment.content}</p>
  </div>
</div>
```

#### 6. 확장 가능한 Textarea ✅

**자동 높이 조절**:
```typescript
useEffect(() => {
  if (textareaRef.current) {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }
}, [newComment]);
```

**속성**:
- min-height: 60px
- max-height: 150px
- resize-none (수동 크기 조절 비활성화)

#### 7. 200자 제한 + 카운터 ✅

**실시간 카운터**:
```tsx
<span className={remainingChars < 20 ? "text-red-500" : "text-muted-foreground"}>
  {remainingChars}
</span>
```

**색상 변경**:
- 200~50자: 회색
- 50~20자: 노란색
- 20~0자: 빨간색

**프로그레스 바**:
```tsx
<motion.div
  animate={{ width: `${(newComment.length / 200) * 100}%` }}
  className="h-full bg-primary"
/>
```

#### 8. 상대적 시간 표시 ✅

**표시 형식**:
- 1분 미만: "방금 전"
- 1~60분: "5분 전"
- 1~24시간: "2시간 전"
- 1~7일: "3일 전"
- 1~4주: "2주 전"
- 1~12개월: "3개월 전"
- 1년 이상: "1년 전"

```typescript
export function getRelativeTime(date: string | Date): string {
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) return '방금 전';
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  // ...
}
```

#### 9. 새 댓글 애니메이션 ✅

**Spring 애니메이션**:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{
    type: "spring",
    stiffness: 300,
    damping: 25,
  }}
>
  {/* 댓글 내용 */}
</motion.div>
```

**순차적 등장**:
```tsx
transition={{ delay: index * 0.05 }}
```

---

## 📁 파일 구조

### Backend

```
backend/src/
├── comments/
│   ├── comments.module.ts           # CommentsModule
│   ├── comments.controller.ts       # API 엔드포인트
│   ├── comments.service.ts          # 비즈니스 로직 + 스팸 방지
│   └── dto/
│       ├── create-comment.dto.ts    # 생성 DTO
│       └── update-comment.dto.ts    # 수정 DTO
└── app.module.ts                    # CommentsModule 임포트
```

### Frontend

```
frontend/src/
├── components/gallery/
│   ├── CommentSection.tsx           # ⭐ 댓글 섹션 컴포넌트
│   └── PhotoDetailModal.tsx         # 댓글 섹션 통합
├── lib/
│   ├── nickname-generator.ts        # 닉네임 생성 + 아바타 URL
│   └── time-formatter.ts            # 상대적 시간 표시
```

---

## 🎯 사용 방법

### 1. Backend 실행

```bash
cd backend
npm run start:dev
```

### 2. Frontend 실행

```bash
cd frontend
npm run dev
```

### 3. 댓글 작성

1. 갤러리에서 사진 클릭 → 모달 열기
2. 하단 댓글 섹션에서 댓글 입력
3. 닉네임은 자동 생성 (변경 가능)
4. 200자 이내로 작성
5. 전송 버튼 클릭

### 4. 스팸 테스트

같은 브라우저에서 1분 내 4번째 댓글 작성 시:
```
에러: "너무 많은 댓글을 작성하셨습니다. 1분 후에 다시 시도해주세요."
```

---

## 🎨 UI 특징

### 닉네임 & 아바타

- **닉네임**: 귀여운 형용사 + 동물 조합
- **아바타**: DiceBear SVG (닉네임별 고정)
- **변경 버튼**: 클릭 시 새 닉네임 생성

### 댓글 말풍선

- **카카오톡 스타일**: 좌측 상단 직각, 나머지 둥근 모서리
- **Glass 효과**: 반투명 + 블러
- **반응형**: 긴 텍스트 자동 줄바꿈

### 입력창

- **자동 확장**: 텍스트 입력 시 높이 자동 조절
- **200자 제한**: 초과 시 전송 버튼 비활성화
- **실시간 카운터**: 색상 변경 (회색/노랑/빨강)
- **프로그레스 바**: 작성 진행률 표시

### 애니메이션

- **새 댓글**: Spring 애니메이션으로 부드럽게 추가
- **순차적**: 여러 댓글 동시 로드 시 0.05초 간격
- **말풍선**: 스케일 효과

---

## 📊 API 명세

### POST /comments
**요청**:
```json
{
  "photoId": "uuid",
  "nickname": "반짝이는 호랑이",
  "content": "멋진 사진이에요!"
}
```

**응답**:
```json
{
  "id": "uuid",
  "photoId": "uuid",
  "nickname": "반짝이는 호랑이",
  "content": "멋진 사진이에요!",
  "createdAt": "2025-01-01T12:00:00.000Z"
}
```

**에러 (스팸)**:
```json
{
  "statusCode": 400,
  "message": "너무 많은 댓글을 작성하셨습니다. 1분 후에 다시 시도해주세요."
}
```

### GET /comments/photo/:photoId
**응답**:
```json
[
  {
    "id": "uuid",
    "photoId": "uuid",
    "nickname": "쾌활한 펭귄",
    "content": "정말 아름답네요!",
    "createdAt": "2025-01-01T12:05:00.000Z"
  },
  ...
]
```

---

## 🔧 커스터마이징

### 닉네임 목록 변경

`frontend/src/lib/nickname-generator.ts`:
```typescript
const ADJECTIVES = ['새로운', '멋진', ...];
const ANIMALS = ['강아지', '고양이', ...];
```

### 아바타 스타일 변경

DiceBear 스타일 옵션:
- `adventurer` (현재)
- `avataaars`
- `bottts`
- `fun-emoji`
- `lorelei`
- `pixel-art`

```typescript
return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
```

### 글자 수 제한 변경

```typescript
// DTO
@MaxLength(200)  // → 300으로 변경
content: string;

// UI
const remainingChars = 200 - newComment.length;  // → 300
```

### 스팸 제한 조정

```typescript
// 1분 내 3개 → 5개로 변경
if (tracker.count >= 3) {  // → >= 5
  throw new BadRequestException(...);
}
```

---

## 🎉 완성!

댓글 기능이 모든 요구사항에 맞춰 완벽하게 구현되었습니다!

### Backend ✅
- ✅ 댓글 CRUD API
- ✅ 스팸 방지 (IP별 1분 내 3개 제한)

### Frontend ✅
- ✅ 랜덤 닉네임 생성기 (형용사 + 동물)
- ✅ DiceBear 아바타 (닉네임별 고정)
- ✅ 확장 가능한 textarea
- ✅ 200자 제한 + 카운터
- ✅ 프로그레스 바
- ✅ 카카오톡 스타일 말풍선
- ✅ 상대적 시간 표시
- ✅ 새 댓글 애니메이션 (Spring)
- ✅ 로컬스토리지 닉네임 저장

### 통합 ✅
- ✅ PhotoDetailModal에 CommentSection 통합
- ✅ 실시간 댓글 추가
- ✅ API 연동

즐거운 개발 되세요! 💬✨

