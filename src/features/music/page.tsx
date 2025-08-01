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
import { MotionHeaderMusic } from "./component/motion-header-music";
// import { useDisableRightClick } from "../../hooks/use-disable-right-click";

export function MusicPage() {
  // useDisableRightClick();

  return (
    <div className="flex font-apple">
      <MenuBar />

      <MotionHeaderMusic />

      <div className="mx-auto w-full">
        <div className="relative z-10">
          <div className="pointer-events-none fixed top-0 z-50 h-24 w-full bg-gradient-to-b from-white via-white/50 to-transparent dark:from-black dark:via-black/50" />

          <div className="md:ml-[270px]">
            <HeaderMusicPage />
          </div>

          <div>
            <div>
              <PickForYou />
            </div>

            <div className="mt-6 flex justify-start">
              <CarouselAudio />
            </div>

            <div className="mt-6 flex justify-start">
              <CarouselAudioPlaylist />
            </div>

            <div className="mt-6">
              <TableRanking home />
            </div>

            <div className="my-6">
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
