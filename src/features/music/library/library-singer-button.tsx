"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star } from "@phosphor-icons/react/dist/ssr";
import { usePermissions } from "@/hooks/use-permissions";
import { ISingerItem } from "../type/singer";
import { cn } from "@/utils/cn";

type LibrarySingerButtonProps = {
  singer: ISingerItem;
  userId?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
};

const librarySingerIdsCache = new Map<string, Set<string>>();
const librarySingerFetchInFlight = new Map<string, Promise<Set<string>>>();
const LIBRARY_SINGER_UPDATED_EVENT = "library:singer-updated";

const fetchLibrarySingerIds = async (userId: string) => {
  const cached = librarySingerIdsCache.get(userId);
  if (cached) return cached;

  const inFlight = librarySingerFetchInFlight.get(userId);
  if (inFlight) return inFlight;

  const request = (async () => {
    const response = await fetch(`/api/library?userId=${userId}&type=singer`);
    if (!response.ok) return new Set<string>();

    const entries = (await response.json()) as Array<{ resourceId?: string }>;
    const ids = new Set(
      entries
        .map((entry) => entry.resourceId)
        .filter((id): id is string => typeof id === "string" && id.length > 0)
    );

    librarySingerIdsCache.set(userId, ids);
    return ids;
  })();

  librarySingerFetchInFlight.set(userId, request);

  try {
    return await request;
  } finally {
    librarySingerFetchInFlight.delete(userId);
  }
};

const updateLibrarySingerCache = (
  userId: string,
  singerId: string,
  shouldExist: boolean
) => {
  const next = new Set(librarySingerIdsCache.get(userId) ?? []);
  if (shouldExist) {
    next.add(singerId);
  } else {
    next.delete(singerId);
  }

  librarySingerIdsCache.set(userId, next);

  window.dispatchEvent(
    new CustomEvent(LIBRARY_SINGER_UPDATED_EVENT, {
      detail: { userId, singerId, shouldExist },
    })
  );
};

export function LibrarySingerButton({
  singer,
  userId,
  size = "md",
  showLabel = false,
  className = "",
}: LibrarySingerButtonProps) {
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { canUseLibrary } = usePermissions();
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "en";
  const singerId = singer.id ?? singer._id;

  useEffect(() => {
    if (!userId || !singerId) {
      setIsInLibrary(false);
      return;
    }

    const cached = librarySingerIdsCache.get(userId);
    if (cached) {
      setIsInLibrary(cached.has(singerId));
    }

    const checkLibrary = async () => {
      try {
        const ids = await fetchLibrarySingerIds(userId);
        setIsInLibrary(ids.has(singerId));
      } catch (error) {
        console.error("Error checking singer library state:", error);
      }
    };

    void checkLibrary();

    const onLibraryUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{
        userId: string;
        singerId: string;
        shouldExist: boolean;
      }>;

      if (customEvent.detail.userId !== userId) return;
      if (customEvent.detail.singerId !== singerId) return;

      setIsInLibrary(customEvent.detail.shouldExist);
    };

    window.addEventListener(LIBRARY_SINGER_UPDATED_EVENT, onLibraryUpdated);

    return () => {
      window.removeEventListener(
        LIBRARY_SINGER_UPDATED_EVENT,
        onLibraryUpdated
      );
    };
  }, [singerId, userId]);

  const handleToggleLibrary = async () => {
    if (!canUseLibrary) {
      router.push(`/${locale}/music/premium`);
      return;
    }

    if (!userId) {
      alert("Vui long dang nhap de su dung tinh nang nay!");
      return;
    }

    if (!singerId) return;

    const nextValue = !isInLibrary;
    setIsInLibrary(nextValue);
    updateLibrarySingerCache(userId, singerId, nextValue);
    setIsLoading(true);

    try {
      if (isInLibrary) {
        const response = await fetch(
          `/api/library?userId=${userId}&resourceId=${singerId}&type=singer`,
          { method: "DELETE" }
        );

        if (!response.ok) {
          const error = await response.json();
          setIsInLibrary(!nextValue);
          updateLibrarySingerCache(userId, singerId, !nextValue);
          alert(error.error || "Co loi xay ra!");
        }
      } else {
        const response = await fetch("/api/library", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            resourceId: singerId,
            resourceType: "singer",
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          setIsInLibrary(!nextValue);
          updateLibrarySingerCache(userId, singerId, !nextValue);
          alert(error.error || "Co loi xay ra!");
        }
      }
    } catch (error) {
      setIsInLibrary(!nextValue);
      updateLibrarySingerCache(userId, singerId, !nextValue);
      console.error("Error toggling singer library state:", error);
      alert("Co loi xay ra!");
    } finally {
      setIsLoading(false);
    }
  };

  const iconSize = {
    sm: 18,
    md: 20,
    lg: 24,
  };

  return (
    <button
      type="button"
      onClick={handleToggleLibrary}
      disabled={isLoading}
      aria-label={
        isInLibrary ? "Remove artist from Library" : "Add artist to Library"
      }
      className={`flex items-center justify-center gap-2 rounded-full border border-white/15 bg-black/25 p-2 text-white backdrop-blur-sm transition ${
        isLoading ? "cursor-not-allowed opacity-50" : "hover:scale-105"
      } ${isInLibrary ? "border-rose-500/40" : ""} ${className}`}
    >
      <Star
        size={iconSize[size]}
        weight={isInLibrary ? "fill" : "regular"}
        className={cn("text-white", isInLibrary ? "text-rose-500" : "")}
      />

      {showLabel ? (
        <span className="text-sm font-medium md:text-base">
          {isInLibrary ? "Favorited" : "Favorite"}
        </span>
      ) : null}
    </button>
  );
}
