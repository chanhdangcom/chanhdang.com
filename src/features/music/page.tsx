import { AudioBar } from "./audio-bar";
import { CarouselAudioPlaylist } from "./carousel-audio-playlist";
import { CarouselAudio } from "./carousel-audio.";
import { HeaderMusicPage } from "./header-music-page";
import { MenuBar } from "./menu-bar";

import { TableRanking } from "./table-ranking";

export function MusicPage() {
  return (
    <div className="flex bg-zinc-500/10 dark:bg-zinc-800/10">
      <MenuBar />

      <div className="mx-auto w-full">
        <div className="bg-opacity-70 bg-gradient-to-b from-[#112233] to-black backdrop-blur-md">
          <HeaderMusicPage />

          <div className="mt-8 flex justify-center"></div>
          <div className="mt-8 flex justify-center">
            <CarouselAudio />
          </div>
          <div className="mt-8 flex justify-center">
            <TableRanking />
          </div>
        </div>

        <div className="mb-40 mt-8 flex justify-center">
          <CarouselAudioPlaylist />
        </div>
        <div className="">
          <AudioBar />
        </div>
      </div>
    </div>
  );
}
