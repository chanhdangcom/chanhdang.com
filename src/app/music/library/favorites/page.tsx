/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { LibraryTracksList } from "@/features/music/library/library-tracks-list";
import { useUser } from "@/hooks/use-user";
import { HeaderMusicPage } from "@/features/music/header-music-page";
import { MenuBar } from "@/features/music/menu-bar";
import { MenuBarMobile } from "@/features/music/menu-bar-mobile";
import { AudioBar } from "@/features/music/audio-bar";
import { MotionHeaderMusic } from "@/features/music/component/motion-header-music";
import { CaretLeft, Play, Shuffle } from "phosphor-react";
import { motion } from "framer-motion";
import { useAudio } from "@/components/music-provider";
import { IMusic } from "@/app/[locale]/features/profile /types/music";
import { Footer } from "@/app/[locale]/features/profile /footer";
import Link from "next/link";

export default function LibraryFavoriteSongsPage() {
  const { user } = useUser();
  const { handlePlayAudio } = useAudio();
  const [tracks, setTracks] = useState<IMusic[]>([]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchTracks = async () => {
      try {
        const res = await fetch(`/api/library?userId=${user.id}&type=music`);
        if (!res.ok) return;
        const data = await res.json();
        const normalized: IMusic[] = data
          .map((entry: { resourceData?: IMusic }) => entry.resourceData)
          .filter(Boolean);
        setTracks(normalized);
      } finally {
        // ignore
      }
    };

    void fetchTracks();
  }, [user?.id]);

  const handlePlayFirstAudio = () => {
    if (!tracks.length) return;

    handlePlayAudio(tracks[0]);
  };

  const handleRandomAudio = () => {
    if (!tracks.length) return;

    const randomIndex = Math.floor(Math.random() * tracks.length);
    const randomMusic = tracks[randomIndex];

    handlePlayAudio(randomMusic);
  };
  return (
    <div className="flex font-apple md:mt-2">
      <MenuBar />

      <MotionHeaderMusic name="Favorite Songs" />

      <div className="pointer-events-none fixed bottom-0 z-50 h-16 w-full bg-gradient-to-t from-white to-transparent dark:from-black" />

      <div className="mx-auto w-full">
        <div className="relative z-10">
          <div className="hidden md:ml-[270px] md:block">
            <HeaderMusicPage name="Favorite Songs" />
          </div>

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

          <div className="mx-4 md:ml-[270px]">
            <div className="">
              <div className="w-full flex-col items-center md:flex-none">
                <div className="flex justify-center">
                  <img
                    src="/img/favorites-icon.jpg"
                    alt="favorites"
                    className="flex size-60 items-center justify-center rounded-3xl"
                  />
                </div>

                <div className="mt-2 space-y-2 text-6xl">
                  <div className="text-center text-lg text-zinc-500">
                    Favorites Songs
                  </div>

                  <div className="space-y-4">
                    <div className="flex w-full justify-between gap-4">
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        className="flex w-full items-center justify-center gap-2 rounded-3xl bg-zinc-200 px-4 py-1 font-semibold text-red-500 dark:bg-zinc-900"
                        onClick={() => handlePlayFirstAudio()}
                      >
                        <Play size={20} weight="fill" />

                        <div className="text-xl">Play</div>
                      </motion.div>

                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        className="flex w-full items-center justify-center gap-2 rounded-3xl bg-zinc-200 px-4 py-2 font-semibold text-red-500 dark:bg-zinc-900"
                        onClick={() => handleRandomAudio()}
                      >
                        <Shuffle size={20} weight="fill" />

                        <div className="text-xl">Mix song</div>
                      </motion.div>
                    </div>
                  </div>

                  <div className="text-center text-base text-zinc-500">
                    <div>Tận hưởng bữa tiệc âm nhạc đầy đặc sắc.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="">
              <LibraryTracksList userId={user?.id} />
            </div>
          </div>
        </div>

        <div className="my-40">
          <AudioBar />
          <MenuBarMobile />
        </div>

        <div className="mb-40 mt-8 md:ml-60">
          <Footer />
        </div>
      </div>
    </div>
  );
}
