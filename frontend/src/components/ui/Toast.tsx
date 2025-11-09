"use client";

import { Toaster, toast } from "react-hot-toast";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

// 토스트 프로바이더
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          borderRadius: "0.75rem",
          backdropFilter: "blur(10px)",
        },
        success: {
          iconTheme: {
            primary: "#10B981",
            secondary: "#FFFFFF",
          },
        },
        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: "#FFFFFF",
          },
        },
      }}
    />
  );
}

// 커스텀 토스트 함수들
export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      icon: <CheckCircle className="w-5 h-5" />,
    });
  },

  error: (message: string) => {
    toast.error(message, {
      icon: <XCircle className="w-5 h-5" />,
    });
  },

  info: (message: string) => {
    toast(message, {
      icon: <Info className="w-5 h-5 text-blue-500" />,
    });
  },

  warning: (message: string) => {
    toast(message, {
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  },
};

export default toast;

