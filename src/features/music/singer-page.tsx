"use client";
import Image from "next/image";

import { ShareFat, Shuffle } from "@phosphor-icons/react/dist/ssr";
import { MUSICS } from "./data/music-page-singer";
import { AudioSingerItem } from "./component/audio-singer-item";
import { HeaderMusicSingerPage } from "./header-music-singer-page";
import { AudioBar } from "./audio-bar";
import { motion } from "motion/react";
import { AnimatePresence } from "framer-motion";

type IProp = {
  idSinger: string;
};

export function SingerPage({ idSinger }: IProp) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 h-screen bg-zinc-950"
        layoutId="singer"
      >
        <AudioBar />
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950"></div>

          <div className="absolute inset-0">
            <HeaderMusicSingerPage />

            <div className="mt-24 space-y-4 p-4 text-xl font-semibold">
              {MUSICS.filter((item) => item.id === idSinger).map((item) => (
                <div key={item.id}>{item.singer}</div>
              ))}

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

          {MUSICS.filter((item) => item.id === idSinger).map((item) => (
            <div key={item.id}>
              <Image
                alt=""
                height={300}
                width={300}
                src={item.cover}
                className="h-[35vh] w-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="container">
          {/* <div className="text-xl font-semibold">Song</div> */}
          {MUSICS.filter((item) => item.id === idSinger).map((item) => (
            <div key={item.id}>
              <AudioSingerItem music={item} />
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
