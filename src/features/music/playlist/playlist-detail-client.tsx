"use client";
import { useMemo } from "react";
import { useAudio } from "@/components/music-provider";
import { MotionHeaderMusic } from "../component/motion-header-music";
import { MenuBar } from "../menu-bar";
import { MenuBarMobile } from "../menu-bar-mobile";
import { AudioBar } from "../audio-bar";
import { IPlaylistItem } from "../type/playlist";
import { AudioItemOrder } from "../component/audio-item-order";
import { BorderPro } from "../component/border-pro";
import { CaretLeft, Play, Shuffle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/app/[locale]/features/profile /footer";

type Props = {
  playlist: IPlaylistItem;
};

export function PlaylistDetailClient({ playlist }: Props) {
  const { handlePlayAudio, handlePlayRandomAudio } = useAudio();

  const musics = useMemo(
    () => playlist.musics?.filter((m) => m && m.id) ?? [],
    [playlist.musics]
  );

  const coverUrl =
    playlist.cover || "https://cdn.chanhdang.com/top50_global.jpg";

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
    <div className="font-apple md:flex">
      <MenuBar />

      <div className="pointer-events-none fixed top-0 z-10 h-24 w-full bg-gradient-to-b from-white via-white/50 to-transparent dark:from-black dark:via-black/50" />

      <MotionHeaderMusic name="Playlist" />

      <div className="w-full">
        <AudioBar />
        <MenuBarMobile />

        <div className="sticky top-0 z-20 m-4 flex items-center gap-1 md:hidden">
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

        <div className="relative mx-4 mb-12 md:ml-[270px] md:mr-12 md:mt-10 md:gap-10">
          <div className="pointer-events-auto w-full">
            <BorderPro roundedSize="rounded-3xl">
              <Image
                src={coverUrl}
                alt={playlist.title || "Playlist cover"}
                width={480}
                height={480}
                className="h-64 w-full rounded-3xl object-cover shadow-2xl md:h-96"
              />

              <div className="absolute top-0 h-40 w-full rounded-t-2xl bg-gradient-to-b from-zinc-900 to-transparent" />
            </BorderPro>

            <div className="mt-4 space-y-2 text-black dark:text-white">
              <div className="absolute left-4 top-4">
                <h1 className="text-3xl font-semibold md:text-4xl">
                  {playlist.title || "Playlist"}
                </h1>
                <div className="text-base text-zinc-500">
                  {playlist.singer || "ChanhDang Music"}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handlePlayFirst}
                  className="flex flex-1 items-center justify-center gap-2 rounded-3xl bg-zinc-200 px-4 py-2 font-semibold text-red-500 transition hover:scale-[1.02] dark:bg-zinc-900"
                >
                  <Play size={20} weight="fill" />
                  Play
                </button>

                <button
                  onClick={handleShuffle}
                  className="flex flex-1 items-center justify-center gap-2 rounded-3xl bg-zinc-200 px-4 py-2 font-semibold text-red-500 transition hover:scale-[1.02] dark:bg-zinc-900"
                >
                  <Shuffle size={20} weight="fill" />
                  Shuffle
                </button>
              </div>
            </div>
          </div>

          <div className="pointer-events-auto mt-8 flex-1 space-y-2">
            {musics.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
                Playlist chưa có bài hát nào.
              </div>
            ) : (
              musics.map((music) => (
                <div key={music.id} className="rounded-2xl bg-transparent p-1">
                  <AudioItemOrder
                    music={music}
                    handlePlay={() => handlePlayAudio(music)}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mb-40 md:ml-60">
          <Footer />
        </div>
      </div>
    </div>
  );
}
