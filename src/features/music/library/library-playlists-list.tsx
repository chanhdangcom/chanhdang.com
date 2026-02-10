"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { IPlaylistItem } from "../type/playlist";
import { Star } from "phosphor-react";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";

type LibraryPlaylist = {
  _id: string;
  resourceId: string;
  resourceData: IPlaylistItem;
  createdAt: string;
};

type Props = {
  userId?: string;
};

const getCoverUrl = (cover?: string) => {
  if (!cover) return "/img/Logomark.png";
  try {
    new URL(cover);
    return cover;
  } catch {
    if (cover.startsWith("/")) return cover;
    return "/img/Logomark.png";
  }
};

export function LibraryPlaylistsList({ userId }: Props) {
  const [playlists, setPlaylists] = useState<LibraryPlaylist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          const coverUrl = getCoverUrl(playlist?.cover);

          return (
            <div key={entry._id}>
              <Link
                href={`/music/playlist/${playlist.id}`}
                className="flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Star weight="fill" size={10} className="text-red-500" />

                  <Image
                    src={coverUrl}
                    alt={playlist.title || "Playlist cover"}
                    width={500}
                    height={500}
                    className="size-14 rounded-xl object-cover hover:scale-105 md:size-24"
                  />

                  <div className="ml-2">
                    <h3 className="font-semibold text-black dark:text-white">
                      {playlist.title || "Playlist"}
                    </h3>

                    <p className="text-zinc-500 dark:text-zinc-400">
                      {playlist.singer || "ChanhDang Music"}
                    </p>

                    {/* <LibraryPlaylistButton
                      playlist={playlist}
                      userId={userId}
                      size="sm"
                    /> */}
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
