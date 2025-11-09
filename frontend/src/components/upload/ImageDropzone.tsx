"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, X } from "lucide-react";

interface ImageDropzoneProps {
  onImageSelect: (file: File) => void;
  preview?: string;
  onRemove?: () => void;
  disabled?: boolean;
}

export default function ImageDropzone({
  onImageSelect,
  preview,
  onRemove,
  disabled = false,
}: ImageDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onImageSelect(acceptedFiles[0]);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp", ".heic"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled,
  });

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!preview ? (
          <div
            key="dropzone"
            {...getRootProps()}
            className={`
              relative overflow-hidden rounded-2xl border-2 border-dashed p-12
              cursor-pointer transition-all duration-300
              ${
                isDragActive
                  ? "border-primary bg-primary/5 scale-105"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              }
              glass backdrop-blur-xl
            `}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div
                animate={{
                  y: isDragActive ? -10 : 0,
                  scale: isDragActive ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-6 rounded-full bg-gradient-primary"
              >
                {isDragActive ? (
                  <ImageIcon className="w-12 h-12 text-white" />
                ) : (
                  <Upload className="w-12 h-12 text-white" />
                )}
              </motion.div>

              <div className="space-y-2">
                <p className="text-xl font-semibold">
                  {isDragActive
                    ? "여기에 놓으세요!"
                    : "이미지를 드래그하거나 클릭하세요"}
                </p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG, WebP, HEIC (최대 10MB)
                </p>
              </div>

              {!isDragActive && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-lg gradient-accent text-white font-semibold hover-lift"
                  type="button"
                >
                  파일 선택
                </motion.button>
              )}
            </div>

            {/* 장식 요소 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -z-10" />
          </div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative rounded-2xl overflow-hidden glass backdrop-blur-xl shadow-xl"
          >
            <img
              src={preview}
              alt="미리보기"
              className="w-full h-[400px] object-cover"
            />

            {onRemove && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onRemove}
                className="absolute top-4 right-4 p-3 rounded-full bg-red-500/90 text-white backdrop-blur-sm hover:bg-red-600 transition-colors shadow-lg"
                type="button"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}

            {/* 이미지 오버레이 효과 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

