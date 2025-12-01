import { RecentCarouselAudio } from "../recent-carousel-audio";
import { NewCarouselAudioPlaylist } from "../new-carousel-audio-playlist";

// Server component: chỉ render phần carousels
export function SearchSection() {
  return (
    <div
      id="search-carousels"
      className="absolute top-16 z-10 hidden w-full transition-opacity duration-200 md:block"
    >
      <RecentCarouselAudio />

      <NewCarouselAudioPlaylist />
    </div>
  );
}
