"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Eye,
  Calendar,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import CommentSection from "./CommentSection";
import LikeButton from "@/components/ui/LikeButton";

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
  const [currentLikeCount, setCurrentLikeCount] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (photo) {
      setCurrentLikeCount(photo.likeCount);
      setIsImageLoading(true);
      // 댓글 로드
      loadComments(photo.id);
    }
  }, [photo]);

  // 댓글 로드
  const loadComments = async (photoId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/comments/photo/${photoId}`
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


  // 이전/다음 사진
  const currentIndex = allPhotos.findIndex((p) => p.id === photo?.id);
  const prevPhoto = currentIndex > 0 ? allPhotos[currentIndex - 1] : null;
  const nextPhoto =
    currentIndex < allPhotos.length - 1 ? allPhotos[currentIndex + 1] : null;

  if (!photo) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onClose}
        >
          {/* 블러 배경 */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

          {/* 모달 컨텐츠 */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full h-full md:w-[95vw] md:h-[90vh] md:max-w-7xl bg-background md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
            {/* 좌측: 이미지 영역 (Instagram 스타일) */}
            <div className="flex-1 bg-black relative min-h-[40vh] md:min-h-0 flex items-center justify-center">
              <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={3}
                centerOnInit
              >
                <TransformComponent
                  wrapperClass="w-full h-full"
                  contentClass="w-full h-full flex items-center justify-center"
                >
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
                </TransformComponent>
              </TransformWrapper>

              {/* 확대/축소 안내 */}
              <div className="absolute bottom-4 left-4 text-white/60 text-sm">
                마우스 휠로 확대/축소, 드래그로 이동
              </div>
            </div>

            {/* 우측: 정보 패널 */}
            <div className="w-full md:w-96 flex flex-col bg-background max-h-[60vh] md:max-h-none overflow-y-auto md:overflow-visible">
              {/* 헤더 */}
              <div className="p-6 border-b border-border">
                {/* 부서 배지 */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-medium mb-3"
                  style={{
                    backgroundColor:
                      photo.department?.color || "#6B7280",
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full bg-white animate-pulse"
                  />
                  {photo.departmentName}
                </motion.div>

                {/* 제목 */}
                <motion.h2
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold mb-2"
                >
                  {photo.title}
                </motion.h2>

                {/* 설명 */}
                <motion.p
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground"
                >
                  {photo.description}
                </motion.p>
              </div>

              {/* 통계 & 액션 */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  {/* 통계 */}
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      <span>{photo.viewCount.toLocaleString()}</span>
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="px-4 py-3 rounded-xl glass hover:bg-accent/10 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
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
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 md:p-3 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>

            {/* 하단: 이전/다음 네비게이션 (데스크톱만) */}
            {(prevPhoto || nextPhoto) && (
              <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 gap-4 z-50">
                {/* 이전 사진 */}
                {prevPhoto && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onNavigate?.(prevPhoto.id)}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg" />
                    <div className="relative flex items-center gap-2 px-4 py-2">
                      <ChevronLeft className="w-5 h-5 text-white" />
                      <img
                        src={prevPhoto.thumbnailUrl || prevPhoto.imageUrl}
                        alt={prevPhoto.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="text-left max-w-32">
                        <p className="text-white text-xs font-semibold truncate">
                          {prevPhoto.title}
                        </p>
                        <p className="text-white/60 text-xs">이전</p>
                      </div>
                    </div>
                  </motion.button>
                )}

                {/* 다음 사진 */}
                {nextPhoto && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onNavigate?.(nextPhoto.id)}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg" />
                    <div className="relative flex items-center gap-2 px-4 py-2">
                      <div className="text-right max-w-32">
                        <p className="text-white text-xs font-semibold truncate">
                          {nextPhoto.title}
                        </p>
                        <p className="text-white/60 text-xs">다음</p>
                      </div>
                      <img
                        src={nextPhoto.thumbnailUrl || nextPhoto.imageUrl}
                        alt={nextPhoto.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <ChevronRight className="w-5 h-5 text-white" />
                    </div>
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

