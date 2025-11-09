"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminContextType {
  isAdmin: boolean;
  checkAdminStatus: () => void;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  // 관리자 상태 확인 (localStorage에서)
  const checkAdminStatus = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("adminMode");
      const adminStatus = stored === "true";
      console.log("[AdminContext] checkAdminStatus - adminMode:", stored, "isAdmin:", adminStatus);
      setIsAdmin(adminStatus);
    }
  };

  // 관리자 로그인 (localStorage에 저장)
  const login = (password: string): boolean => {
    if (password === "syu3454") {
      if (typeof window !== "undefined") {
        localStorage.setItem("adminMode", "true");
        setIsAdmin(true);
        return true;
      }
    }
    return false;
  };

  // 관리자 로그아웃 (localStorage에서 제거)
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminMode");
      setIsAdmin(false);
    }
  };

  // 컴포넌트 마운트 시 관리자 상태 확인
  useEffect(() => {
    checkAdminStatus();
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, checkAdminStatus, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}

