"use client";
import { AudioBar } from "./audio-bar";

import { CarouselAudio } from "./carousel-audio";
import { HeaderMusicPage } from "./header-music-page";
import { MenuBar } from "./menu-bar";

import { TableRanking } from "./table-ranking";

import { SingerList } from "./singer-list";
import { Footer } from "../profile/footer";

import { MenuBarMobile } from "./menu-bar-mobile";

import { CarouselAudioPlaylist } from "./carousel-audio-playlist";

import { PickForYou } from "./pick-for-you";
import { useScroll, useTransform, motion, useSpring } from "framer-motion";

export function MusicPage() {
  const { scrollY } = useScroll();
  const rawOpacity = useTransform(scrollY, [50, 100], [0, 1]);
  const smoothOpacity = useSpring(rawOpacity, {
    stiffness: 300,
    damping: 20,
  });

  return (
    <div className="flex font-apple">
      <MenuBar />

      <motion.div
        className="fixed inset-x-0 top-2 z-[1000] flex justify-center text-xl text-black dark:text-white"
        style={{ opacity: smoothOpacity }}
      >
        Home
      </motion.div>

      <div className="mx-auto w-full">
        <div className="relative z-10">
          <div className="pointer-events-none fixed top-0 z-50 h-24 w-full bg-gradient-to-b from-white via-white/50 to-transparent dark:from-black dark:via-black/50" />
          {/* <div className="pointer-events-none fixed bottom-0 z-50 h-20 w-full bg-gradient-to-t from-white to-transparent dark:from-black dark:via-black/50 md:h-20" /> */}

          <div className="md:ml-[270px]">
            <HeaderMusicPage />
          </div>

          <div className="">
            <div className="mt-4">
              <PickForYou />
            </div>

            <div className="mt-8 flex justify-start">
              <CarouselAudio />
            </div>

            <div className="mt-8 flex justify-start">
              <CarouselAudioPlaylist />
            </div>

            <div className="mt-6">
              <TableRanking home />
            </div>

            <div className="my-8">
              <SingerList home />
            </div>

            <div className="md:ml-60">
              <Footer />
            </div>
          </div>
        </div>

        <div className="my-40">
          <AudioBar />
          <MenuBarMobile />
        </div>
      </div>
    </div>
  );
}
