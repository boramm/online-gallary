"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface AnimatedInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  multiline?: boolean;
  placeholder?: string;
}

export default function AnimatedInput({
  label,
  value,
  onChange,
  maxLength,
  multiline = false,
  placeholder = "",
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const percentage = maxLength ? (value.length / maxLength) * 100 : 0;

  const InputComponent = multiline ? "textarea" : "input";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">{label}</label>
        {maxLength && (
          <div className="flex items-center gap-2">
            <span
              className={`text-sm transition-colors ${
                value.length >= maxLength
                  ? "text-red-500 font-semibold"
                  : value.length >= maxLength * 0.8
                  ? "text-amber-500"
                  : "text-muted-foreground"
              }`}
            >
              {value.length} / {maxLength}
            </span>
          </div>
        )}
      </div>

      <div className="relative">
        <motion.div
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <InputComponent
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={maxLength}
            placeholder={placeholder}
            className={`
              w-full px-4 py-3 rounded-xl
              glass backdrop-blur-xl border border-border
              focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
              transition-all duration-300
              ${multiline ? "min-h-[120px] resize-none" : ""}
            `}
            rows={multiline ? 4 : undefined}
          />
        </motion.div>

        {/* 애니메이션 플레이스홀더 */}
        {!hasValue && !isFocused && placeholder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none flex items-start px-4 py-3"
          >
            <motion.span
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-muted-foreground"
            >
              {placeholder}
            </motion.span>
          </motion.div>
        )}

        {/* 포커스 테두리 효과 */}
        {isFocused && (
          <motion.div
            layoutId="input-focus"
            className="absolute inset-0 rounded-xl border-2 border-primary pointer-events-none"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </div>

      {/* 프로그레스 바 */}
      {maxLength && value.length > 0 && (
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 100 }}
            className={`h-full transition-colors duration-300 ${
              percentage >= 100
                ? "bg-red-500"
                : percentage >= 80
                ? "bg-amber-500"
                : "bg-gradient-primary"
            }`}
          />
        </div>
      )}
    </div>
  );
}

