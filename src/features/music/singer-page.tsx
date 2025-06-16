"use client";
import Image from "next/image";

import { ShareFat, Shuffle } from "@phosphor-icons/react/dist/ssr";

import { AudioSingerItem } from "./component/audio-singer-item";

import { AudioBar } from "./audio-bar";
import { motion } from "motion/react";
import { AnimatePresence } from "framer-motion";
import { MUSICSSINGER } from "./data/music-page-singer";
import { MenuBar } from "./menu-bar";
import { HeaderMusicPage } from "./header-music-page";
import { HeaderMusicSingerPage } from "./header-music-singer-page";

type IProp = {
  idSinger: string;
};

export function SingerPage({ idSinger }: IProp) {
  return (
    <div className="flex">
      <MenuBar />

      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 mx-auto h-screen bg-zinc-950 md:ml-64 md:max-w-full"
          layoutId="singer"
        >
          <AudioBar />

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950 md:hidden"></div>

            <div className="hidden md:flex">
              <HeaderMusicPage />
            </div>

            <div className="absolute inset-0 md:hidden">
              <HeaderMusicSingerPage />
              <div className="mt-20 space-y-4 p-4 text-xl font-semibold">
                {MUSICSSINGER.filter((item) => item.id === idSinger).map(
                  (item) => (
                    <div className="text-3xl" key={item.id}>
                      {item.singer}
                    </div>
                  )
                )}

                <div className="flex gap-2">
                  <div className="flex w-fit items-center justify-center gap-2 rounded-3xl border bg-zinc-50 px-3 py-1 text-zinc-950">
                    <Shuffle size={25} />

                    <div className="text-base">Mix song</div>
                  </div>

                  <div className="flex w-fit items-center justify-center gap-2 rounded-3xl border bg-zinc-50 px-3 py-1 text-zinc-950">
                    <ShareFat size={25} />

                    <div className="text-base">Share</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-4 hidden rounded-lg bg-gradient-to-b from-zinc-900 to-zinc-950 md:flex">
              <div className="flex items-center">
                {MUSICSSINGER.filter((item) => item.id === idSinger).map(
                  (item) => (
                    <div key={item.id}>
                      <Image
                        alt=""
                        height={300}
                        width={300}
                        src={item.cover}
                        className="m-8 flex size-60 rounded-lg object-cover shadow-2xl"
                      />
                    </div>
                  )
                )}

                {MUSICSSINGER.filter((item) => item.id === idSinger).map(
                  (item) => (
                    <div className="space-y-6 text-6xl" key={item.id}>
                      <div>
                        <div className="text-4xl font-semibold">
                          Các bài hát của
                        </div>
                        <div className="font-bold"> {item.singer}</div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <div className="flex w-fit items-center justify-center gap-2 rounded-3xl border bg-zinc-50 px-3 py-1 text-zinc-950">
                            <Shuffle size={25} />

                            <div className="text-base">Mix song</div>
                          </div>

                          <div className="flex w-fit items-center justify-center gap-2 rounded-3xl border bg-zinc-50 px-3 py-1 text-zinc-950">
                            <ShareFat size={25} />

                            <div className="text-base">Share</div>
                          </div>
                        </div>

                        <div className="hidden w-fit rounded-2xl bg-red-500 px-4 py-2 text-xl font-semibold md:flex">
                          17,4 Tr lượt nghe
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="w-full md:hidden">
              {MUSICSSINGER.filter((item) => item.id === idSinger).map(
                (item) => (
                  <div key={item.id}>
                    <Image
                      alt=""
                      height={300}
                      width={300}
                      src={item.cover}
                      className="mx-auto flex h-[35vh] w-full object-cover md:h-[55vh]"
                    />
                  </div>
                )
              )}
            </div>

            {/* {MUSICSSINGER.filter((item) => item.id === idSinger).map((item) => (
              <div key={item.id}>
                <Image
                  alt=""
                  height={300}
                  width={300}
                  src={item.cover}
                  className="mx-auto h-[35vh] w-full object-cover md:h-[55vh] md:w-auto"
                />
              </div>
            ))} */}
          </div>

          <div className="mt-4 px-3 md:mx-16 md:mt-0">
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
