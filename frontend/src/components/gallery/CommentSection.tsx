"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";
import Image from "next/image";
import { generateRandomNickname, getAvatarUrl } from "@/lib/nickname-generator";
import { getRelativeTime } from "@/lib/time-formatter";
import { showToast } from "@/components/ui/Toast";

interface Comment {
  id: string;
  nickname: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  photoId: string;
  comments: Comment[];
  onCommentAdded: (comment: Comment) => void;
}

export default function CommentSection({
  photoId,
  comments,
  onCommentAdded,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 컴포넌트 마운트 시 닉네임 생성 (로컬스토리지에 저장)
  useEffect(() => {
    const storedNickname = localStorage.getItem("userNickname");
    if (storedNickname) {
      setNickname(storedNickname);
    } else {
      const newNickname = generateRandomNickname();
      setNickname(newNickname);
      localStorage.setItem("userNickname", newNickname);
    }
  }, []);

  // Textarea 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newComment]);

  // 댓글 작성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setError("댓글 내용을 입력해주세요.");
      return;
    }

    if (newComment.length > 200) {
      setError("댓글은 200자 이내로 작성해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          photoId,
          nickname,
          content: newComment.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "댓글 작성에 실패했습니다.");
      }

      const createdComment = await response.json();
      
      // 부모 컴포넌트에 새 댓글 전달
      onCommentAdded(createdComment);
      
      // 입력 필드 초기화
      setNewComment("");
      
      // Textarea 높이 리셋
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      // 성공 토스트
      showToast.success("댓글이 작성되었습니다! 💬");
    } catch (err: any) {
      setError(err.message || "댓글 작성에 실패했습니다.");
      showToast.error(err.message || "댓글 작성에 실패했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 닉네임 변경
  const handleChangeNickname = () => {
    const newNickname = generateRandomNickname();
    setNickname(newNickname);
    localStorage.setItem("userNickname", newNickname);
  };

  const remainingChars = 200 - newComment.length;

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">
          댓글 <span className="text-primary">{comments.length}</span>
        </h3>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-3 mb-6">
        <AnimatePresence initial={false}>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  delay: index * 0.05,
                }}
                className="flex gap-3"
              >
                {/* 아바타 */}
                <div className="flex-shrink-0 relative w-10 h-10">
                  <Image
                    src={getAvatarUrl(comment.nickname)}
                    alt={comment.nickname}
                    width={40}
                    height={40}
                    className="rounded-full bg-muted"
                    unoptimized
                  />
                </div>

                {/* 말풍선 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-foreground">
                      {comment.nickname}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {getRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="glass backdrop-blur-sm p-3 rounded-2xl rounded-tl-none"
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground text-sm">
                아직 댓글이 없습니다.
              </p>
              <p className="text-muted-foreground text-sm">
                첫 댓글을 남겨보세요! 💬
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 댓글 작성 폼 */}
      <form onSubmit={handleSubmit} className="sticky bottom-0 bg-background pt-4 border-t border-border">
        {/* 현재 닉네임 표시 */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative w-8 h-8">
            <Image
              src={getAvatarUrl(nickname)}
              alt={nickname}
              width={32}
              height={32}
              className="rounded-full bg-muted"
              unoptimized
            />
          </div>
          <span className="text-sm font-medium">{nickname}</span>
          <button
            type="button"
            onClick={handleChangeNickname}
            className="text-xs text-primary hover:underline"
          >
            변경
          </button>
        </div>

        {/* 입력창 */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요... (최대 200자)"
            disabled={isSubmitting}
            className="w-full px-4 py-3 pr-24 rounded-xl glass border border-border 
              focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
              resize-none min-h-[60px] max-h-[150px] transition-all"
            rows={1}
          />
          
          {/* 글자 수 카운터 + 전송 버튼 */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            {/* 글자 수 카운터 */}
            <span
              className={`text-xs font-medium transition-colors ${
                remainingChars < 20
                  ? "text-red-500"
                  : remainingChars < 50
                  ? "text-yellow-500"
                  : "text-muted-foreground"
              }`}
            >
              {remainingChars}
            </span>

            {/* 전송 버튼 */}
            <motion.button
              type="submit"
              disabled={isSubmitting || !newComment.trim() || newComment.length > 200}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg gradient-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* 글자 수 프로그레스 바 */}
        <div className="w-full h-1 bg-muted rounded-full mt-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(newComment.length / 200) * 100}%` }}
            transition={{ duration: 0.2 }}
            className={`h-full transition-colors ${
              remainingChars < 20
                ? "bg-red-500"
                : remainingChars < 50
                ? "bg-yellow-500"
                : "bg-primary"
            }`}
          />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-xs mt-2"
          >
            {error}
          </motion.p>
        )}
      </form>
    </div>
  );
}

