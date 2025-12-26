"use client";

import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { AuidoItem } from "./component/audio-item";
import { useAudio } from "@/components/music-provider";
import { ScrollCarouselItem } from "./component/scroll-carousel-item";
import { useScrollCarousel } from "@/hooks/use-scroll-carousel";

export function NewAuidoListClient({ musics }: { musics: IMusic[] }) {
  const { handlePlayAudio } = useAudio();
  const { scrollRef, scrollLeft, scrollRight, canScrollLeft, canScrollRight } =
    useScrollCarousel();

  return (
    <ScrollCarouselItem
      scrollLeft={scrollLeft}
      scrollRight={scrollRight}
      canScrollLeft={canScrollLeft}
      canScrollRight={canScrollRight}
    >
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-hide md:snap-none"
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {musics
          .slice(-8)
          .reverse()
          .map((music, index) => (
            <div key={music.id} className="snap-start">
              <div
                className={`w-full shrink-0 ${
                  index === 0 ? "ml-2 md:ml-[270px]" : ""
                }`}
              >
                <AuidoItem
                  music={music}
                  handlePlay={() => handlePlayAudio(music)}
                />
              </div>
            </div>
          ))}
      </div>
    </ScrollCarouselItem>
  );
}
