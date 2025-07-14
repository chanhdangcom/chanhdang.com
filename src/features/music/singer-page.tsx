/* eslint-disable @next/next/no-img-element */
"use client";

import { Shuffle } from "@phosphor-icons/react/dist/ssr";

import { AudioSingerItem } from "./component/audio-singer-item";

import { AudioBar } from "./audio-bar";
import { motion } from "motion/react";
import { AnimatePresence } from "framer-motion";
import { MUSICSSINGER } from "./data/music-page-singer";
import { MenuBar } from "./menu-bar";
import { HeaderMusicPage } from "./header-music-page";

import { MenuBarMobile } from "./menu-bar-mobile";
import { CaretLeft, Play } from "phosphor-react";
import Link from "next/link";

import { CarouselAudio } from "./carousel-audio";

type IProp = {
  idSinger: string;
};

export function SingerPage({ idSinger }: IProp) {
  return (
    <div className="md:flex">
      <MenuBar />

      <AnimatePresence>
        <motion.div className="mb-48 w-full dark:bg-zinc-950" layoutId="singer">
          <AudioBar />
          <MenuBarMobile />

          <div>
            <div className="hidden md:flex">
              <HeaderMusicPage />
            </div>

            <div className="z-5 fixed top-0 h-20 w-full rounded-b-xl bg-gradient-to-b from-white to-transparent dark:from-black/95 dark:via-black/60"></div>

            <div className="sticky top-0 z-10 m-4 flex items-center gap-1 md:hidden">
              <Link
                href={"/music"}
                className="rounded-full bg-zinc-200 p-2 dark:bg-zinc-900"
              >
                <CaretLeft
                  size={28}
                  weight="bold"
                  className="text-black dark:text-white"
                />
              </Link>
            </div>

            <div className="mx-4 flex rounded-3xl from-zinc-200 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 md:bg-gradient-to-b md:p-4">
              <div className="w-full flex-col items-center md:flex-none">
                {MUSICSSINGER.filter((item) => item.id === idSinger).map(
                  (item) => (
                    <div key={item.id}>
                      {/* <Image
                        alt="cover-singer"
                        height={300}
                        width={300}
                        src={item.cover}
                        className="mx-auto my-4 size-60 rounded-3xl object-cover shadow-2xl"
                      /> */}

                      <img
                        src={item.cover}
                        alt="cover"
                        className="mx-auto my-4 size-60 rounded-3xl object-cover shadow-2xl"
                      />
                    </div>
                  )
                )}

                {MUSICSSINGER.filter((item) => item.id === idSinger).map(
                  (item) => (
                    <div className="space-y-2 text-6xl" key={item.id}>
                      <div className="flex items-center justify-center gap-1">
                        <div className="text-2xl font-semibold">
                          Các bài hát của
                        </div>

                        <div className="text-2xl font-semibold">
                          {item.singer}
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
                          Tận hưởng bữa tiệc âm nhạc đầy đặc sắc với{" "}
                          {item.singer}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="mx-8 flex items-center justify-center md:justify-between">
            {MUSICSSINGER.filter((item) => item.id === idSinger).map((item) => (
              <div key={item.id}>
                {item.musics?.slice(-1).map((music) => (
                  <div key={music.id}>
                    <div className="hidden w-fit shrink-0 cursor-pointer gap-4 space-y-2 rounded-xl p-1.5 text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 md:flex">
                      {music.cover ? (
                        // <Image
                        //   height={300}
                        //   width={300}
                        //   alt="cover"
                        //   src={music.cover}
                        //   quality={100}
                        //   className="mx-auto h-40 w-40 justify-center rounded-lg object-cover md:size-44"
                        // />

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
            ))}

            <div className="md:mx-a mt-8 justify-center px-3 md:mt-0 md:max-w-3xl md:justify-center">
              {MUSICSSINGER.filter((item) => item.id === idSinger).map(
                (item) => (
                  <div key={item.id}>
                    <AudioSingerItem music={item} />
                  </div>
                )
              )}
            </div>
          </div>

          {/* <div className="scrollbar-hide mt-8 flex overflow-x-auto md:justify-center">
            {MUSICSSINGER.filter((item) => item.id === idSinger).map((item) => (
              <div key={item.id} className="shrink-0">
                <AudioSingerItemOrder music={item} />
              </div>
            ))}
          </div> */}

          <div className="ml-4 mt-8 flex justify-center md:ml-0">
            <CarouselAudio />
          </div>

          {/* <div className="mt-8 flex justify-center md:mx-8">
            <SingerList />
          </div> */}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
