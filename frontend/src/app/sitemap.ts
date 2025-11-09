import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.vercel.app";

  // API에서 모든 사진 가져오기
  let photos: any[] = [];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/photos`, {
      next: { revalidate: 3600 }, // 1시간마다 재검증
    });
    if (response.ok) {
      const result = await response.json();
      photos = result.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch photos for sitemap:", error);
  }

  // 정적 페이지
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/upload`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  // 동적 사진 페이지
  const photoRoutes = photos.map((photo) => ({
    url: `${baseUrl}/photo/${photo.id}`,
    lastModified: new Date(photo.uploadDate),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...routes, ...photoRoutes];
}

