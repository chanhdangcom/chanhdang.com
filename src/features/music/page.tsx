import { AudioBar } from "./audio-bar";
import { CarouselAudioPlaylist } from "./carousel-audio-playlist";
import { CarouselAudio } from "./carousel-audio";
import { HeaderMusicPage } from "./header-music-page";
import { MenuBar } from "./menu-bar";

import { TableRanking } from "./table-ranking";

export function MusicPage() {
  return (
    <div className="flex bg-zinc-950">
      <MenuBar />

      <div className="mx-auto w-full">
        <div className="relative z-10 bg-opacity-50 bg-gradient-to-b from-[#112233] to-zinc-950 backdrop-blur-sm before:absolute before:inset-0 before:w-2/3 before:bg-gradient-to-r before:from-zinc-950 before:via-zinc-950/50 before:to-transparent">
          <HeaderMusicPage />

          <div className="mt-8 flex justify-center">
            <CarouselAudio />
          </div>

          <div className="mt-8 flex justify-center">
            <TableRanking />
          </div>

          <div className="mb-28 mt-8 flex justify-center md:mb-40">
            <CarouselAudioPlaylist />
          </div>
        </div>

        <AudioBar />
      </div>
    </div>
  );
}
