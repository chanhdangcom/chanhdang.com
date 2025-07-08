"use client";
import Image from "next/image";

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

type IProp = {
  idSinger: string;
};

export function SingerPage({ idSinger }: IProp) {
  return (
    <div className="md:flex">
      <MenuBar />

      <AnimatePresence>
        <motion.div
          className="mx-auto mb-48 bg-zinc-950 md:ml-64 md:max-w-full"
          layoutId="singer"
        >
          <AudioBar />
          <MenuBarMobile />

          <div className="">
            <div className="hidden md:flex">
              <HeaderMusicPage />
            </div>

            <div className="sticky top-0 z-10 m-4 flex items-center gap-1 md:hidden">
              <Link href={"/music"} className="rounded-full bg-zinc-900 p-2">
                <CaretLeft size={28} weight="bold" />
              </Link>
            </div>

            <div className="mx-4 flex rounded-3xl from-zinc-900 to-zinc-950 md:bg-gradient-to-b">
              <div className="flex w-full flex-col items-center">
                {MUSICSSINGER.filter((item) => item.id === idSinger).map(
                  (item) => (
                    <div key={item.id}>
                      <Image
                        alt="cover-singer"
                        height={300}
                        width={300}
                        src={item.cover}
                        className="size-60 rounded-3xl object-cover shadow-2xl md:m-8"
                      />
                    </div>
                  )
                )}

                {MUSICSSINGER.filter((item) => item.id === idSinger).map(
                  (item) => (
                    <div className="space-y-2 text-6xl" key={item.id}>
                      <div className="hidden md:block">
                        <div className="text-4xl font-semibold">
                          Các bài hát của
                        </div>

                        <div className="font-bold"> {item.singer}</div>
                      </div>

                      <div className="flex items-center justify-center gap-1 md:hidden">
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
                          <div className="flex w-full items-center justify-center gap-2 rounded-3xl bg-zinc-900 px-4 py-1 font-semibold text-red-500">
                            <Play size={20} weight="fill" />

                            <div className="text-xl">Play</div>
                          </div>

                          <div className="flex w-full items-center justify-center gap-2 rounded-3xl bg-zinc-900 px-4 py-2 font-semibold text-red-500">
                            <Shuffle size={20} weight="fill" />

                            <div className="text-xl">Mix song</div>
                          </div>
                        </div>

                        <div className="hidden w-fit rounded-3xl bg-red-500 px-4 py-2 text-xl font-semibold md:flex">
                          17,4 Tr lượt nghe
                        </div>
                      </div>

                      <div className="text-base text-zinc-500">
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

          <div className="mt-8 px-3 md:mx-16 md:mt-0">
            {MUSICSSINGER.filter((item) => item.id === idSinger).map((item) => (
              <div key={item.id}>
                <AudioSingerItem music={item} />
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
