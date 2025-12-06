"use client";

import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { useState, useEffect } from "react";

interface LibraryCountProps {
  userId?: string;
}

interface LibraryItem {
  _id: string;
  userId: string;
  musicId: string;
  musicData: IMusic;
  createdAt: string;
}

export function LibraryCount({ userId }: LibraryCountProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      setCount(0);
      return;
    }

    const fetchLibraryCount = async () => {
      try {
        const response = await fetch(`/api/library?userId=${userId}`);
        if (response.ok) {
          const items: LibraryItem[] = await response.json();
          setCount(items.length);
        }
      } catch (error) {
        console.error("Error fetching library count:", error);
      }
    };

    fetchLibraryCount();
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
