"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Heart, Eye, ArrowRight, Flame } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import { cn } from "@/lib/utils";

interface Photo {
  id: string;
  title: string;
  imageUrl: string;
  thumbnailUrl?: string;
  departmentName: string;
  likeCount: number;
  viewCount: number;
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
                    ? "min(640px, 90vw)"
                    : "min(520px, 90vw)",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  {/* 카드 */}
                  <div
                    className={cn(
                      "relative rounded-3xl overflow-hidden glass backdrop-blur-xl shadow-2xl transition-all duration-300 flex flex-col h-auto",
                      config.glow
                    )}
                  >
                    <div className="relative w-full">
                      <div className="relative w-full aspect-[4/3] sm:aspect-video md:h-[420px] overflow-hidden bg-muted/10">
                        {/* 이미지 */}
                        <img
                          src={photo.thumbnailUrl || photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-contain md:object-cover"
                        />

                        {/* TOP 배지 - 우측 상단 */}
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            delay: 0.3 + index * 0.1,
                          }}
                          className={cn(
                            "absolute top-4 right-4 px-5 py-2 rounded-2xl bg-gradient-to-r shadow-2xl flex items-center gap-2 text-white text-sm font-semibold",
                            config.gradient,
                            config.glow
                          )}
                        >
                          <span className="text-xl">{config.emoji}</span>
                          <span>{config.rank}</span>
                        </motion.div>

                        {/* 데스크톱 정보 오버레이 */}
                        <div className="hidden md:flex absolute inset-0 flex-col justify-between p-6 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white pointer-events-none">
                          <div className="flex justify-between items-start pointer-events-auto">
                            <motion.span
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.4 + index * 0.1 }}
                              className={cn(
                                "inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r",
                                config.gradient
                              )}
                            >
                              {photo.departmentName}
                            </motion.span>
                          </div>

                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="space-y-4 pointer-events-auto"
                          >
                            <h3
                              className={cn(
                                "font-bold text-white line-clamp-2",
                                isTopOne ? "text-3xl" : "text-2xl"
                              )}
                            >
                              {photo.title}
                            </h3>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex gap-4 text-white text-base font-semibold pointer-events-auto">
                                <div className="flex items-center gap-2">
                                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                                  <span>{photo.likeCount.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Eye className="w-5 h-5 text-white" />
                                  <span>{photo.viewCount.toLocaleString()}</span>
                                </div>
                              </div>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-white/95 text-primary font-semibold shadow-md pointer-events-auto"
                              >
                                <span>자세히 보기</span>
                                <ArrowRight className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </motion.div>
                        </div>

                        {/* 빛나는 효과 (TOP 1만) */}
                        {isTopOne && (
                          <motion.div
                            className="absolute inset-0 pointer-events-none"
                            animate={{
                              background: [
                                "radial-gradient(circle at 50% 50%, rgba(255, 200, 0, 0.25) 0%, transparent 50%)",
                                "radial-gradient(circle at 50% 50%, rgba(255, 100, 0, 0.25) 0%, transparent 50%)",
                                "radial-gradient(circle at 50% 50%, rgba(255, 200, 0, 0.25) 0%, transparent 50%)",
                              ],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* 모바일 정보 영역 */}
                    <div className="md:hidden p-5 space-y-3 bg-white/95 dark:bg-black/70">
                      <motion.span
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={cn(
                          "inline-block px-4 py-1.5 rounded-full text-white text-sm font-medium bg-gradient-to-r",
                          config.gradient
                        )}
                      >
                        {photo.departmentName}
                      </motion.span>

                      <motion.h3
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="font-bold text-xl line-clamp-2"
                      >
                        {photo.title}
                      </motion.h3>

                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex flex-col gap-3"
                      >
                        <div className="flex gap-4 text-sm font-semibold text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                            <span>{photo.likeCount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-primary" />
                            <span>{photo.viewCount.toLocaleString()}</span>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold shadow-md"
                        >
                          <span>자세히 보기</span>
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    </div>
                  </div>

                  {/* 호버 글로우 */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.5 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "absolute inset-0 pointer-events-none bg-gradient-to-r mix-blend-overlay",
                      config.gradient
                    )}
                  />

                  {/* 외부 글로우 효과 */}
                  <motion.div
                    animate={
                      isTopOne
                        ? {
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.05, 1],
                          }
                        : {}
                    }
                    transition={
                      isTopOne
                        ? {
                            duration: 2,
                            repeat: Infinity,
                          }
                        : {}
                    }
                    className={cn(
                      "absolute inset-0 rounded-3xl blur-2xl -z-10 bg-gradient-to-r",
                      config.gradient,
                      config.glow
                    )}
                  />
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
