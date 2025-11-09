"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // URL 파라미터 확인 (관리자 모드)
    const adminParam = searchParams.get("admin");
    if (adminParam === "syu3454") {
      console.log("[Home] Admin param found:", adminParam);
      localStorage.setItem("adminMode", "true");
      console.log("[Home] Saved to localStorage: adminMode = true");
      alert("관리자 모드 활성화");
      console.log("Admin mode activated");
      // 파라미터를 포함해서 갤러리로 이동
      router.push("/gallery?admin=syu3454");
    } else {
      // 갤러리 페이지로 자동 리다이렉트
      router.push("/gallery");
    }
  }, [router, searchParams]);

  // 리다이렉트 중 로딩 표시
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 dark:from-sky-950 dark:via-purple-950 dark:to-pink-950">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-lg text-muted-foreground">갤러리로 이동 중...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
