"use client";
import { useMemo } from "react";
import { useAudio } from "@/components/music-provider";
import { MenuBar } from "../menu-bar";
import { MenuBarMobile } from "../menu-bar-mobile";
import { AudioBar } from "../audio-bar";
import { IPlaylistItem } from "../type/playlist";
import { AudioItemOrder } from "../component/audio-item-order";
import {
  CaretLeft,
  DotsThreeVertical,
  Play,
  Shuffle,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/app/[locale]/features/profile/footer";
import { HeaderMusicPage } from "../header-music-page";
import { MotionHeaderMusic } from "../component/motion-header-music";
import { LibraryPlaylistButton } from "../library/library-playlist-button";
import { useUser } from "@/hooks/use-user";
import { BorderPro } from "../component/border-pro";

type Props = {
  playlist: IPlaylistItem;
};

export function PlaylistDetailClient({ playlist }: Props) {
  const { handlePlayAudio, handlePlayRandomAudio } = useAudio();
  const { user } = useUser();

  const musics = useMemo(
    () => playlist.musics?.filter((m) => m && m.id) ?? [],
    [playlist.musics]
  );

  // Validate cover URL to prevent "Failed to construct 'URL': Invalid URL" error
  const isValidUrl = (url: string | undefined | null): boolean => {
    if (!url || typeof url !== "string" || url.trim() === "") {
      return false;
    }
    try {
      new URL(url);
      return true;
    } catch {
      // If it's a relative URL, check if it starts with /
      return url.startsWith("/");
    }
  };

  const coverUrl =
    playlist.cover && isValidUrl(playlist.cover)
      ? playlist.cover
      : "https://cdn.chanhdang.com/top50_global.jpg";

  const handlePlayFirst = () => {
    if (!musics.length) return;
    handlePlayAudio(musics[0]);
  };

  const handleShuffle = () => {
    if (musics.length === 0) return;
    const random = musics[Math.floor(Math.random() * musics.length)];
    if (random) {
      handlePlayAudio(random);
    } else {
      void handlePlayRandomAudio();
    }
  };

  return (
    <div className="mt-2">
      <MotionHeaderMusic name={playlist.title} />

      <div className="z-20 hidden md:ml-[270px] md:block">
        <HeaderMusicPage name="Playlists" />
      </div>

      <div className="font-apple md:flex">
        <MenuBar />

        <div className="w-full">
          <AudioBar />
          <MenuBarMobile />

          <div className="sticky top-0 z-10 m-4 flex items-center gap-1 md:hidden">
            <Link href="/music">
              <div className="pointer-events-auto rounded-full bg-zinc-200 p-2 dark:bg-zinc-900">
                <CaretLeft
                  size={28}
                  weight="regular"
                  className="text-black dark:text-white"
                />
              </div>
            </Link>
          </div>

          <div className="mx-4 mb-12 md:ml-[270px]">
            <div className="items-center gap-8 md:flex">
              <BorderPro roundedSize="rounded-3xl">
                <Image
                  src={coverUrl}
                  alt={playlist.title || "Playlist cover"}
                  width={480}
                  height={480}
                  className="h-80 w-auto rounded-3xl object-cover"
                />
              </BorderPro>

              <div className="mt-4 space-y-2 text-black dark:text-white">
                <div className="text-base text-zinc-500">
                  {playlist.singer || "ChanhDang Music"}
                </div>

                <h1 className="text-5xl font-semibold md:text-8xl">
                  {playlist.title || "Playlist"}
                </h1>
              </div>
            </div>

            <div className="mt-8 flex justify-between gap-4">
              <button
                onClick={handlePlayFirst}
                className="flex flex-1 items-center justify-center gap-2 rounded-3xl bg-zinc-200 px-4 py-1 font-semibold text-red-500 transition hover:scale-[1.02] dark:bg-zinc-900"
              >
                <Play size={20} weight="fill" />
                Play
              </button>

              <button
                onClick={handleShuffle}
                className="flex flex-1 items-center justify-center gap-2 rounded-3xl bg-zinc-200 px-4 py-1 font-semibold text-red-500 transition hover:scale-[1.02] dark:bg-zinc-900"
              >
                <Shuffle size={20} weight="fill" />
                Shuffle
              </button>

              <div className="flex flex-1 items-center justify-center gap-2 rounded-3xl bg-zinc-200 px-4 py-1 font-semibold text-red-500 transition hover:scale-[1.02] dark:bg-zinc-900">
                <LibraryPlaylistButton
                  playlist={playlist}
                  userId={user?.id}
                  size="lg"
                />
              </div>

              <div className="flex justify-end">
                <img
                  src={playlist.cover}
                  alt="cover"
                  className="pointer-events-none absolute top-0 -z-10 h-1/3 w-[85vw] object-cover opacity-50 blur-3xl"
                />
              </div>
            </div>

            <>
              <div className="pointer-events-auto mt-8 flex-1 space-y-2">
                {musics.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
                    Playlist chưa có bài hát nào.
                  </div>
                ) : (
                  musics.map((music) => (
                    <div
                      key={music.id}
                      className="rounded-2xl bg-transparent p-1"
                    >
                      <AudioItemOrder
                        music={music}
                        handlePlay={() => handlePlayAudio(music)}
                        date={
                          music.createdAt
                            ? new Date(music.createdAt as Date).toISOString()
                            : undefined
                        }
                        item={<DotsThreeVertical size={20} weight="bold" />}
                      />
                    </div>
                  ))
                )}
              </div>
            </>
          </div>

          <div className="mb-40 md:ml-60">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
