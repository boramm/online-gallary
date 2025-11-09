"use client";

import { Heart, Eye, ArrowRight, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

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
  comments?: any[];
}

interface RealTimeHotBannerProps {
  photos: Photo[];
  onPhotoClick?: (photo: Photo) => void;
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

export default function RealTimeHotBanner({ photos, onPhotoClick }: RealTimeHotBannerProps) {
  const topThree = photos.slice(0, 3);

  if (topThree.length === 0) return null;

  const currentTime = new Date().toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section className="relative py-12 px-4 overflow-hidden">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-red-900/20 dark:from-purple-950/40 dark:via-pink-950/40 dark:to-red-950/40" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Flame className="w-8 h-8 text-orange-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-gradient">
              실시간 HOT 3
            </h2>
            <Flame className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-muted-foreground">지금 가장 인기있는 사진</p>
          <p className="text-xs text-muted-foreground mt-2">
            {currentTime} 기준 좋아요 순
          </p>
        </div>

        {/* Swiper 컨테이너 */}
        <div className="relative">
          {/* 이전 버튼 */}
          <button
            className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110"
            aria-label="이전 사진"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* 다음 버튼 */}
          <button
            className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110"
            aria-label="다음 사진"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Swiper */}
          <Swiper
            modules={[Autoplay, Navigation]}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            initialSlide={0}
            spaceBetween={30}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            loop={false}
            className="!pb-12"
          >
          {topThree.map((photo, index) => {
            const config = RANK_CONFIG[index];
            const isTopOne = index === 0;

            return (
              <SwiperSlide
                key={photo.id}
                className={`!w-[${isTopOne ? "600px" : "500px"}] md:!w-[${
                  isTopOne ? "700px" : "600px"
                }]`}
                style={{
                  width: isTopOne ? "600px" : "500px",
                }}
              >
                <div className="relative group">
                  {/* 카드 */}
                  <div
                    className={`
                    relative rounded-3xl overflow-hidden glass backdrop-blur-xl 
                    shadow-2xl ${config.glow} transition-all duration-300
                    ${isTopOne ? "h-[400px]" : "h-[350px]"}
                  `}
                  >
                    {/* 이미지 */}
                    <img
                      src={photo.thumbnailUrl || photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />

                    {/* 그라데이션 오버레이 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    {/* TOP 배지 - 우측 상단 */}
                    <div
                      className={`
                        absolute top-6 right-6 px-6 py-3 rounded-2xl
                        bg-gradient-to-r ${config.gradient}
                        shadow-2xl ${config.glow}
                        flex items-center gap-2
                      `}
                    >
                      <span className="text-3xl">{config.emoji}</span>
                      <span className="text-white font-bold text-xl">
                        {config.rank}
                      </span>
                    </div>

                    {/* 정보 */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                      {/* 부서명 */}
                      <span
                        className={`
                          inline-block px-4 py-1.5 rounded-full text-white text-sm font-medium
                          bg-gradient-to-r ${config.gradient}
                        `}
                      >
                        {photo.departmentName}
                      </span>

                      {/* 제목 */}
                      <h3
                        className={`text-white font-bold line-clamp-2 ${
                          isTopOne ? "text-3xl" : "text-2xl"
                        }`}
                      >
                        {photo.title}
                      </h3>

                      {/* 통계 + 버튼 */}
                      <div className="flex items-center justify-between">
                        {/* 통계 */}
                        <div className="flex gap-4 text-white">
                          <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                            <span className="text-lg font-bold">
                              {(photo.likeCount || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            <span className="text-lg font-bold">
                              {(photo.viewCount || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* 자세히 보기 버튼 */}
                        <button
                          onClick={() => onPhotoClick?.(photo)}
                          className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg
                            bg-white/20 backdrop-blur-sm hover:bg-white/30
                            text-white font-semibold transition-all
                          `}
                        >
                          <span>자세히</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        </div>

        {/* 하단 안내 문구 */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>실시간으로 업데이트되는 인기 순위입니다</p>
        </div>
      </div>
    </section>
  );
}

