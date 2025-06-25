"use client";
import { AudioBar } from "./audio-bar";
// import { CarouselAudioPlaylist } from "./carousel-audio-playlist";
import { CarouselAudio } from "./carousel-audio";
import { HeaderMusicPage } from "./header-music-page";
import { MenuBar } from "./menu-bar";

import { TableRanking } from "./table-ranking";

import { CarouselReplayAudio } from "./carousel-replay-audio";
import { SingerList } from "./singer-list";
import { Footer } from "../profile/footer";

export function MusicPage() {
  return (
    <div className="flex">
      <MenuBar />

      <div className="mx-auto w-full">
        <div className="relative z-10">
          <HeaderMusicPage />

          <div className="md:mx-4">
            <div className="rounded-3xl from-zinc-900 to-zinc-950 md:bg-gradient-to-b md:p-4">
              <div className="mx-8 my-2 flex justify-center bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text pb-5 font-handwritten text-4xl text-transparent md:mt-8 md:hidden md:text-5xl">
                Chanh Dang Hello
              </div>

              <div className="flex justify-start">
                <CarouselAudio />
              </div>

              <div className="my-8">
                <SingerList />
              </div>

              <div className="flex justify-start">
                <CarouselAudio />
              </div>

              <div className="flex items-center justify-start gap-4">
                <div className="my-8">
                  <CarouselReplayAudio />
                </div>

                <div className="hidden md:flex">
                  <TableRanking />
                </div>
              </div>

              <div className="mb-8 flex justify-start md:hidden">
                <TableRanking />
              </div>

              {/* <div className="mb-28 mt-8 flex justify-start md:ml-8">
            <CarouselAudioPlaylist />
          </div> */}

              <Footer />
            </div>
          </div>
        </div>

        <div className="my-32">
          <AudioBar />
        </div>
      </div>
    </div>
  );
}
