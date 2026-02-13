import { HeaderMusicPage } from "./header-music-page";
import { MenuBar } from "./menu-bar";
import { TableRanking } from "./table-ranking";
import { SingerList } from "./singer-list";
import { MenuBarMobile } from "./menu-bar-mobile";
import { PickForYou } from "./pick-for-you";
import { MotionHeaderMusic } from "./component/motion-header-music";
import CarouselAudio from "./carousel-audio";
import { AudioBar } from "./audio-bar";
import { LyricSidebar } from "./lyric-sidebar";
import { NewCarouselAudioPlaylist } from "./new-carousel-audio-playlist";
import { RecentCarouselAudio } from "./recent-carousel-audio";
import { NewCarouselAudio } from "./new-carousel-audio";
import { CarouselTopic } from "./carousel-topic";
import { SuggestCarouselAudio } from "./suggest-carousel-audio";
import { Suspense } from "react";

function SectionSkeleton() {
  return (
    <div className="mx-2 h-44 animate-pulse rounded-2xl bg-zinc-200/70 dark:bg-zinc-800/60 md:mx-0 md:ml-[270px]" />
  );
}

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
              <Suspense fallback={<SectionSkeleton />}>
                <SuggestCarouselAudio />
              </Suspense>
            </div>

            <div className="flex justify-start">
              <Suspense fallback={<SectionSkeleton />}>
                <CarouselTopic />
              </Suspense>
            </div>

            <div className="mt-4 flex justify-start">
              <RecentCarouselAudio />
            </div>

            <div className="mt-4 flex justify-start">
              <Suspense fallback={<SectionSkeleton />}>
                <NewCarouselAudio />
              </Suspense>
            </div>

            <div className="mt-4 flex justify-start">
              <NewCarouselAudioPlaylist />
            </div>

            <div className="mt-4 flex justify-start">
              <Suspense fallback={<SectionSkeleton />}>
                <CarouselAudio />
              </Suspense>
            </div>

            <div className="mt-4">
              <TableRanking />
            </div>

            <div className="mt-4">
              <Suspense fallback={<SectionSkeleton />}>
                <SingerList />
              </Suspense>
            </div>
          </>
        </div>

        <LyricSidebar />

        <div className="my-40">
          <AudioBar />
          <MenuBarMobile />
        </div>
      </div>
    </div>
  );
}
