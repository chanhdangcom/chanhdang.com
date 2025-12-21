"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
}

export function useUser() {
  const { data, status } = useSession();
  const sessionUser = data?.user;
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);

  // Đọc user từ localStorage (cho login nội bộ)
  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      try {
        const parsed = JSON.parse(userFromStorage) as User;
        setLocalUser(parsed);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoadingLocal(false);
  }, []);

  // Ưu tiên NextAuth session (Google), fallback về localStorage (login nội bộ)
  const user = sessionUser
    ? {
        id: sessionUser.id,
        username: sessionUser.name || sessionUser.email || "",
        displayName: sessionUser.name || undefined,
        avatarUrl: sessionUser.image || undefined,
      }
    : localUser;

  const login = (userData?: User) => {
    if (userData) {
      // Login nội bộ: lưu vào localStorage
      setLocalUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      // Login Google
      signIn("google");
    }
  };

  const logout = () => {
    // Xóa cả NextAuth session và localStorage
    signOut();
    setLocalUser(null);
    localStorage.removeItem("user");
  };

  return {
    user,
    isLoading: status === "loading" || isLoadingLocal,
    login,
    logout,
    isAuthenticated: !!user,
  };
}