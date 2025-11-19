"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Heart, Eye, ArrowRight, Flame, Calendar } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Photo {
  id: string;
  title: string;
  imageUrl: string;
  thumbnailUrl?: string;
  departmentName: string;
  likeCount: number;
  viewCount: number;
  description?: string;
  uploadDate?: string;
}

interface RealTimeHotBannerProps {
  photos: Photo[];
}

const RANK_CONFIG = [
  {
    rank: "TOP 1",
    emoji: "🔥",
    gradient: "from-red-500 via-orange-500 to-yellow-500",
    glow: "shadow-red-500/50",
    size: "large",
  },
  {
    rank: "TOP 2",
    emoji: "❤️",
    gradient: "from-pink-500 via-rose-500 to-red-500",
    glow: "shadow-pink-500/50",
    size: "medium",
  },
  {
    rank: "TOP 3",
    emoji: "⭐",
    gradient: "from-blue-500 via-purple-500 to-pink-500",
    glow: "shadow-purple-500/50",
    size: "medium",
  },
];

export default function RealTimeHotBanner({ photos }: RealTimeHotBannerProps) {
  const topThree = photos.slice(0, 3);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  if (topThree.length === 0) return null;

  const currentTime = new Date().toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section className="relative py-12 px-4 overflow-hidden">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-red-900/20 dark:from-purple-950/40 dark:via-pink-950/40 dark:to-red-950/40" />

      {/* 별 반짝임 애니메이션 */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Flame className="w-8 h-8 text-orange-500" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gradient">
              실시간 HOT 3
            </h2>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.3,
              }}
            >
              <Flame className="w-8 h-8 text-orange-500" />
            </motion.div>
          </div>
          <p className="text-muted-foreground">지금 가장 인기있는 사진</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-muted-foreground mt-2"
          >
            {currentTime} 기준 좋아요 순
          </motion.p>
        </motion.div>

        {/* Swiper */}
        <div className="relative">
          <Swiper
            modules={[Autoplay, EffectCoverflow, Navigation]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            navigation={{
              nextEl: ".swiper-button-next-hot",
              prevEl: ".swiper-button-prev-hot",
            }}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={topThree.length > 1}
            className="!pb-12"
            onBeforeInit={(swiper) => {
              const navigation = swiper.params.navigation;
              if (navigation && typeof navigation !== "boolean") {
                navigation.prevEl = prevRef.current;
                navigation.nextEl = nextRef.current;
              }
            }}
            breakpoints={{
              0: {
                coverflowEffect: {
                  rotate: 0,
                  stretch: 0,
                  depth: 0,
                },
              },
              768: {
                coverflowEffect: {
                  rotate: 30,
                  stretch: 0,
                  depth: 50,
                },
              },
              1024: {
                coverflowEffect: {
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                },
              },
            }}
          >
          {topThree.map((photo, index) => {
            const config = RANK_CONFIG[index];
            const isTopOne = index === 0;

            return (
              <SwiperSlide
                key={photo.id}
                className="!w-auto px-2"
                style={{
                  width: isTopOne
                    ? "min(720px, 92vw)"
                    : "min(600px, 92vw)",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative w-full max-w-[960px] mx-auto rounded-[32px] bg-gradient-to-br from-white/90 to-white/70 dark:from-slate-900/90 dark:to-slate-900/70 shadow-2xl overflow-hidden border border-white/30 dark:border-white/10 transition-all duration-300",
                    config.glow
                  )}
                >
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8 p-5 md:p-8">
                    {/* 이미지 영역 */}
                    <div className="relative flex-1 rounded-3xl overflow-hidden bg-black/80 min-h-[240px] md:min-h-[420px]">
                      <Image
                        src={photo.thumbnailUrl || photo.imageUrl}
                        alt={photo.title}
                        fill
                        priority={index === 0}
                        className="object-contain md:object-cover"
                        sizes="(max-width: 768px) 90vw, (max-width: 1200px) 60vw, 600px"
                      />

                      {/* TOP 배지 */}
                      <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2 }}
                        className={cn(
                          "absolute top-4 right-4 px-5 py-2 rounded-2xl text-white text-sm font-semibold flex items-center gap-2 shadow-xl",
                          `bg-gradient-to-r ${config.gradient}`
                        )}
                      >
                        <span className="text-xl">{config.emoji}</span>
                        {config.rank}
                      </motion.div>

                      {/* 데스크톱 하단 오버레이 */}
                      <div className="hidden md:flex absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/90 via-black/30 to-transparent text-white justify-between items-center gap-4">
                        <div>
                          <p className="text-sm text-white/70 mb-1">
                            {photo.departmentName}
                          </p>
                          <h3
                            className={cn(
                              "font-bold",
                              isTopOne ? "text-3xl" : "text-2xl"
                            )}
                          >
                            {photo.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-base font-semibold">
                          <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                            {photo.likeCount.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-white" />
                            {photo.viewCount.toLocaleString()}
                          </div>
                          <Link
                            href={`/photo/${photo.id}`}
                            className="inline-flex items-center gap-2 rounded-full bg-white/95 text-primary px-5 py-2 shadow-lg font-semibold whitespace-nowrap"
                          >
                            자세히 보기
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* 정보 패널 */}
                    <div className="w-full md:w-80 flex flex-col gap-5">
                      <div className="flex flex-col gap-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-white self-start",
                            `bg-gradient-to-r ${config.gradient}`
                          )}
                        >
                          <span className="w-2 h-2 rounded-full bg-white" />
                          {photo.departmentName}
                        </span>
                        <h3 className="text-2xl font-bold">{photo.title}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-3">
                          {photo.description || "설명이 등록되지 않았습니다."}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm font-semibold text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                          {photo.likeCount.toLocaleString()} 좋아요
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-5 h-5 text-primary" />
                          {photo.viewCount.toLocaleString()} 조회
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                          {photo.uploadDate
                            ? new Date(photo.uploadDate).toLocaleDateString("ko-KR")
                            : "업로드 예정"}
                        </div>
                      </div>

                      <div className="md:hidden flex flex-col gap-3">
                        <div className="flex gap-4 text-sm font-semibold text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                            {photo.likeCount.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-primary" />
                            {photo.viewCount.toLocaleString()}
                          </div>
                        </div>
                        <Link
                          href={`/photo/${photo.id}`}
                          className="flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-3 font-semibold shadow-md"
                        >
                          자세히 보기
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            );
          })}
          </Swiper>

          {/* 네비게이션 버튼 */}
          <button
            ref={prevRef}
            className="swiper-button-prev-hot absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-md shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-black/80 transition-all pointer-events-auto"
            aria-label="이전"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            ref={nextRef}
            className="swiper-button-next-hot absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-md shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-black/80 transition-all pointer-events-auto"
            aria-label="다음"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* 하단 안내 문구 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 text-sm text-muted-foreground"
        >
          <p>실시간으로 업데이트되는 인기 순위입니다</p>
        </motion.div>
      </div>
    </section>
  );
}
