"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "./use-user";

const STORAGE_KEY = "music_premium_demo";

/**
 * Trạng thái Premium cho Music:
 * - Nếu user đã đăng nhập: đọc/ghi từ backend (/api/music/premium-status, /api/users/:id).
 * - Nếu chưa đăng nhập: dùng localStorage (demo).
 */
const STORAGE_KEY_CREATOR = "music_premium_creator_demo";

export function usePremium() {
  const { user, isAuthenticated } = useUser();
  const [isPremium, setIsPremium] = useState(false);
  const [isPremiumCreator, setIsPremiumCreator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshFromLocal = useCallback(() => {
    if (typeof window === "undefined" || !localStorage) {
      setIsPremium(false);
      setIsPremiumCreator(false);
      setIsLoading(false);
      return;
    }
    try {
      setIsPremium(localStorage.getItem(STORAGE_KEY) === "true");
      setIsPremiumCreator(localStorage.getItem(STORAGE_KEY_CREATOR) === "true");
    } catch {
      setIsPremium(false);
      setIsPremiumCreator(false);
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
      const data = (await res.json()) as {
        isPremium?: boolean;
        isPremiumCreator?: boolean;
      };
      setIsPremium(Boolean(data.isPremium));
      setIsPremiumCreator(Boolean(data.isPremiumCreator));
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
      if (e.key === STORAGE_KEY_CREATOR)
        setIsPremiumCreator(e.newValue === "true");
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

  const setPremiumCreator = useCallback(
    async (value: boolean) => {
      if (isAuthenticated && user?.id) {
        try {
          const res = await fetch(`/api/users/${encodeURIComponent(user.id)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              isPremiumCreator: value,
              ...(value ? { isPremium: true } : {}),
            }),
          });
          const data = await res.json();
          if (!res.ok || !data?.success) {
            throw new Error(
              data?.error || "Không thể cập nhật premium creator"
            );
          }
        } catch (error) {
          console.error("[usePremium] Failed to update premium creator:", error);
          return;
        }
      } else if (typeof window !== "undefined" && localStorage) {
        localStorage.setItem(STORAGE_KEY_CREATOR, value ? "true" : "false");
        if (value) localStorage.setItem(STORAGE_KEY, "true");
      }
      setIsPremiumCreator(value);
      if (value) setIsPremium(true);
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

  return {
    isPremium,
    isPremiumCreator,
    isLoading,
    setPremium,
    setPremiumCreator,
    refresh,
  };
}
