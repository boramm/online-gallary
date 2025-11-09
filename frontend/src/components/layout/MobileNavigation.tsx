"use client";

import { motion } from "framer-motion";
import { Home, ImagePlus, Heart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/gallery", icon: Heart, label: "갤러리" },
  { href: "/upload", icon: ImagePlus, label: "업로드" },
  { href: "/profile", icon: User, label: "프로필" },
];

export default function MobileNavigation() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      {/* 그라데이션 배경 */}
      <div className="glass backdrop-blur-xl border-t border-border">
        <div className="px-4 py-2">
          <div className="flex items-center justify-around">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className={`
                      relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl
                      transition-colors
                      ${
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    {/* 활성 인디케이터 */}
                    {isActive && (
                      <motion.div
                        layoutId="mobile-nav-indicator"
                        className="absolute inset-0 bg-primary/10 rounded-xl"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* 아이콘 */}
                    <Icon
                      className={`w-6 h-6 relative z-10 ${
                        isActive ? "fill-primary/20" : ""
                      }`}
                    />

                    {/* 라벨 */}
                    <span className="text-xs font-medium relative z-10">
                      {item.label}
                    </span>

                    {/* 활성 점 */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 w-1 h-1 bg-primary rounded-full"
                      />
                    )}
                  </motion.button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 하단 Safe Area (iOS) */}
      <div className="h-safe-area-inset-bottom bg-background/80" />
    </motion.nav>
  );
}

