import type { Metadata, Viewport } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/Toast";
import ScrollTopButton from "@/components/ui/ScrollTopButton";
import { AdminProvider } from "@/contexts/AdminContext";

// Viewport 설정 분리 (Next.js 14+ 요구사항)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "시선이 잇(있)는 날 | 온라인 갤러리",
    template: "%s | 시선이 잇(있)는 날",
  },
  description: "부서별 사진을 공유하고 소통하는 온라인 갤러리. 일상의 특별한 순간을 함께 나눠보세요.",
  keywords: ["온라인갤러리", "사진공유", "포토갤러리", "시선이잇는날", "부서사진"],
  authors: [{ name: "시선이 잇(있)는 날" }],
  creator: "시선이 잇(있)는 날",
  publisher: "시선이 잇(있)는 날",
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://your-domain.vercel.app",
    title: "시선이 잇(있)는 날 | 온라인 갤러리",
    description: "부서별 사진을 공유하고 소통하는 온라인 갤러리",
    siteName: "시선이 잇(있)는 날",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "시선이 잇(있)는 날 갤러리",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "시선이 잇(있)는 날 | 온라인 갤러리",
    description: "부서별 사진을 공유하고 소통하는 온라인 갤러리",
    images: ["/og-image.jpg"],
    creator: "@your_twitter",
  },

  // Icons
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // Manifest
  manifest: "/manifest.json",

  // Verification (Google Search Console)
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased cursor-default" style={{ fontFamily: 'Pretendard Variable, -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AdminProvider>
            {children}
            <ToastProvider />
            <ScrollTopButton />
          </AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
