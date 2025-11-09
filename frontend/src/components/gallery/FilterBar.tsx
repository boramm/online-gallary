"use client";

import { motion } from "framer-motion";
import { Search, Clock, Eye, X, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const COLORS = [
  "#1E40AF", "#F59E0B", "#10B981", "#EF4444", 
  "#8B5CF6", "#3B82F6", "#EC4899", "#06B6D4"
];

const SORT_OPTIONS = [
  { value: "latest", label: "최신순", icon: Clock },
  { value: "views", label: "조회순", icon: Eye },
];

interface FilterBarProps {
  selectedDepartment: string;
  onDepartmentChange: (dept: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount?: number;
  departments?: string[]; // 실제 부서 목록
}

export default function FilterBar({
  selectedDepartment,
  onDepartmentChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  totalCount = 0,
  departments = [],
}: FilterBarProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const sortContainerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState({ x: 4, width: 0 });

  // 부서 목록에 색상 매핑
  const departmentsWithColors = [
    { name: "전체", color: "#6B7280" },
    ...departments.map((name, index) => ({
      name,
      color: COLORS[index % COLORS.length],
    })),
  ];

  // 슬라이더 위치 계산
  useEffect(() => {
    if (sortContainerRef.current) {
      const container = sortContainerRef.current;
      const buttons = container.querySelectorAll('button');
      const selectedIndex = SORT_OPTIONS.findIndex(opt => opt.value === sortBy);
      
      if (buttons[selectedIndex]) {
        const button = buttons[selectedIndex] as HTMLElement;
        const containerRect = container.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        
        const x = buttonRect.left - containerRect.left + 4; // gap 고려
        const width = buttonRect.width - 8; // 양쪽 gap 제거
        
        setSliderPosition({ x, width });
      }
    }
  }, [sortBy]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-20 z-50 py-6 px-4 glass backdrop-blur-xl border-b border-border"
    >
      <div className="container mx-auto max-w-6xl space-y-4">
        {/* 부서 필터 */}
        <div className="flex flex-wrap gap-2">
          {departmentsWithColors.map((dept) => {
            const isSelected = selectedDepartment === dept.name;
            return (
              <motion.button
                key={dept.name}
                onClick={() => onDepartmentChange(dept.name)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-4 py-2 rounded-full font-medium transition-all
                  ${
                    isSelected
                      ? "text-white shadow-lg"
                      : "glass hover:shadow-md"
                  }
                `}
                style={{
                  backgroundColor: isSelected ? dept.color : undefined,
                  borderColor: dept.color,
                  borderWidth: isSelected ? 0 : 2,
                }}
              >
                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: dept.color }}
                    />
                  )}
                  <span>{dept.name}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* 검색 & 정렬 */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* 검색창 */}
          <div className="flex-1 relative">
            <motion.div
              animate={{
                scale: isSearchFocused ? 1.02 : 1,
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="제목이나 설명으로 검색하세요..."
                className="w-full pl-12 pr-12 py-3 rounded-xl glass backdrop-blur-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onSearchChange("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* 정렬 토글 - iOS 스타일 */}
          <div 
            ref={sortContainerRef}
            className="flex gap-1 glass backdrop-blur-xl rounded-2xl p-2 relative"
          >
            {/* 슬라이딩 배경 */}
            <motion.div
              layoutId="sort-indicator"
              className="absolute bg-primary rounded-xl shadow-lg"
              initial={false}
              animate={{
                x: sliderPosition.x,
                width: sliderPosition.width || "calc(50% - 6px)",
                height: "calc(100% - 16px)",
                top: "8px",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            />

            {SORT_OPTIONS.map((option, index) => {
              const isSelected = sortBy === option.value;
              const Icon = option.icon;
              return (
                <motion.button
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative z-10 px-4 py-2 rounded-xl font-medium transition-colors
                    flex items-center gap-2 flex-1 justify-center
                    ${
                      isSelected
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  `}
                  style={{
                    minWidth: "100px",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">
                    {option.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 활성 필터 표시 */}
        {(selectedDepartment !== "전체" || searchQuery) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <span>활성 필터:</span>
            {selectedDepartment !== "전체" && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1 rounded-full glass flex items-center gap-2"
              >
                {selectedDepartment}
                <button
                  onClick={() => onDepartmentChange("전체")}
                  className="hover:text-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            )}
            {searchQuery && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1 rounded-full glass flex items-center gap-2"
              >
                &quot;{searchQuery}&quot;
                <button
                  onClick={() => onSearchChange("")}
                  className="hover:text-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

