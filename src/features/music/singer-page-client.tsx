/* eslint-disable @next/next/no-img-element */
"use client";
import { CaretLeft, Play, Shuffle } from "@phosphor-icons/react/dist/ssr";

import { AudioSingerItem } from "./component/audio-singer-item";

import { AudioBar } from "./audio-bar";
import { motion } from "motion/react";
import { AnimatePresence } from "framer-motion";
import { MenuBar } from "./menu-bar";
import { HeaderMusicPage } from "./header-music-page";

import { MenuBarMobile } from "./menu-bar-mobile";

import Link from "next/link";

import { MotionHeaderMusic } from "./component/motion-header-music";

import { ISingerItem } from "./type/singer";
import { useAudio } from "@/components/music-provider";

type IProp = {
  singer: ISingerItem;
};

export function SingerPageClient({ singer }: IProp) {
  const { handlePlayAudio } = useAudio();

  const handlePlayFirstAudio = () => {
    const musics = singer.musics;
    if (!musics?.length) return;

    handlePlayAudio(musics[0]);
  };

  const handleRandomAudio = () => {
    const musics = singer.musics;
    if (!musics?.length) return;

    const randomIndex = Math.floor(Math.random() * musics.length);
    const randomMusic = musics[randomIndex];

    handlePlayAudio(randomMusic);
  };

  return (
    <>
      <div className="md:flex">
        <MenuBar />

        <MotionHeaderMusic name={singer.singer} />

        <AnimatePresence>
          <motion.div className="mb-8 w-full" layoutId="singer">
            <AudioBar />
            <MenuBarMobile />

            <div className="z-20 mt-2 hidden md:ml-[270px] md:block">
              <HeaderMusicPage name={singer.singer} />
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
                      <div>
                        Tận hưởng bữa tiệc âm nhạc đầy đặc sắc với{" "}
                        {singer.singer}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="items-center md:mx-8 md:ml-[270px] md:flex">
              <div className="mt-8 w-full max-w-full justify-center px-3 md:mt-0 md:max-w-full md:justify-center">
                <AudioSingerItem music={singer} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
