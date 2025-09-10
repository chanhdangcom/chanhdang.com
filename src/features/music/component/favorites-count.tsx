"use client";

import { IMusic } from "@/app/[locale]/features/profile /types/music";
import { useState, useEffect } from "react";

interface FavoritesCountProps {
  userId?: string;
}

interface FavoriteItem {
  _id: string;
  userId: string;
  musicId: string;
  musicData: IMusic;
  createdAt: string;
}

export function FavoritesCount({ userId }: FavoritesCountProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setCount(0);
      return;
    }

    const fetchFavoritesCount = async () => {
      try {
        const response = await fetch(`/api/favorites?userId=${userId}`);
        if (response.ok) {
          const favorites: FavoriteItem[] = await response.json();
          setCount(favorites.length);
        }
      } catch (error) {
        console.error("Error fetching favorites count:", error);
      }
    };

    fetchFavoritesCount();
  }, [userId]);

  if (!userId || count === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      <div className="text-sm text-red-500">{count}</div>
    </div>
  );
}
