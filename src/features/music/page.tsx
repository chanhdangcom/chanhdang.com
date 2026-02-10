// import { AudioBar } from "./audio-bar";

import { HeaderMusicPage } from "./header-music-page";
import { MenuBar } from "./menu-bar";
import { TableRanking } from "./table-ranking";
import { SingerList } from "./singer-list";
import { MenuBarMobile } from "./menu-bar-mobile";
import { PickForYou } from "./pick-for-you";
import { MotionHeaderMusic } from "./component/motion-header-music";
import CarouselAudio from "./carousel-audio";
import { AudioBar } from "./audio-bar";

// import { CarouselAudioPlaylist } from "./carousel-audio-playlist";

import { NewCarouselAudioPlaylist } from "./new-carousel-audio-playlist";
import { RecentCarouselAudio } from "./recent-carousel-audio";
import { NewCarouselAudio } from "./new-carousel-audio";
import { CarouselTopic } from "./carousel-topic";
import { SuggestCarouselAudio } from "./suggest-carousel-audio";

export function MusicPage() {
  return (
    <div className="flex bg-zinc-100 font-apple dark:bg-zinc-950">
      <MotionHeaderMusic />
      <MenuBar />

      <div className="mx-auto w-full">
        <div className="relative z-10">
          <div className="z-20 mb-2 md:ml-[270px]">
            <HeaderMusicPage />
          </div>

          <>
            <div className="mb-3">
              <PickForYou />
            </div>

            <div className="mt-4 flex justify-start">
              <SuggestCarouselAudio />
            </div>

            <div className="flex justify-start">
              <CarouselTopic />
            </div>

            <div className="mt-4 flex justify-start">
              <RecentCarouselAudio />
            </div>

            <div className="mt-4 flex justify-start">
              <NewCarouselAudio />
            </div>

            <div className="mt-4 flex justify-start">
              <NewCarouselAudioPlaylist />
            </div>

            <div className="mt-4 flex justify-start">
              <CarouselAudio />
            </div>

            <div className="mt-4">
              <TableRanking />
            </div>

            <div className="mt-4">
              <SingerList />
            </div>
          </>
        </div>

        <div className="my-40">
          <AudioBar />
          <MenuBarMobile />
        </div>
      </div>
    </div>
  );
}
