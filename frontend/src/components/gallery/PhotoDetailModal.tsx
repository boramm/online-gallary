"use client";

import { useEffect, useState } from "react";
import {
  X,
  Eye,
  Calendar,
  Share2,
  Edit,
  Trash2,
} from "lucide-react";
import CommentSection from "./CommentSection";
import LikeButton from "@/components/ui/LikeButton";
import { useAdmin } from "@/contexts/AdminContext";

interface Photo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  departmentName: string;
  likeCount: number;
  viewCount: number;
  uploadDate: string;
  department?: {
    name: string;
    color: string;
  };
  comments?: Comment[];
}

interface Comment {
  id: string;
  nickname: string;
  content: string;
  createdAt: string;
}

interface PhotoDetailModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  allPhotos?: Photo[];
  onNavigate?: (photoId: string) => void;
}

export default function PhotoDetailModal({
  photo,
  isOpen,
  onClose,
  allPhotos = [],
  onNavigate,
}: PhotoDetailModalProps) {
  const { isAdmin } = useAdmin();
  const [currentLikeCount, setCurrentLikeCount] = useState(0);
  const [currentViewCount, setCurrentViewCount] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (photo && isOpen) {
      setCurrentLikeCount(photo.likeCount);
      setCurrentViewCount(photo.viewCount || 0);
      setIsImageLoading(true);
      // 댓글 로드
      loadComments(photo.id);
      // 조회수 증가 API 호출 (모달 열 때마다)
      incrementViewCount(photo.id);
    }
  }, [photo, isOpen]);

  // 조회수 증가
  const incrementViewCount = async (photoId: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      console.log('[PhotoDetailModal] 조회수 증가 API 호출:', photoId);
      const response = await fetch(`${API_URL}/photos/${photoId}`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('[PhotoDetailModal] 조회수 증가 응답:', result);
        // 최신 조회수로 업데이트
        if (result.data && result.data.viewCount !== undefined) {
          setCurrentViewCount(result.data.viewCount);
          console.log('[PhotoDetailModal] 조회수 업데이트:', result.data.viewCount);
        }
      }
    } catch (error) {
      console.error('[PhotoDetailModal] 조회수 증가 실패:', error);
    }
  };

  // 댓글 로드
  const loadComments = async (photoId: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(
        `${API_URL}/comments/photo/${photoId}`
      );
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("댓글 로드 실패:", error);
    }
  };

  // 새 댓글 추가
  const handleCommentAdded = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  // ESC 키로 닫기
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

  // 좋아요 변경 시 콜백
  const handleLikeChange = (newCount: number, isLiked: boolean) => {
    setCurrentLikeCount(newCount);
  };

  // 공유하기
  const handleShare = async () => {
    if (navigator.share && photo) {
      try {
        await navigator.share({
          title: photo.title,
          text: photo.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    } else {
      // 링크 복사
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었습니다!");
    }
  };

  // 삭제 처리
  const handleDelete = async () => {
    if (!photo || !isAdmin) return;
    
    if (confirm("정말로 이 사진을 삭제하시겠습니까?")) {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_URL}/photos/${photo.id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          alert("사진이 삭제되었습니다.");
          onClose();
          // 페이지 새로고침
          window.location.reload();
        } else {
          alert("사진 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("사진 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // 수정 처리 (간단한 prompt 사용)
  const handleEdit = async () => {
    if (!photo || !isAdmin) return;

    const newTitle = prompt("새 제목을 입력하세요:", photo.title);
    if (newTitle === null) return; // 취소

    const newDescription = prompt("새 설명을 입력하세요:", photo.description);
    if (newDescription === null) return; // 취소

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/photos/${photo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
        }),
      });

      if (response.ok) {
        alert("사진 정보가 수정되었습니다.");
        // 페이지 새로고침
        window.location.reload();
      } else {
        alert("사진 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("수정 실패:", error);
      alert("사진 수정 중 오류가 발생했습니다.");
    }
  };


  if (!photo) return null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onClose}
        >
          {/* 블러 배경 */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

          {/* 모달 컨텐츠 */}
          <div
            className="relative w-full h-full md:w-[95vw] md:h-[90vh] md:max-w-7xl bg-background md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 좌측: 이미지 영역 */}
            <div className="flex-1 bg-black relative min-h-[40vh] md:min-h-0 flex items-center justify-center">
              <div className="relative">
                {/* 이미지 로딩 Shimmer */}
                {isImageLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer" />
                )}
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="max-w-full max-h-[90vh] object-contain"
                  onLoad={() => setIsImageLoading(false)}
                />
              </div>
            </div>

            {/* 우측: 정보 패널 */}
            <div className="w-full md:w-96 flex flex-col bg-background max-h-[60vh] md:max-h-none overflow-y-auto md:overflow-visible">
              {/* 헤더 */}
              <div className="p-6 border-b border-border">
                {/* 부서 배지 */}
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-medium mb-3"
                  style={{
                    backgroundColor:
                      photo.department?.color || "#6B7280",
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                  {photo.departmentName}
                </div>

                {/* 제목 */}
                <h2 className="text-2xl font-bold mb-2">
                  {photo.title}
                </h2>

                {/* 설명 */}
                <p className="text-muted-foreground">
                  {photo.description}
                </p>
              </div>

              {/* 통계 & 액션 */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  {/* 통계 */}
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      <span>{(currentViewCount || photo.viewCount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(photo.uploadDate).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-2">
                  {/* 좋아요 버튼 */}
                  <div className="flex-1 flex items-center justify-center px-4 py-3 rounded-xl glass">
                    <LikeButton
                      photoId={photo.id}
                      initialLikeCount={currentLikeCount}
                      size="md"
                      showCount={true}
                      onLikeChange={handleLikeChange}
                    />
                  </div>

                  {/* 공유 버튼 */}
                  <button
                    onClick={handleShare}
                    className="px-4 py-3 rounded-xl glass hover:bg-accent/10 transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>

                  {/* 관리자 전용 버튼 */}
                  {isAdmin && (
                    <>
                      {/* 수정 버튼 */}
                      <button
                        onClick={handleEdit}
                        className="px-4 py-3 rounded-xl glass hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 transition-all"
                        title="사진 수정"
                      >
                        <Edit className="w-5 h-5" />
                      </button>

                      {/* 삭제 버튼 */}
                      <button
                        onClick={handleDelete}
                        className="px-4 py-3 rounded-xl glass hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-all"
                        title="사진 삭제"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* 댓글 섹션 */}
              {photo && (
                <CommentSection
                  photoId={photo.id}
                  comments={comments}
                  onCommentAdded={handleCommentAdded}
                />
              )}
            </div>

            {/* 우상단: 닫기 버튼 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 md:p-3 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

