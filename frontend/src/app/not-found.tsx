"use client";

import { motion } from "framer-motion";
import { Camera, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* 배경 그라데이션 */}
      <div className="fixed inset-0 bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 dark:from-sky-950 dark:via-purple-950 dark:to-pink-950 -z-10" />

      {/* 떠다니는 카메라들 */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          <Camera className="w-16 h-16" />
        </motion.div>
      ))}

      {/* 메인 컨텐츠 */}
      <div className="container mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 큰 숫자 */}
          <motion.h1
            className="text-[12rem] font-bold text-gradient leading-none mb-4"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            404
          </motion.h1>

          {/* 카메라 일러스트 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Camera className="w-32 h-32 text-primary" />
              </motion.div>
              
              {/* 플래시 효과 */}
              <motion.div
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="absolute inset-0 bg-yellow-400 rounded-full blur-xl -z-10"
              />
            </div>
          </motion.div>

          {/* 메시지 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-8"
          >
            <h2 className="text-3xl font-bold">페이지를 찾을 수 없어요</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              요청하신 페이지가 존재하지 않거나 이동되었습니다.
              <br />
              다른 멋진 사진들을 구경해보세요! 📸
            </p>
          </motion.div>

          {/* 버튼들 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 rounded-xl gradient-primary text-white font-semibold hover-lift"
              >
                <Home className="w-5 h-5" />
                홈으로 가기
              </motion.button>
            </Link>

            <Link href="/gallery">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 rounded-xl glass backdrop-blur-xl hover:bg-accent/10 font-semibold hover-lift"
              >
                <Camera className="w-5 h-5" />
                갤러리 보기
              </motion.button>
            </Link>
          </motion.div>

          {/* 뒤로 가기 링크 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <button
              onClick={() => window.history.back()}
              className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              이전 페이지로 돌아가기
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

