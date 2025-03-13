import { AudioBar } from "./audio-bar";
import { CarouselAudioPlaylist } from "./carousel-audio-playlist";
import { CarouselAudio } from "./carousel-audio.";
import { HeaderMusicPage } from "./header-music-page";
import { TableRanking } from "./table-ranking";

export function MusicPage() {
  return (
    <div className="">
      {/* <HeaderMotion /> */}

      <HeaderMusicPage />

      <div className="container mt-8 flex justify-center">
        <CarouselAudio />
      </div>

      <div className="container mt-8 flex justify-center">
        <TableRanking />
      </div>

      <div className="container mb-40 mt-8 flex justify-center">
        <CarouselAudioPlaylist />
      </div>

      <div className="">
        <AudioBar />
      </div>
    </div>
  );
}
