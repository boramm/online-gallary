"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Sparkles, ArrowLeft } from "lucide-react";

import ImageDropzone from "@/components/upload/ImageDropzone";
import ImageCropper from "@/components/upload/ImageCropper";
import DepartmentSelect from "@/components/upload/DepartmentSelect";
import AnimatedInput from "@/components/upload/AnimatedInput";
import UploadProgress from "@/components/upload/UploadProgress";

export default function UploadPage() {
  const router = useRouter();

  // 이미지 상태
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  // 폼 데이터
  const [departmentName, setDepartmentName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // 필터 효과
  const [filter, setFilter] = useState("none");

  // 업로드 상태
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const FILTERS = [
    { name: "없음", value: "none", style: {} },
    { name: "빈티지", value: "vintage", style: { filter: "sepia(50%) contrast(1.2)" } },
    { name: "흑백", value: "grayscale", style: { filter: "grayscale(100%)" } },
    { name: "선명", value: "vivid", style: { filter: "saturate(150%) contrast(1.1)" } },
    { name: "부드러움", value: "soft", style: { filter: "brightness(1.1) contrast(0.9)" } },
  ];

  const handleImageSelect = (file: File) => {
    setOriginalFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setShowCropper(true);
  };

  const handleCropComplete = (blob: Blob) => {
    setCroppedBlob(blob);
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    setShowCropper(false);
  };

  const handleRemoveImage = () => {
    setOriginalFile(null);
    setPreviewUrl("");
    setCroppedBlob(null);
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#1E40AF", "#F59E0B", "#3B82F6"],
      });

      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#1E40AF", "#F59E0B", "#3B82F6"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!croppedBlob || !departmentName || !title || !description) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", croppedBlob, originalFile?.name || "image.jpg");
      formData.append("departmentName", departmentName);
      formData.append("title", title);
      formData.append("description", description);

      // 진행률 시뮬레이션
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/photos`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error("업로드 실패");
      }

      const result = await response.json();
      console.log("업로드 성공:", result);

      setIsComplete(true);
      triggerConfetti();

      // 3초 후 목록으로 이동
      setTimeout(() => {
        router.push("/gallery");
      }, 3000);
    } catch (error) {
      console.error("업로드 에러:", error);
      alert("업로드에 실패했습니다. 다시 시도해주세요.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const isFormValid = croppedBlob && departmentName && title && description;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            뒤로 가기
          </button>

          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-gradient">사진 업로드</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            멋진 순간을 공유해보세요
          </p>
        </motion.div>

        {/* 메인 폼 */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6 glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-border"
        >
          {/* 이미지 업로드 */}
          <ImageDropzone
            onImageSelect={handleImageSelect}
            preview={previewUrl}
            onRemove={handleRemoveImage}
            disabled={isUploading}
          />

          {/* 필터 선택 */}
          {previewUrl && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3"
            >
              <label className="block text-sm font-medium">필터 효과</label>
              <div className="grid grid-cols-5 gap-3">
                {FILTERS.map((f) => (
                  <motion.button
                    key={f.value}
                    type="button"
                    onClick={() => setFilter(f.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                      ${
                        filter === f.value
                          ? "border-primary shadow-lg shadow-primary/20"
                          : "border-border hover:border-primary/50"
                      }
                    `}
                  >
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${previewUrl})`,
                        ...f.style,
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {f.name}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* 부서 선택 */}
          <DepartmentSelect value={departmentName} onChange={setDepartmentName} />

          {/* 제목 입력 */}
          <AnimatedInput
            label="제목"
            value={title}
            onChange={setTitle}
            placeholder="사진의 제목을 입력하세요..."
          />

          {/* 설명 입력 */}
          <AnimatedInput
            label="설명"
            value={description}
            onChange={setDescription}
            maxLength={100}
            multiline
            placeholder="사진에 대한 설명을 입력하세요 (최대 100자)"
          />

          {/* 제출 버튼 */}
          <motion.button
            type="submit"
            disabled={!isFormValid || isUploading}
            whileHover={isFormValid && !isUploading ? { scale: 1.02 } : {}}
            whileTap={isFormValid && !isUploading ? { scale: 0.98 } : {}}
            className={`
              w-full py-4 rounded-xl font-semibold text-lg
              transition-all duration-300
              ${
                isFormValid && !isUploading
                  ? "gradient-primary text-white hover-lift shadow-lg shadow-primary/30"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }
            `}
          >
            {isUploading ? "업로드 중..." : "업로드"}
          </motion.button>
        </motion.form>

        {/* 장식 요소 */}
        <div className="fixed top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="fixed bottom-20 left-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10" />
      </div>

      {/* 이미지 크롭 모달 */}
      <AnimatePresence>
        {showCropper && originalFile && (
          <ImageCropper
            image={URL.createObjectURL(originalFile)}
            onCropComplete={handleCropComplete}
            onCancel={() => setShowCropper(false)}
          />
        )}
      </AnimatePresence>

      {/* 업로드 진행 상태 */}
      <AnimatePresence>
        {isUploading && (
          <UploadProgress progress={uploadProgress} isComplete={isComplete} />
        )}
      </AnimatePresence>
    </div>
  );
}

