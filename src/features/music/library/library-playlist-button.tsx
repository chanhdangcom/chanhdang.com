"use client";

import { useEffect, useState } from "react";
import { IPlaylistItem } from "../type/playlist";
import { CheckCircle, Star } from "@phosphor-icons/react/dist/ssr";
import { usePermissions } from "@/hooks/use-permissions";
import { useParams, useRouter } from "next/navigation";

type LibraryPlaylistButtonProps = {
  playlist: IPlaylistItem;
  userId?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
};

const libraryPlaylistIdsCache = new Map<string, Set<string>>();
const libraryPlaylistFetchInFlight = new Map<string, Promise<Set<string>>>();
const LIBRARY_PLAYLIST_UPDATED_EVENT = "library:playlist-updated";

const fetchLibraryPlaylistIds = async (userId: string) => {
  const cached = libraryPlaylistIdsCache.get(userId);
  if (cached) return cached;

  const inFlight = libraryPlaylistFetchInFlight.get(userId);
  if (inFlight) return inFlight;

  const request = (async () => {
    const response = await fetch(`/api/library?userId=${userId}&type=playlist`);
    if (!response.ok) return new Set<string>();

    const entries = (await response.json()) as Array<{ resourceId?: string }>;
    const ids = new Set(
      entries
        .map((entry) => entry.resourceId)
        .filter((id): id is string => typeof id === "string" && id.length > 0)
    );

    libraryPlaylistIdsCache.set(userId, ids);
    return ids;
  })();

  libraryPlaylistFetchInFlight.set(userId, request);

  try {
    return await request;
  } finally {
    libraryPlaylistFetchInFlight.delete(userId);
  }
};

const updateLibraryPlaylistCache = (
  userId: string,
  playlistId: string,
  shouldExist: boolean
) => {
  const next = new Set(libraryPlaylistIdsCache.get(userId) ?? []);
  if (shouldExist) {
    next.add(playlistId);
  } else {
    next.delete(playlistId);
  }

  libraryPlaylistIdsCache.set(userId, next);

  window.dispatchEvent(
    new CustomEvent(LIBRARY_PLAYLIST_UPDATED_EVENT, {
      detail: { userId, playlistId, shouldExist },
    })
  );
};

export function LibraryPlaylistButton({
  playlist,
  userId,
  size = "md",
  showLabel = false,
  className = "",
}: LibraryPlaylistButtonProps) {
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { canUseLibrary, isLoading: isPermissionsLoading } = usePermissions();
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "en";

  useEffect(() => {
    if (!userId || !playlist?.id) {
      setIsInLibrary(false);
      return;
    }

    const cached = libraryPlaylistIdsCache.get(userId);
    if (cached) {
      setIsInLibrary(cached.has(playlist.id));
    }

    const checkLibrary = async () => {
      try {
        const ids = await fetchLibraryPlaylistIds(userId);
        setIsInLibrary(ids.has(playlist.id));
      } catch (error) {
        console.error("Error checking playlist library state:", error);
      }
    };

    void checkLibrary();

    const onLibraryUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{
        userId: string;
        playlistId: string;
        shouldExist: boolean;
      }>;

      if (customEvent.detail.userId !== userId) return;
      if (customEvent.detail.playlistId !== playlist.id) return;

      setIsInLibrary(customEvent.detail.shouldExist);
    };

    window.addEventListener(LIBRARY_PLAYLIST_UPDATED_EVENT, onLibraryUpdated);

    return () => {
      window.removeEventListener(
        LIBRARY_PLAYLIST_UPDATED_EVENT,
        onLibraryUpdated
      );
    };
  }, [playlist.id, userId]);

  const handleToggleLibrary = async () => {
    if (isPermissionsLoading) {
      return;
    }
    if (!canUseLibrary) {
      router.push(`/${locale}/music/premium`);
      return;
    }

    if (!userId) {
      alert("Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }

    if (!playlist?.id) return;

    const nextValue = !isInLibrary;
    setIsInLibrary(nextValue);
    updateLibraryPlaylistCache(userId, playlist.id, nextValue);
    setIsLoading(true);
    try {
      if (isInLibrary) {
        const response = await fetch(
          `/api/library?userId=${userId}&resourceId=${playlist.id}&type=playlist`,
          { method: "DELETE" }
        );
        if (!response.ok) {
          const error = await response.json();
          setIsInLibrary(!nextValue);
          updateLibraryPlaylistCache(userId, playlist.id, !nextValue);
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
        if (!response.ok) {
          const error = await response.json();
          setIsInLibrary(!nextValue);
          updateLibraryPlaylistCache(userId, playlist.id, !nextValue);
          alert(error.error || "Có lỗi xảy ra!");
        }
      }
    } catch (error) {
      setIsInLibrary(!nextValue);
      updateLibraryPlaylistCache(userId, playlist.id, !nextValue);
      console.error("Error toggling playlist library state:", error);
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
      type="button"
      onClick={handleToggleLibrary}
      disabled={isLoading || isPermissionsLoading}
      aria-label={
        isInLibrary ? "Remove playlist from Library" : "Add playlist to Library"
      }
      className={`group relative flex items-center justify-center gap-2 rounded-full transition-all duration-200 ease-in-out active:scale-90 ${
        isLoading || isPermissionsLoading ? "pointer-events-none opacity-40" : ""
      } ${className}`}
    >
      {isInLibrary ? (
        <CheckCircle
          size={iconSize[size]}
          weight="fill"
          className="text-rose-500 drop-shadow-sm transition-colors duration-200 group-hover:text-rose-400"
        />
      ) : (
        <Star
          size={iconSize[size]}
          weight="bold"
          className="text-white transition-colors duration-200 group-hover:scale-125"
        />
      )}

      {showLabel ? (
        <span className="text-sm font-medium md:text-base">
          {isInLibrary ? "Favorited" : "Favorite"}
        </span>
      ) : null}
    </button>
  );
}
