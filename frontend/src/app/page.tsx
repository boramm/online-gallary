"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun, Palette, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.h1 
            className="text-2xl font-bold text-gradient"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            온라인 갤러리
          </motion.h1>
          
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg glass hover:bg-accent/10 transition-colors"
            aria-label="테마 전환"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-accent" />
            ) : (
              <Moon className="w-5 h-5 text-primary" />
            )}
          </button>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold text-gradient leading-tight">
              모던한 갤러리 경험
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              세련된 디자인과 부드러운 애니메이션으로 당신의 작품을 돋보이게 합니다
            </p>
            
            <div className="flex gap-4 justify-center pt-6">
              <motion.a
                href="/upload"
                className="px-8 py-4 rounded-lg gradient-primary text-white font-semibold hover-lift inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                사진 업로드
              </motion.a>
              <motion.a
                href="/gallery"
                className="px-8 py-4 rounded-lg glass font-semibold hover-lift inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                갤러리 보기
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 특징 카드 섹션 */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.h3
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            주요 특징
          </motion.h3>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-6 rounded-xl glass hover-lift cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 그라데이션 데모 섹션 */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.h3
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            컬러 시스템
          </motion.h3>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              className="h-48 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-xl hover-lift"
              whileHover={{ scale: 1.02 }}
            >
              Primary Gradient
            </motion.div>
            <motion.div
              className="h-48 rounded-xl gradient-accent flex items-center justify-center text-white font-bold text-xl hover-lift"
              whileHover={{ scale: 1.02 }}
            >
              Accent Gradient
            </motion.div>
            <motion.div
              className="h-48 rounded-xl gradient-mixed flex items-center justify-center text-white font-bold text-xl hover-lift"
              whileHover={{ scale: 1.02 }}
            >
              Mixed Gradient
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-muted-foreground">
            NestJS + Next.js로 구축된 온라인 갤러리 플랫폼
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Tailwind CSS • shadcn/ui • Framer Motion • Pretendard
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <Palette className="w-6 h-6 text-white" />,
    title: "세련된 디자인",
    description: "딥 블루와 골드 색상의 조화로운 컬러 팔레트",
  },
  {
    icon: <Sparkles className="w-6 h-6 text-white" />,
    title: "Glassmorphism",
    description: "부드러운 유리 효과로 모던한 UI 구현",
  },
  {
    icon: <Zap className="w-6 h-6 text-white" />,
    title: "부드러운 애니메이션",
    description: "Framer Motion으로 생동감 있는 인터랙션",
  },
];
