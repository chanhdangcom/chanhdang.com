"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { IMusic } from "@/features/profile/types/music";

interface FavoriteButtonProps {
  music: IMusic;
  userId?: string;
  size?: "sm" | "md" | "lg";
}

interface FavoriteItem {
  _id: string;
  userId: string;
  musicId: string;
  musicData: IMusic;
  createdAt: string;
}

export function FavoriteButton({
  music,
  userId,
  size = "md",
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Kiểm tra xem bài hát có trong danh sách yêu thích không
  useEffect(() => {
    if (!userId) return;

    const checkFavorite = async () => {
      try {
        const response = await fetch(`/api/favorites?userId=${userId}`);
        const favorites: FavoriteItem[] = await response.json();
        const isFav = favorites.some((fav) => fav.musicId === music.id);
        setIsFavorite(isFav);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavorite();
  }, [userId, music.id]);

  const handleToggleFavorite = async () => {
    if (!userId) {
      alert("Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        // Xóa khỏi yêu thích
        const response = await fetch(
          `/api/favorites?userId=${userId}&musicId=${music.id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setIsFavorite(false);
        } else {
          const error = await response.json();
          alert(error.error || "Có lỗi xảy ra!");
        }
      } else {
        // Thêm vào yêu thích
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            musicId: music.id,
            musicData: music,
          }),
        });

        if (response.ok) {
          setIsFavorite(true);
        } else {
          const error = await response.json();
          alert(error.error || "Có lỗi xảy ra!");
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
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
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`transition-all duration-200 hover:scale-110 ${
        isFavorite
          ? "text-red-500 hover:text-red-600"
          : "text-gray-400 hover:text-red-500"
      } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
      title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
    >
      <Heart
        className={sizeClasses[size]}
        fill={isFavorite ? "currentColor" : "none"}
      />
    </button>
  );
}
