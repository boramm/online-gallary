"use client";

import { motion } from "framer-motion";
import { MessageCircle, Eye } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import LikeButton from "@/components/ui/LikeButton";

interface PhotoCardProps {
  photo: {
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
    comments?: any[];
  };
  onClick?: () => void;
}

const DEPARTMENT_COLORS: Record<string, string> = {
  기획팀: "#1E40AF",
  디자인팀: "#F59E0B",
  개발팀: "#10B981",
  마케팅팀: "#EF4444",
  인사팀: "#8B5CF6",
  영업팀: "#3B82F6",
};

export default function PhotoCard({ photo, onClick }: PhotoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const deptColor =
    photo.department?.color || DEPARTMENT_COLORS[photo.departmentName] || "#6B7280";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      {/* 카드 */}
      <div
        className="relative rounded-2xl overflow-hidden glass backdrop-blur-xl shadow-lg transition-all duration-300 group-hover:shadow-2xl"
        style={{
          borderWidth: 3,
          borderColor: deptColor,
        }}
      >
        {/* Skeleton Loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          </div>
        )}

        {/* 이미지 */}
        <div className="relative w-full aspect-[4/3]">
          <Image
            src={photo.thumbnailUrl || photo.imageUrl}
            alt={photo.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
            className={`object-cover transition-all duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            priority={false}
          />
        </div>

        {/* Unsplash 스타일 호버 오버레이 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20"
        >
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
            {/* 제목 (Unsplash 스타일) */}
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-bold text-white line-clamp-2 mb-2"
            >
              {photo.title}
            </motion.h3>

            {/* 부서명 + 색상 점 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-2 mb-3"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: deptColor }}
              />
              <span className="text-white/90 text-sm font-medium">
                {photo.departmentName}
              </span>
            </motion.div>

            {/* 통계 (Unsplash 스타일) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4 text-white">
                {/* 좋아요 */}
                <div onClick={(e) => e.stopPropagation()}>
                  <LikeButton
                    photoId={photo.id}
                    initialLikeCount={photo.likeCount}
                    size="sm"
                    showCount={true}
                  />
                </div>

                {/* 댓글 */}
                <div className="flex items-center gap-2 hover:text-white/80 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {photo.comments?.length || 0}
                  </span>
                </div>

                {/* 조회수 */}
                <div className="flex items-center gap-2 hover:text-white/80 transition-colors">
                  <Eye className="w-5 h-5" />
                  <span className="text-sm font-medium">{photo.viewCount}</span>
                </div>
              </div>

              {/* 업로드 날짜 */}
              <span className="text-xs text-white/60">
                {new Date(photo.uploadDate).toLocaleDateString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* 부서 색상 글로우 효과 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.5 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 60px ${deptColor}`,
          }}
        />
      </div>

      {/* 호버 시 확대 그림자 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 0.3 : 0,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 rounded-2xl blur-xl -z-10"
        style={{ backgroundColor: deptColor }}
      />
    </motion.div>
  );
}

