"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { IPlaylistItem } from "../type/playlist";
import { Star } from "phosphor-react";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { useParams } from "next/navigation";
import { PlaylistCover } from "../component/playlist-cover";

type LibraryPlaylist = {
  _id: string;
  resourceId: string;
  resourceData: IPlaylistItem;
  createdAt: string;
};

type Props = {
  userId?: string;
};

export function LibraryPlaylistsList({ userId }: Props) {
  const [playlists, setPlaylists] = useState<LibraryPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchLibraryPlaylists = async () => {
      try {
        const response = await fetch(
          `/api/library?userId=${userId}&type=playlist`
        );
        if (response.ok) {
          const data = await response.json();
          setPlaylists(data);
        }
      } catch (error) {
        console.error("Error fetching library playlists:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibraryPlaylists();
  }, [userId]);

  if (!userId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-zinc-500">Đang tải...</div>
    );
  }

  if (playlists.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="space-y-4 md:space-y-8">
        {playlists.map((entry) => {
          const playlist = entry.resourceData;

          return (
            <div key={entry._id}>
              <Link
                href={`/${locale}/music/playlist/${playlist.id}`}
                className="flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Star weight="fill" size={10} className="text-rose-500" />

                  <PlaylistCover
                    cover={playlist?.cover}
                    title={playlist?.title || "Playlist cover"}
                    className="size-14 rounded-xl hover:scale-105 md:size-24"
                  />

                  <div className="ml-2">
                    <h3 className="font-semibold text-black dark:text-white">
                      {playlist.title || "Playlist"}
                    </h3>

                    <p className="text-zinc-500 dark:text-zinc-400">
                      {playlist.singer || "ChanhDang Music"}
                    </p>
                  </div>
                </div>

                <div className="md:hidden">
                  <CaretRight
                    size={15}
                    weight="bold"
                    className="text-zinc-500"
                  />
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
