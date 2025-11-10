// import { AudioBar } from "./audio-bar";
import { HeaderMusicPage } from "./header-music-page";
import { MenuBar } from "./menu-bar";
import { TableRanking } from "./table-ranking";
import { SingerList } from "./singer-list";
import { MenuBarMobile } from "./menu-bar-mobile";
import { PickForYou } from "./pick-for-you";
import { MotionHeaderMusic } from "./component/motion-header-music";
import { Footer } from "@/app/[locale]/features/profile /footer";
import CarouselAudio from "./carousel-audio";
import { AudioBar } from "./audio-bar";
import NewCarouselAudio from "./new-carousel-audio";
import { CarouselAudioPlaylist } from "./carousel-audio-playlist";
import RecentCarouselAudio from "./recent-carousel-audio";
import { NewCarouselAudioPlaylist } from "./new-carousel-audio-playlist";

// import { useDisableRightClick } from "../../hooks/use-disable-right-click";

export function MusicPage() {
  // useDisableRightClick();

  return (
    <div className="flex font-apple">
      <MotionHeaderMusic />
      <MenuBar />

      {/* <div className="absolute top-0 h-80 w-full bg-gradient-to-r from-red-500 via-blue-500 to-orange-400 opacity-30 blur-xl md:hidden md:h-60 md:to-transparent" /> */}

      <div className="mx-auto w-full">
        <div className="relative z-10">
          {/* <div className="pointer-events-none fixed left-0 top-0 z-50 h-10 w-full bg-gradient-to-b from-zinc-50/60 to-transparent dark:from-zinc-950/60">
            <div className="h-10 w-full backdrop-blur-[1px]" />
          </div> */}

          <div className="pointer-events-none fixed bottom-0 left-0 z-10 h-[77px] w-full backdrop-blur-[1px]" />

          <div className="md:ml-[270px]">
            <HeaderMusicPage />
          </div>

          <>
            <div>
              <PickForYou />
            </div>

            <div className="mt-6 flex justify-start">
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

            <div className="mt-4 flex justify-start">
              <CarouselAudioPlaylist />
            </div>

            <div className="mt-4">
              <TableRanking home />
            </div>

            <div className="my-4">
              <SingerList home />
            </div>

            <div className="md:ml-60">
              <Footer />
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
