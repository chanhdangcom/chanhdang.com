"use client";
import * as React from "react";
import { useParams } from "next/navigation";

import { IPlaylistItem } from "./type/playlist";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { useUser } from "@/hooks/use-user";
import { PlaylistItem } from "./component/playlist-item";

export function NewCarouselAudioPlaylist() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [playlists, setPlaylists] = React.useState<IPlaylistItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const { user } = useUser();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const withLocale = (path: string) => `/${locale}${path}`;

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/playlists?lite=1&limit=24");
        if (res.ok) {
          const data = (await res.json()) as IPlaylistItem[];
          const visiblePlaylists = data.filter(
            (playlist) => !playlist.isUserPlaylist || playlist.ownerId === user?.id
          );
          if (isMounted) setPlaylists(visiblePlaylists);
        }
      } catch (e) {
        console.error("Failed to load playlists", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="w-full md:max-w-full">
        <div className="ml-2 text-sm text-zinc-500 md:ml-[270px]">
          Loading playlists...
        </div>
      </div>
    );
  }

  if (!playlists.length) {
    return (
      <div className="w-full md:max-w-full">
        <div className="ml-2 text-sm text-zinc-500 md:ml-[270px]">
          No playlists yet.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:max-w-full">
      <div className="flex justify-between">
        <h2 className="ml-2 flex items-center gap-1 px-1 text-xl font-bold text-black dark:text-white md:ml-[270px]">
          <div>New Playlist</div>

          <CaretRight
            size={20}
            weight="bold"
            className="text-zinc-500 md:mt-1"
          />
        </h2>
      </div>

      <div
        ref={ref}
        className="flex snap-x snap-mandatory items-center overflow-x-auto scrollbar-hide md:mx-auto"
      >
        {playlists
          .slice(-8)
          .reverse()
          .map((music, index) => (
            <div key={music.id} className="shrink-0 snap-start">
              <Link href={`${withLocale("/music/playlist")}/${music.id}`}>
                <div
                  className={cn(
                    "",
                    `${index === 0 ? "ml-2 md:ml-[270px]" : ""} `
                  )}
                >
                  <PlaylistItem music={music} />
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
