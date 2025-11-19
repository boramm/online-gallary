"use client";

import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-css";

import dynamic from "next/dynamic";
import HeroSection from "@/components/gallery/HeroSection";
import RealTimeHotBanner from "@/components/gallery/RealTimeHotBanner";
import FilterBar from "@/components/gallery/FilterBar";
import PhotoCard from "@/components/gallery/PhotoCard";
import MobileNavigation from "@/components/layout/MobileNavigation";
import EmptyState from "@/components/ui/EmptyState";

// Dynamic import로 코드 스플리팅
const PhotoDetailModal = dynamic(
  () => import("@/components/gallery/PhotoDetailModal"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    ),
  }
);

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

function GalleryPageContent() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // 데이터 상태
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [topPhotos, setTopPhotos] = useState<Photo[]>([]);
  const [departments, setDepartments] = useState<string[]>([]); // 부서 목록
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // 필터 상태 (URL에서 초기화)
  const [selectedDepartment, setSelectedDepartment] = useState(
    searchParams.get("dept") || "전체"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "latest");
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") || ""
  );

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 모달 상태
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadDepartments(); // 부서 목록 로드
  }, []);

  // URL 쿼리 파라미터 업데이트
  useEffect(() => {
    if (!mounted) return;

    const params = new URLSearchParams();
    if (selectedDepartment !== "전체") {
      params.set("dept", selectedDepartment);
    }
    if (sortBy !== "latest") {
      params.set("sort", sortBy);
    }
    if (searchQuery) {
      params.set("q", searchQuery);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `/gallery?${queryString}` : "/gallery";
    router.replace(newUrl, { scroll: false });
  }, [selectedDepartment, sortBy, searchQuery, mounted, router]);

  // 초기 데이터 로드
  useEffect(() => {
    loadInitialData();
  }, []);

  // 필터/정렬 변경 시 데이터 리로드
  useEffect(() => {
    loadPhotos(1, true);
  }, [selectedDepartment, sortBy, searchQuery]);

  // 부서 목록 로드
  const loadDepartments = async () => {
    try {
      const response = await fetch("http://localhost:3001/photos/departments");
      if (response.ok) {
        const result = await response.json();
        setDepartments(result.data || []);
      }
    } catch (error) {
      console.error("부서 목록 로드 실패:", error);
    }
  };

  const loadInitialData = async () => {
    try {
      // TOP 3 로드
      const topResponse = await fetch(
        "http://localhost:3001/photos?page=1&limit=3"
      );
      if (topResponse.ok) {
        const topResult = await topResponse.json();
        setTopPhotos(topResult.data || []);
      }

      // 일반 사진 로드
      await loadPhotos(1, true);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  };

  const loadPhotos = async (pageNum: number, reset = false) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "12",
      });

      if (selectedDepartment !== "전체") {
        params.append("departmentName", selectedDepartment);
      }

      // 정렬은 백엔드에서 지원 시 추가
      // params.append("sortBy", sortBy);

      const response = await fetch(
        `http://localhost:3001/photos?${params.toString()}`
      );

      if (response.ok) {
        const result = await response.json();
        const newPhotos = result.data || [];

        if (reset) {
          setPhotos(newPhotos);
          setPage(1);
        } else {
          setPhotos((prev) => [...prev, ...newPhotos]);
        }

        setHasMore(newPhotos.length >= 12);
      }
    } catch (error) {
      console.error("사진 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPhotos(nextPage);
  };

  // 사진 클릭 시 모달 열기
  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  // 모달에서 다른 사진으로 이동
  const handleNavigatePhoto = (photoId: string) => {
    const photo = sortedPhotos.find((p) => p.id === photoId);
    if (photo) {
      setSelectedPhoto(photo);
    }
  };

  // 검색 필터링 (클라이언트 사이드)
  const filteredPhotos = photos.filter((photo) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      photo.title.toLowerCase().includes(query) ||
      photo.description.toLowerCase().includes(query)
    );
  });

  // 정렬 (클라이언트 사이드)
  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.likeCount - a.likeCount;
      case "views":
        return b.viewCount - a.viewCount;
      case "latest":
      default:
        return (
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        );
    }
  });

  // Masonry 브레이크포인트 (반응형)
  const breakpointColumns = {
    default: 4,    // Desktop: 4열
    1536: 3,       // Large: 3열
    1024: 2,       // Tablet: 2열
    768: 1,        // Mobile: 1열
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen relative pb-20 md:pb-0">
      {/* 그라데이션 배경 */}
      <div className="fixed inset-0 bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 dark:from-sky-950 dark:via-purple-950 dark:to-pink-950 -z-10" />

      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-gradient"
          >
            시선이 있는날
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-white font-semibold hover-lift"
              >
                <Plus className="w-5 h-5" />
                업로드
              </motion.button>
            </Link>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg glass hover:bg-accent/10 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-accent" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="pt-16">
        {/* 히어로 섹션 */}
        <HeroSection />

        {/* 실시간 HOT 3 배너 */}
        {topPhotos.length > 0 && <RealTimeHotBanner photos={topPhotos} />}

        {/* 필터 바 */}
        <FilterBar
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalCount={sortedPhotos.length}
          departments={departments}
        />

        {/* 사진 그리드 */}
        <div className="container mx-auto max-w-6xl px-4 py-12">
          {/* 결과 카운터 */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-center"
          >
            <p className="text-lg font-semibold text-foreground">
              현재{" "}
              <span className="text-primary font-bold">
                {sortedPhotos.length}
              </span>
              개 사진 보는 중
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedDepartment !== "전체" && (
                <span className="font-medium text-primary">
                  {selectedDepartment}
                </span>
              )}
              {selectedDepartment !== "전체" && searchQuery && " · "}
              {searchQuery && (
                <span>
                  검색: &quot;
                  <span className="font-medium text-primary">
                    {searchQuery}
                  </span>
                  &quot;
                </span>
              )}
            </p>
          </motion.div>

          <InfiniteScroll
            dataLength={sortedPhotos.length}
            next={loadMore}
            hasMore={hasMore && !searchQuery}
            loader={
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            }
            endMessage={
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-muted-foreground"
              >
                모든 사진을 보셨습니다 ✨
              </motion.p>
            }
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedDepartment}-${sortBy}-${searchQuery}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Masonry
                  breakpointCols={breakpointColumns}
                  className="flex -ml-4 w-auto"
                  columnClassName="pl-4 bg-clip-padding"
                >
                  {sortedPhotos.map((photo, index) => (
                    <motion.div
                      key={photo.id}
                      className="mb-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                      }}
                    >
                      <PhotoCard
                        photo={photo}
                        onClick={() => handlePhotoClick(photo)}
                      />
                    </motion.div>
                  ))}
                </Masonry>
              </motion.div>
            </AnimatePresence>
          </InfiniteScroll>

          {/* 빈 상태 */}
          {sortedPhotos.length === 0 && !isLoading && (
            searchQuery ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <h3 className="text-2xl font-bold mb-4">검색 결과가 없습니다</h3>
                <p className="text-muted-foreground mb-8">
                  다른 검색어로 시도해보세요
                </p>
              </motion.div>
            ) : (
              <EmptyState
                title="아직 사진이 없어요"
                description="첫 번째 멋진 사진을 공유해보세요! 📸"
                actionLabel="사진 업로드하기"
                actionHref="/upload"
                icon="camera"
              />
            )
          )}
        </div>

        {/* 사진 상세보기 모달 */}
        <PhotoDetailModal
          photo={selectedPhoto}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          allPhotos={sortedPhotos}
          onNavigate={handleNavigatePhoto}
        />

        {/* 모바일 네비게이션 */}
        <MobileNavigation />
      </div>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
          필터 정보를 불러오는 중입니다...
        </div>
      }
    >
      <GalleryPageContent />
    </Suspense>
  );
}
