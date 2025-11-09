/**
 * 좋아요 관리 유틸리티
 * LocalStorage로 사용자가 좋아요한 사진 추적
 */

const LIKES_STORAGE_KEY = 'likedPhotos';

/**
 * 사용자가 특정 사진을 좋아요했는지 확인
 */
export function isPhotoLiked(photoId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const likedPhotos = getLikedPhotos();
  return likedPhotos.includes(photoId);
}

/**
 * 좋아요 추가
 */
export function addLike(photoId: string): void {
  if (typeof window === 'undefined') return;
  
  const likedPhotos = getLikedPhotos();
  if (!likedPhotos.includes(photoId)) {
    likedPhotos.push(photoId);
    saveLikedPhotos(likedPhotos);
  }
}

/**
 * 좋아요 취소
 */
export function removeLike(photoId: string): void {
  if (typeof window === 'undefined') return;
  
  const likedPhotos = getLikedPhotos();
  const filtered = likedPhotos.filter(id => id !== photoId);
  saveLikedPhotos(filtered);
}

/**
 * 좋아요 토글
 */
export function toggleLike(photoId: string): boolean {
  const isLiked = isPhotoLiked(photoId);
  if (isLiked) {
    removeLike(photoId);
  } else {
    addLike(photoId);
  }
  return !isLiked; // 새로운 상태 반환
}

/**
 * 모든 좋아요한 사진 ID 목록 가져오기
 */
export function getLikedPhotos(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(LIKES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * 좋아요 목록 저장
 */
function saveLikedPhotos(photoIds: string[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(photoIds));
  } catch (error) {
    console.error('좋아요 저장 실패:', error);
  }
}

/**
 * 좋아요 API 호출
 */
export async function syncLikeToServer(photoId: string, isLiked: boolean): Promise<number | null> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    console.log('[like-manager] 좋아요 API 호출:', photoId, 'isLiked:', isLiked);
    const response = await fetch(`${API_URL}/photos/${photoId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 포함 (IP 추출용)
      body: JSON.stringify({ isLiked }),
    });

    console.log('[like-manager] 좋아요 API 응답 상태:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('[like-manager] 좋아요 API 응답 데이터:', data);
      return data.data?.likeCount || null;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('[like-manager] 좋아요 API 오류:', errorData);
    }
    return null;
  } catch (error) {
    console.error('[like-manager] 좋아요 API 호출 실패:', error);
    return null;
  }
}

