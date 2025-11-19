// 귀여운 형용사 목록
const ADJECTIVES = [
  '반짝이는', '쾌활한', '사랑스러운', '용감한', '똑똑한',
  '귀여운', '재미있는', '활발한', '다정한', '친절한',
  '명랑한', '즐거운', '상냥한', '씩씩한', '발랄한',
  '포근한', '따뜻한', '부드러운', '상쾌한', '깜찍한',
  '멋진', '화려한', '우아한', '단아한', '고운',
  '청순한', '순수한', '천진난만한', '정겨운', '다정다감한',
  '행복한', '신나는', '기쁜', '환한', '밝은',
  '영리한', '총명한', '재치있는', '슬기로운', '현명한',
];

// 동물 목록
const ANIMALS = [
  '호랑이', '펭귄', '토끼', '여우', '사슴',
  '고양이', '강아지', '햄스터', '다람쥐', '판다',
  '코알라', '수달', '미어캣', '알파카', '라마',
  '돌고래', '물개', '펭수', '병아리', '오리',
  '거북이', '앵무새', '카나리아', '독수리', '부엉이',
  '코끼리', '기린', '얼룩말', '캥거루', '쿼카',
  '고슴도치', '비버', '친칠라', '페럿', '레서판다',
  '사자', '치타', '표범', '늑대', '곰',
];

/**
 * 랜덤 닉네임 생성
 * @returns {string} 예: "반짝이는 호랑이"
 */
export function generateRandomNickname(): string {
  const randomAdj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${randomAdj} ${randomAnimal}`;
}

/**
 * 닉네임으로부터 일관된 해시값 생성 (아바타 시드로 사용)
 * @param {string} nickname
 * @returns {string} 해시 문자열
 */
export function getNicknameHash(nickname: string): string {
  let hash = 0;
  for (let i = 0; i < nickname.length; i++) {
    const char = nickname.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * DiceBear 아바타 URL 생성
 * @param {string} nickname
 * @returns {string} 아바타 이미지 URL
 */
export function getAvatarUrl(nickname: string): string {
  const seed = getNicknameHash(nickname);
  // DiceBear API: https://www.dicebear.com/
  // 스타일: adventurer, avataaars, bottts, fun-emoji 등
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
}

