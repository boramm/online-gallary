"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { isPhotoLiked, toggleLike as toggleLikeStorage, syncLikeToServer } from "@/lib/like-manager";

interface LikeButtonProps {
  photoId: string;
  initialLikeCount: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  onLikeChange?: (newCount: number, isLiked: boolean) => void;
}

export default function LikeButton({
  photoId,
  initialLikeCount,
  size = "md",
  showCount = true,
  onLikeChange,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  
  const heartControls = useAnimation();
  const countControls = useAnimation();

  // 초기 좋아요 상태 로드
  useEffect(() => {
    setIsLiked(isPhotoLiked(photoId));
  }, [photoId]);

  // 좋아요 토글
  const handleLike = async () => {
    if (isAnimating) return;

    setIsAnimating(true);

    // Optimistic update
    const newIsLiked = !isLiked;
    const newCount = newIsLiked ? likeCount + 1 : likeCount - 1;
    
    setIsLiked(newIsLiked);
    setLikeCount(newCount);

    // LocalStorage 업데이트
    toggleLikeStorage(photoId);

    // 하트 통통 튀는 애니메이션
    if (newIsLiked) {
      heartControls.start({
        scale: [1, 1.4, 0.9, 1.1, 1],
        rotate: [0, -10, 10, -5, 0],
        transition: {
          duration: 0.5,
          times: [0, 0.2, 0.4, 0.6, 1],
        },
      });

      // 파티클 효과
      createParticles();
    } else {
      heartControls.start({
        scale: [1, 0.8, 1],
        transition: { duration: 0.3 },
      });
    }

    // 숫자 카운트업 애니메이션
    if (showCount) {
      countControls.start({
        y: [0, -10, 0],
        opacity: [1, 0, 1],
        transition: { duration: 0.4 },
      });
    }

    // 서버에 동기화
    const serverCount = await syncLikeToServer(photoId, newIsLiked);
    if (serverCount !== null) {
      setLikeCount(serverCount);
    }

    // 부모 컴포넌트에 알림
    if (onLikeChange) {
      onLikeChange(serverCount !== null ? serverCount : newCount, newIsLiked);
    }

    setTimeout(() => setIsAnimating(false), 500);
  };

  // 파티클 생성
  const createParticles = () => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 60,
    }));
    setParticles(newParticles);
    
    setTimeout(() => setParticles([]), 1000);
  };

  // 크기 설정
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      {/* 하트 버튼 */}
      <motion.button
        onClick={handleLike}
        animate={heartControls}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`
          ${sizeClasses[size]} rounded-full flex items-center justify-center
          transition-colors relative overflow-visible
          ${isLiked 
            ? "bg-red-500 text-white" 
            : "glass hover:bg-accent/10"
          }
        `}
      >
        <Heart
          className={`${iconSizes[size]} transition-all ${
            isLiked ? "fill-white" : ""
          }`}
        />

        {/* 파티클 효과 */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: 0,
                scale: 1,
                x: particle.x,
                y: particle.y,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute pointer-events-none"
            >
              <Heart className="w-3 h-3 fill-red-500 text-red-500" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.button>

      {/* 좋아요 수 */}
      {showCount && (
        <motion.span
          animate={countControls}
          className={`font-semibold ${textSizes[size]} ${
            isLiked ? "text-red-500" : "text-foreground"
          }`}
        >
          {(likeCount || 0).toLocaleString()}
        </motion.span>
      )}
    </div>
  );
}

