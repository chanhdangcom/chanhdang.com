"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra user từ localStorage
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      try {
        const userData = JSON.parse(userFromStorage);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
