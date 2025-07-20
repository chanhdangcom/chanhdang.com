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

export function MusicPage() {
  return (
    <div className="flex font-apple">
      <MenuBar />

      <div className="mx-auto w-full">
        <div className="relative z-10">
          <div className="fixed top-0 z-50 h-24 w-full bg-gradient-to-b from-white via-white/60 to-transparent dark:from-black/95 dark:via-black/60"></div>

          <HeaderMusicPage />

          <div className="md:mx-4">
            <div className="rounded-3xl from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 md:bg-gradient-to-b md:p-4">
              <div className="mt-4">
                <PickForYou />
              </div>

              <div className="mt-4 flex justify-start">
                <CarouselAudioPlaylist />
              </div>

              <div className="mt-2 flex justify-start">
                <CarouselAudio />
              </div>

              <div className="mt-2">
                <TableRanking />
              </div>

              <div className="my-2">
                <SingerList />
              </div>

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
