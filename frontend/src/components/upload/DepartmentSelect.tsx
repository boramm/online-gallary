"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface DepartmentSelectProps {
  value: string;
  onChange: (value: string) => void;
}

// 추천 색상 팔레트
const COLOR_PALETTE = [
  "#3B82F6", // 파랑
  "#8B5CF6", // 보라
  "#EC4899", // 핑크
  "#F59E0B", // 주황
  "#10B981", // 초록
  "#EF4444", // 빨강
  "#06B6D4", // 청록
  "#F97316", // 오렌지
];

export default function DepartmentSelect({
  value,
  onChange,
}: DepartmentSelectProps) {
  const [color, setColor] = useState(COLOR_PALETTE[0]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium mb-2">부서명</label>

      {/* 부서명 입력 */}
      <div className="relative">
        <motion.div whileHover={{ scale: 1.01 }} className="relative">
          {/* 색상 인디케이터 */}
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
            style={{ backgroundColor: color }}
          />

          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder="부서명 입력 (예: 교무처 학사지원팀)"
            className="w-full pl-12 pr-16 py-4 rounded-xl glass backdrop-blur-xl border border-border hover:border-primary/50 focus:border-primary focus:outline-none transition-all font-medium"
            maxLength={20}
          />
        </motion.div>

        {/* 글자 수 카운터 */}
        {value && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground"
          >
            {value.length}/20
          </motion.div>
        )}
      </div>

      {/* 색상 선택 */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground font-medium">
          부서 색상 선택
        </label>
        <div className="flex gap-2 flex-wrap">
          {COLOR_PALETTE.map((paletteColor, index) => (
            <motion.button
              key={paletteColor}
              type="button"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setColor(paletteColor)}
              className={`w-10 h-10 rounded-xl transition-all ${
                color === paletteColor
                  ? "ring-2 ring-offset-2 ring-primary shadow-lg"
                  : "hover:ring-2 hover:ring-offset-2 hover:ring-border"
              }`}
              style={{ backgroundColor: paletteColor }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {color === paletteColor && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
