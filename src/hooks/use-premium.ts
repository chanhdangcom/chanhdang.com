"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "./use-user";

const STORAGE_KEY = "music_premium_demo";

/**
 * Trạng thái Premium cho Music:
 * - Nếu user đã đăng nhập: đọc/ghi từ backend (/api/music/premium-status, /api/users/:id).
 * - Nếu chưa đăng nhập: dùng localStorage (demo).
 */
export function usePremium() {
  const { user, isAuthenticated } = useUser();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshFromLocal = useCallback(() => {
    if (typeof window === "undefined" || !localStorage) {
      setIsPremium(false);
      setIsLoading(false);
      return;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setIsPremium(raw === "true");
    } catch {
      setIsPremium(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshFromServer = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/music/premium-status", {
        method: "GET",
        cache: "no-store",
      });
      if (!res.ok) {
        refreshFromLocal();
        return;
      }
      const data = (await res.json()) as { isPremium?: boolean };
      setIsPremium(Boolean(data.isPremium));
    } catch {
      refreshFromLocal();
    } finally {
      setIsLoading(false);
    }
  }, [refreshFromLocal]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      void refreshFromServer();
    } else {
      refreshFromLocal();
    }
  }, [isAuthenticated, user?.id, refreshFromLocal, refreshFromServer]);

  useEffect(() => {
    if (typeof window === "undefined" || !localStorage) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setIsPremium(e.newValue === "true");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setPremium = useCallback(
    async (value: boolean) => {
      if (isAuthenticated && user?.id) {
        try {
          const res = await fetch(`/api/users/${encodeURIComponent(user.id)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, isPremium: value }),
          });
          const data = await res.json();
          if (!res.ok || !data?.success) {
            throw new Error(data?.error || "Không thể cập nhật premium");
          }
        } catch (error) {
          console.error("[usePremium] Failed to update premium:", error);
          return;
        }
      } else if (typeof window !== "undefined" && localStorage) {
        localStorage.setItem(STORAGE_KEY, value ? "true" : "false");
      }
      setIsPremium(value);
    },
    [isAuthenticated, user?.id]
  );

  const refresh = useCallback(() => {
    if (isAuthenticated && user?.id) {
      void refreshFromServer();
    } else {
      refreshFromLocal();
    }
  }, [isAuthenticated, user?.id, refreshFromLocal, refreshFromServer]);

  return { isPremium, isLoading, setPremium, refresh };
}
