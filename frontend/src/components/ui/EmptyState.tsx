"use client";

import { motion } from "framer-motion";
import { Camera, ImagePlus, Upload } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: "camera" | "image" | "upload";
}

export default function EmptyState({
  title = "아직 사진이 없어요",
  description = "첫 번째 사진을 업로드해보세요!",
  actionLabel = "사진 업로드하기",
  actionHref = "/upload",
  icon = "camera",
}: EmptyStateProps) {
  const icons = {
    camera: Camera,
    image: ImagePlus,
    upload: Upload,
  };

  const Icon = icons[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      {/* 일러스트레이션 */}
      <div className="relative mb-8">
        {/* 메인 아이콘 */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative z-10"
        >
          <div className="w-32 h-32 rounded-3xl glass backdrop-blur-xl flex items-center justify-center">
            <Icon className="w-16 h-16 text-primary" />
          </div>
        </motion.div>

        {/* 떠다니는 작은 아이콘들 */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${-40 + i * 60}px`,
              top: `${-20 + i * 30}px`,
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            <div className="w-12 h-12 rounded-xl glass backdrop-blur-xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary/50" />
            </div>
          </motion.div>
        ))}

        {/* 배경 원 */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="absolute inset-0 -m-8 rounded-full bg-primary blur-3xl"
        />
      </div>

      {/* 텍스트 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8 max-w-md"
      >
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground text-lg">{description}</p>
      </motion.div>

      {/* CTA 버튼 */}
      {actionHref && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href={actionHref}>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 rounded-xl gradient-primary text-white font-semibold hover-lift"
            >
              <Upload className="w-5 h-5" />
              {actionLabel}
            </motion.button>
          </Link>
        </motion.div>
      )}

      {/* 추가 힌트 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 rounded-full bg-primary"
            />
          ))}
        </div>
        <span>JPG, PNG, HEIC, WebP 지원</span>
      </motion.div>
    </motion.div>
  );
}

