"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { IMusic } from "@/app/[locale]/features/profile /types/music";

interface LibraryTrackButtonProps {
  music: IMusic;
  userId?: string;
  size?: "sm" | "md" | "lg";
}

export function LibraryTrackButton({
  music,
  userId,
  size = "md",
}: LibraryTrackButtonProps) {
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Kiểm tra xem bài hát có trong Library hay không
  useEffect(() => {
    if (!userId) return;

    const checkLibrary = async () => {
      try {
        const response = await fetch(
          `/api/library?userId=${userId}&type=music`
        );
        const entries = await response.json();
        const isFav = entries.some((entry: { resourceId: string }) => {
          return entry.resourceId === music.id;
        });
        setIsInLibrary(isFav);
      } catch (error) {
        console.error("Error checking library status:", error);
      }
    };

    checkLibrary();
  }, [userId, music.id]);

  const handleToggleLibrary = async () => {
    if (!userId) {
      alert("Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }

    setIsLoading(true);
    try {
      if (isInLibrary) {
        // Xóa khỏi Library
        const response = await fetch(
          `/api/library?userId=${userId}&resourceId=${music.id}&type=music`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setIsInLibrary(false);
        } else {
          const error = await response.json();
          alert(error.error || "Có lỗi xảy ra!");
        }
      } else {
        // Thêm vào Library
        const response = await fetch("/api/library", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            resourceId: music.id,
            resourceType: "music",
            data: music,
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
      console.error("Error toggling library track:", error);
      alert("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={handleToggleLibrary}
      disabled={isLoading}
      className={`rounded-full bg-zinc-900/60 p-2 backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
        isInLibrary
          ? "text-red-500 hover:text-red-600"
          : "text-zinc-50 hover:text-red-500"
      } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
      title={isInLibrary ? "Gỡ khỏi Library" : "Thêm vào Library"}
    >
      <Heart
        className={sizeClasses[size]}
        fill={isInLibrary ? "currentColor" : "none"}
      />
    </button>
  );
}
