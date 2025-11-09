"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PhotoDetailModal from "@/components/gallery/PhotoDetailModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Photo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  departmentName: string;
  uploadDate: string;
  likeCount: number;
  viewCount: number;
  commentCount: number;
}

export default function PhotoPage() {
  const params = useParams();
  const router = useRouter();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_URL}/photos/${params.id}`);
        if (!response.ok) throw new Error("사진을 찾을 수 없습니다");
        const result = await response.json();
        setPhoto(result.data || result);
      } catch (error) {
        console.error(error);
        router.push("/404");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPhoto();
    }
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="사진을 불러오는 중..." />
      </div>
    );
  }

  if (!photo) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* 배경 그라데이션 */}
      <div className="fixed inset-0 bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 dark:from-sky-950 dark:via-purple-950 dark:to-pink-950 -z-10" />

      {/* 뒤로가기 버튼 */}
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          갤러리로 돌아가기
        </button>
      </div>

      {/* 모달 (항상 열림) */}
      <PhotoDetailModal
        photo={photo}
        isOpen={true}
        onClose={() => router.push("/gallery")}
        allPhotos={[photo]}
        onNavigate={() => {}}
      />
    </div>
  );
}

