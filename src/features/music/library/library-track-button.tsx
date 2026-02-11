"use client";

import { useState, useEffect } from "react";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { CheckCircle, Plus } from "@phosphor-icons/react/dist/ssr";

interface LibraryTrackButtonProps {
  music: IMusic;
  userId?: string;
  size?: "sm" | "md" | "lg";
}

const libraryMusicIdsCache = new Map<string, Set<string>>();
const libraryFetchInFlight = new Map<string, Promise<Set<string>>>();
const LIBRARY_MUSIC_UPDATED_EVENT = "library:music-updated";

const fetchLibraryMusicIds = async (userId: string) => {
  const cached = libraryMusicIdsCache.get(userId);
  if (cached) return cached;

  const inFlight = libraryFetchInFlight.get(userId);
  if (inFlight) return inFlight;

  const request = (async () => {
    const response = await fetch(`/api/library?userId=${userId}&type=music`);
    if (!response.ok) return new Set<string>();
    const entries = (await response.json()) as Array<{ resourceId?: string }>;
    const ids = new Set(
      entries
        .map((entry) => entry.resourceId)
        .filter((id): id is string => typeof id === "string" && id.length > 0)
    );
    libraryMusicIdsCache.set(userId, ids);
    return ids;
  })();

  libraryFetchInFlight.set(userId, request);

  try {
    return await request;
  } finally {
    libraryFetchInFlight.delete(userId);
  }
};

const updateLibraryCache = (
  userId: string,
  musicId: string,
  shouldExist: boolean
) => {
  const next = new Set(libraryMusicIdsCache.get(userId) ?? []);
  if (shouldExist) {
    next.add(musicId);
  } else {
    next.delete(musicId);
  }
  libraryMusicIdsCache.set(userId, next);

  window.dispatchEvent(
    new CustomEvent(LIBRARY_MUSIC_UPDATED_EVENT, {
      detail: { userId, musicId, shouldExist },
    })
  );
};

export function LibraryTrackButton({
  music,
  userId,
  size = "md",
}: LibraryTrackButtonProps) {
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Kiểm tra xem bài hát có trong Library hay không
  useEffect(() => {
    if (!userId || !music?.id) {
      setIsInLibrary(false);
      return;
    }

    const cached = libraryMusicIdsCache.get(userId);
    if (cached) {
      setIsInLibrary(cached.has(music.id));
    }

    const checkLibrary = async () => {
      try {
        const ids = await fetchLibraryMusicIds(userId);
        setIsInLibrary(ids.has(music.id));
      } catch (error) {
        console.error("Error checking library status:", error);
      }
    };

    void checkLibrary();

    const onLibraryUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{
        userId: string;
        musicId: string;
        shouldExist: boolean;
      }>;
      if (customEvent.detail.userId !== userId) return;
      if (customEvent.detail.musicId !== music.id) return;
      setIsInLibrary(customEvent.detail.shouldExist);
    };
    window.addEventListener(LIBRARY_MUSIC_UPDATED_EVENT, onLibraryUpdated);
    return () => {
      window.removeEventListener(LIBRARY_MUSIC_UPDATED_EVENT, onLibraryUpdated);
    };
  }, [userId, music.id]);

  const handleToggleLibrary = async () => {
    if (!userId) {
      alert("Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }
    if (!music?.id) return;

    const nextValue = !isInLibrary;
    setIsInLibrary(nextValue);
    updateLibraryCache(userId, music.id, nextValue);
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
          // Optimistic state already applied.
        } else {
          const error = await response.json();
          setIsInLibrary(!nextValue);
          updateLibraryCache(userId, music.id, !nextValue);
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
          }),
        });

        if (response.ok) {
          // Optimistic state already applied.
        } else {
          const error = await response.json();
          setIsInLibrary(!nextValue);
          updateLibraryCache(userId, music.id, !nextValue);
          alert(error.error || "Có lỗi xảy ra!");
        }
      }
    } catch (error) {
      setIsInLibrary(!nextValue);
      updateLibraryCache(userId, music.id, !nextValue);
      console.error("Error toggling library track:", error);
      alert("Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };

  const iconSize = {
    sm: 18,
    md: 22,
    lg: 26,
  };

  return (
    <button
      onClick={handleToggleLibrary}
      disabled={isLoading}
      className={`group rounded-full bg-zinc-900/60 p-1 backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
        isInLibrary
          ? "text-rose-500 hover:text-rose-600"
          : "text-zinc-50 hover:text-rose-500"
      } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
      title={isInLibrary ? "Gỡ khỏi Library" : "Thêm vào Library"}
    >
      {/* <Heart
        className={sizeClasses[size]}
        fill={isInLibrary ? "currentColor" : "none"}
      /> */}

      {isInLibrary ? (
        <CheckCircle
          size={iconSize[size]}
          weight="fill"
          className="text-rose-500 drop-shadow-sm transition-colors duration-200 group-hover:text-rose-400"
        />
      ) : (
        <Plus
          size={iconSize[size]}
          weight="bold"
          className="text-white transition-colors duration-200 group-hover:scale-125"
        />
      )}
    </button>
  );
}
