"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { IPlaylistItem } from "../type/playlist";
import { PlaylistDetailClient } from "./playlist-detail-client";

type PlaylistDetailPageClientProps = {
  playlistId: string;
};

export function PlaylistDetailPageClient({
  playlistId,
}: PlaylistDetailPageClientProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "vi";
  const { user, isLoading: isLoadingUser } = useUser();
  const [playlist, setPlaylist] = useState<IPlaylistItem | null>(null);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!playlistId || isLoadingUser) {
      return;
    }

    const controller = new AbortController();

    const fetchPlaylist = async () => {
      setIsLoadingPlaylist(true);
      setLoadFailed(false);

      try {
        const query = user?.id
          ? `?userId=${encodeURIComponent(user.id)}`
          : "";
        const response = await fetch(`/api/playlists/${playlistId}${query}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          setPlaylist(null);
          setLoadFailed(true);
          return;
        }

        const data = (await response.json()) as IPlaylistItem;
        setPlaylist(data);
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }

        setPlaylist(null);
        setLoadFailed(true);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingPlaylist(false);
        }
      }
    };

    void fetchPlaylist();

    return () => controller.abort();
  }, [playlistId, user?.id, isLoadingUser]);

  if (isLoadingUser || isLoadingPlaylist) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4 text-sm text-zinc-500">
        Loading playlist...
      </div>
    );
  }

  if (!playlist || loadFailed) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <div className="text-lg font-semibold text-black dark:text-white">
          Playlist không tồn tại hoặc bạn không có quyền xem.
        </div>

        <Link
          href={`/${locale}/music/library/playlists`}
          className="rounded-full bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
        >
          Quay lại playlists
        </Link>
      </div>
    );
  }

  return <PlaylistDetailClient playlist={playlist} />;
}
