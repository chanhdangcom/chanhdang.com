/* eslint-disable @next/next/no-img-element */
"use client";

import { Shuffle } from "@phosphor-icons/react/dist/ssr";

import { AudioSingerItem } from "./component/audio-singer-item";

import { AudioBar } from "./audio-bar";
import { motion } from "motion/react";
import { AnimatePresence } from "framer-motion";
import { MenuBar } from "./menu-bar";
import { HeaderMusicPage } from "./header-music-page";

import { MenuBarMobile } from "./menu-bar-mobile";
import { CaretLeft, Play } from "phosphor-react";
import Link from "next/link";

import { CarouselAudio } from "./carousel-audio";

import { MotionHeaderMusic } from "./component/motion-header-music";
import { Footer } from "@/app/[locale]/features/profile /footer";
import { useEffect, useState } from "react";
import { ISingerItem } from "./type/singer";

type IProp = {
  idSinger: string;
};

export function SingerPage({ idSinger }: IProp) {
  const [singer, setSinger] = useState<ISingerItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/singers/${idSinger}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("SINGER API DATA:", data);
        setSinger(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching singer:", error);
        setLoading(false);
      });
  }, [idSinger]);

  if (loading) {
    return (
      <div className="md:flex">
        <MenuBar />
        <div className="pointer-events-none fixed top-0 z-10 h-24 w-full bg-gradient-to-b from-white via-white/50 to-transparent dark:from-black dark:via-black/50" />
        <MotionHeaderMusic name="Artists" />
        <div className="flex items-center justify-center py-8">
          <div className="text-zinc-500">Loading singer...</div>
        </div>
      </div>
    );
  }

  if (!singer) {
    return (
      <div className="md:flex">
        <MenuBar />
        <div className="pointer-events-none fixed top-0 z-10 h-24 w-full bg-gradient-to-b from-white via-white/50 to-transparent dark:from-black dark:via-black/50" />
        <MotionHeaderMusic name="Artists" />
        <div className="flex items-center justify-center py-8">
          <div className="text-zinc-500">Singer not found</div>
        </div>
      </div>
    );
  }
  return (
    <div className="md:flex">
      <MenuBar />
      <div className="pointer-events-none fixed top-0 z-10 h-24 w-full bg-gradient-to-b from-white via-white/50 to-transparent dark:from-black dark:via-black/50" />

      <MotionHeaderMusic name="Artists" />

      <AnimatePresence>
        <motion.div className="mb-48 w-full" layoutId="singer">
          <AudioBar />
          <MenuBarMobile />

          <div className="hidden md:ml-[270px] md:block">
            <HeaderMusicPage name="Artists" />
          </div>

          <div>
            <div className="sticky top-0 z-20 m-4 flex items-center gap-1 md:hidden">
              <Link href={"/music"}>
                <motion.div
                  whileTap={{ scale: 0.3 }}
                  className="rounded-full bg-zinc-200 p-2 dark:bg-zinc-900"
                  layout
                >
                  <CaretLeft
                    size={28}
                    weight="regular"
                    className="text-black dark:text-white"
                  />
                </motion.div>
              </Link>
            </div>

            <div className="mx-4 flex rounded-3xl md:ml-[270px] md:p-4">
              <div className="w-full flex-col items-center md:flex-none">
                <div>
                  <img
                    src={singer.cover}
                    alt="cover"
                    className="mx-auto my-4 size-60 rounded-3xl object-cover shadow-2xl"
                  />
                </div>

                <div className="space-y-2 text-6xl">
                  <div className="flex items-center justify-center gap-1">
                    <div className="text-2xl font-semibold">
                      Các bài hát của
                    </div>

                    <div className="text-2xl font-semibold">
                      {singer.singer}
                    </div>
                  </div>

                  <div className="text-center text-lg text-zinc-500">
                    ChanhDang Music
                  </div>

                  <div className="space-y-4">
                    <div className="flex w-full justify-between gap-4">
                      <div className="flex w-full items-center justify-center gap-2 rounded-3xl bg-zinc-200 px-4 py-1 font-semibold text-red-500 dark:bg-zinc-900">
                        <Play size={20} weight="fill" />

                        <div className="text-xl">Play</div>
                      </div>

                      <div className="flex w-full items-center justify-center gap-2 rounded-3xl bg-zinc-200 px-4 py-2 font-semibold text-red-500 dark:bg-zinc-900">
                        <Shuffle size={20} weight="fill" />

                        <div className="text-xl">Mix song</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-base text-zinc-500">
                    <div>
                      Tận hưởng bữa tiệc âm nhạc đầy đặc sắc với {singer.singer}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-8 flex items-center justify-center md:ml-[270px] md:justify-between">
            {singer.musics && singer.musics.length > 0 && (
              <div>
                {singer.musics.slice(-1).map((music) => (
                  <div key={music.id}>
                    <div className="hidden w-fit shrink-0 cursor-pointer gap-4 space-y-2 rounded-xl p-1.5 text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 md:flex">
                      {music.cover ? (
                        <img
                          src={music.cover}
                          alt="cover"
                          className="mx-auto h-40 w-40 justify-center rounded-lg object-cover md:size-44"
                        />
                      ) : (
                        <div className="size-40 rounded-2xl bg-zinc-800"></div>
                      )}

                      <div className="flex flex-col justify-center gap-4 py-4 text-black dark:text-white">
                        <div>
                          <div className="line-clamp-2 w-40 text-lg font-semibold">
                            {music.title || "TITLE"}
                          </div>
                          <div className="line-clamp-1 w-32 text-sm text-zinc-500">
                            {music.singer || "SINGER"}
                          </div>
                        </div>

                        <div className="w-fit rounded-2xl bg-zinc-200 px-4 py-1 text-blue-600 dark:bg-zinc-400">
                          Add +
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="md:mx-a mt-8 justify-center px-3 md:mt-0 md:max-w-3xl md:justify-center">
              <AudioSingerItem music={singer} />
            </div>
          </div>

          <div className="my-8 space-y-8">
            <CarouselAudio />

            <div className="md:ml-60">
              <Footer />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
