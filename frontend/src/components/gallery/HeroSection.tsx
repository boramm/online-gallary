"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function HeroSection() {
  const subtitles = [
    "부서를 가장 잘 나타내는 사진을 공유해주세요",
    "우리가 바라본 새로운 시선",
    "함께 만들어가는 우리의 이야기",
  ];

  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* 그라데이션 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 -z-10" />
      
      {/* 장식 요소 */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container mx-auto max-w-6xl text-center relative z-10">
        {/* 아이콘 */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div className="p-4 rounded-full bg-gradient-primary">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        {/* 메인 타이틀 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-6xl md:text-8xl font-bold mb-6"
        >
          <span className="text-gradient">시선이 잇(있)는 날</span>
        </motion.h1>

        {/* 애니메이션 서브카피 */}
        <div className="h-16 flex items-center justify-center">
          {subtitles.map((subtitle, index) => (
            <motion.p
              key={subtitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [20, 0, 0, -20],
              }}
              transition={{
                duration: 3,
                delay: index * 3,
                repeat: Infinity,
                repeatDelay: (subtitles.length - 1) * 3,
              }}
              className="text-xl md:text-2xl text-muted-foreground absolute"
            >
              {subtitle}
            </motion.p>
          ))}
        </div>

        {/* 스크롤 인디케이터 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="inline-flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-sm">스크롤하여 더보기</span>
            <div className="w-6 h-10 rounded-full border-2 border-current p-1">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-current mx-auto"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

