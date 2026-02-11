"use client";

import { useCallback, useEffect, useState } from "react";
import { IPlaylistItem } from "../type/playlist";
import { Plus, CheckCircle } from "@phosphor-icons/react/dist/ssr";

type LibraryPlaylistButtonProps = {
  playlist: IPlaylistItem;
  userId?: string;
};

export function LibraryPlaylistButton({
  playlist,
  userId,
}: LibraryPlaylistButtonProps) {
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId || !playlist?.id) return;

    const checkLibrary = async () => {
      try {
        const response = await fetch(
          `/api/library?userId=${userId}&type=playlist`
        );
        if (!response.ok) return;
        const entries = await response.json();
        const matched = entries.some(
          (entry: { resourceId: string }) => entry.resourceId === playlist.id
        );
        setIsInLibrary(matched);
      } catch (error) {
        console.error("Error checking playlist library state:", error);
      }
    };

    void checkLibrary();
  }, [playlist.id, userId]);

  const handleToggleLibrary = useCallback(async () => {
    if (!userId) {
      alert("Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }

    if (!playlist?.id) return;

    setIsLoading(true);
    try {
      if (isInLibrary) {
        const response = await fetch(
          `/api/library?userId=${userId}&resourceId=${playlist.id}&type=playlist`,
          { method: "DELETE" }
        );
        if (response.ok) {
          setIsInLibrary(false);
        } else {
          const error = await response.json();
          alert(error.error || "Có lỗi xảy ra!");
        }
      } else {
        const response = await fetch("/api/library", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            resourceId: playlist.id,
            resourceType: "playlist",
          }),
        });
        if (response.ok) {
          setIsInLibrary(true);
        } else {
          const error = await response.json();
          alert(error.error || "Có lỗi xảy ra!");
        }
      }
    } catch (error) {
      console.error("Error toggling playlist library state:", error);
      alert("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  }, [userId, playlist, isInLibrary]);

  return (
    <button
      type="button"
      onClick={handleToggleLibrary}
      disabled={isLoading}
      aria-label={
        isInLibrary ? "Gỡ playlist khỏi Library" : "Thêm playlist vào Library"
      }
      className={`group relative flex items-center justify-center rounded-full transition-all duration-200 ease-in-out active:scale-90 ${
        isLoading ? "pointer-events-none opacity-40" : ""
      }`}
    >
      <span
        className={`transition-transform duration-300 ease-in-out ${
          isInLibrary ? "scale-100" : "scale-100"
        }`}
      >
        {isInLibrary ? (
          <CheckCircle
            size={22}
            weight="fill"
            className="text-rose-500 drop-shadow-sm transition-colors duration-200 group-hover:text-rose-400"
          />
        ) : (
          <Plus
            size={22}
            weight="bold"
            className="text-white transition-colors duration-200 group-hover:scale-125"
          />
        )}
      </span>
    </button>
  );
}
