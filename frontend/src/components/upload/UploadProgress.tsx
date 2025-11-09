"use client";

import { motion } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";

interface UploadProgressProps {
  progress: number;
  isComplete: boolean;
}

export default function UploadProgress({
  progress,
  isComplete,
}: UploadProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <div className="glass backdrop-blur-xl rounded-2xl shadow-2xl p-6 min-w-[300px] border border-border">
        <div className="flex items-center gap-4 mb-4">
          {isComplete ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </motion.div>
          ) : (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-8 h-8 text-primary" />
            </motion.div>
          )}

          <div className="flex-1">
            <p className="font-semibold">
              {isComplete ? "업로드 완료!" : "업로드 중..."}
            </p>
            <p className="text-sm text-muted-foreground">
              {isComplete ? "사진이 성공적으로 업로드되었습니다" : `${Math.round(progress)}%`}
            </p>
          </div>
        </div>

        {!isComplete && (
          <div className="space-y-2">
            {/* 프로그레스 바 */}
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 50 }}
                className="h-full bg-gradient-primary"
              />
            </div>

            {/* 애니메이션 도트 */}
            <div className="flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

