"use client";

import { useEffect, useState } from "react";
import { IPlaylistItem } from "../type/playlist";
import { Plus } from "@phosphor-icons/react/dist/ssr";

type LibraryPlaylistButtonProps = {
  playlist: IPlaylistItem;
  userId?: string;
  size?: "sm" | "md" | "lg";
};

export function LibraryPlaylistButton({
  playlist,
  userId,
  size = "md",
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

  const handleToggleLibrary = async () => {
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
            data: playlist,
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
  };

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "size-6",
  };

  return (
    <button
      type="button"
      onClick={handleToggleLibrary}
      disabled={isLoading}
      className={`flex items-center ${
        isInLibrary
          ? "text-red-500 hover:text-red-600"
          : "text-zinc-50 hover:text-red-500"
      } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
      title={
        isInLibrary ? "Gỡ playlist khỏi Library" : "Thêm playlist vào Library"
      }
    >
      <Plus
        size={25}
        weight="bold"
        className={sizeClasses[size]}
        fill={isInLibrary ? "currentColor" : "red"}
      />
    </button>
  );
}
