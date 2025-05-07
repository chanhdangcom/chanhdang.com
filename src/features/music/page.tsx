"use client";
import { AudioBar } from "./audio-bar";
import { CarouselAudioPlaylist } from "./carousel-audio-playlist";
import { CarouselAudio } from "./carousel-audio";
import { HeaderMusicPage } from "./header-music-page";
import { MenuBar } from "./menu-bar";

import { TableRanking } from "./table-ranking";

import { CarouselReplayAudio } from "./carousel-replay-audio";
import { MusicType } from "./music-type";
import { SingerList } from "./singer-list";

export function MusicPage() {
  return (
    <div className="flex">
      <MenuBar />

      <div className="mx-auto w-full">
        <div className="relative z-10">
          <HeaderMusicPage />

          <div className="ml-8 mt-4 hidden md:flex">
            <MusicType />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="mt-8 md:ml-8">
              <CarouselReplayAudio />
            </div>

            <div className="hidden md:flex">
              <TableRanking />
            </div>
          </div>

          <div className="mt-8 flex justify-start md:ml-8">
            <CarouselAudio />
          </div>

          <div className="mt-8 flex justify-start md:ml-8">
            <SingerList />
          </div>

          <div className="mt-8 flex justify-center">
            <TableRanking />
          </div>

          <div className="mb-28 mt-8 flex justify-start md:mb-40 md:ml-8">
            <CarouselAudioPlaylist />
          </div>
        </div>

        <AudioBar />
      </div>
    </div>
  );
}
