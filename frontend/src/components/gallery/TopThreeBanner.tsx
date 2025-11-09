"use client";

import { motion } from "framer-motion";
import { Trophy, Heart, Eye } from "lucide-react";
import { useState } from "react";

interface Photo {
  id: string;
  title: string;
  imageUrl: string;
  thumbnailUrl?: string;
  departmentName: string;
  likeCount: number;
  viewCount: number;
}

interface TopThreeBannerProps {
  photos: Photo[];
}

const MEDALS = [
  { rank: 1, color: "from-yellow-400 to-yellow-600", label: "🥇", shadow: "shadow-yellow-500/50" },
  { rank: 2, color: "from-gray-300 to-gray-500", label: "🥈", shadow: "shadow-gray-500/50" },
  { rank: 3, color: "from-amber-600 to-amber-800", label: "🥉", shadow: "shadow-amber-500/50" },
];

export default function TopThreeBanner({ photos }: TopThreeBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const topThree = photos.slice(0, 3);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % topThree.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + topThree.length) % topThree.length);
  };

  if (topThree.length === 0) return null;

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* 타이틀 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl md:text-4xl font-bold">이달의 인기작</h2>
          </div>
          <p className="text-muted-foreground">가장 많은 사랑을 받은 사진들</p>
        </motion.div>

        {/* 슬라이더 */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl">
            <motion.div
              className="flex"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {topThree.map((photo, index) => {
                const medal = MEDALS[index];
                return (
                  <motion.div
                    key={photo.id}
                    className="min-w-full px-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="relative group">
                      {/* 이미지 */}
                      <div className="relative aspect-[21/9] rounded-2xl overflow-hidden glass backdrop-blur-xl shadow-2xl">
                        <img
                          src={photo.thumbnailUrl || photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* 그라데이션 오버레이 */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* 메달 배지 */}
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", delay: 0.3 + index * 0.1 }}
                          className={`absolute top-6 right-6 w-20 h-20 rounded-full bg-gradient-to-br ${medal.color} ${medal.shadow} shadow-2xl flex items-center justify-center text-4xl`}
                        >
                          {medal.label}
                        </motion.div>

                        {/* 정보 */}
                        <div className="absolute bottom-0 left-0 right-0 p-8">
                          <div className="flex items-end justify-between">
                            <div>
                              <span className="inline-block px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm text-primary-foreground text-sm mb-3">
                                {photo.departmentName}
                              </span>
                              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                {photo.title}
                              </h3>
                            </div>
                            
                            {/* 통계 */}
                            <div className="flex gap-6 text-white">
                              <div className="flex items-center gap-2">
                                <Heart className="w-6 h-6 fill-red-500 text-red-500" />
                                <span className="text-2xl font-bold">
                                  {photo.likeCount}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Eye className="w-6 h-6" />
                                <span className="text-2xl font-bold">
                                  {photo.viewCount}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* 네비게이션 버튼 */}
          {topThree.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass backdrop-blur-xl hover:bg-white/20 transition-colors"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass backdrop-blur-xl hover:bg-white/20 transition-colors"
              >
                →
              </button>
            </>
          )}

          {/* 인디케이터 */}
          {topThree.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {topThree.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

