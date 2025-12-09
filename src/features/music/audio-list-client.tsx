"use client";

import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { AuidoItem } from "./component/audio-item";
import { useAudio } from "@/components/music-provider";
import { useScrollCarousel } from "@/hooks/use-scroll-carousel";
import { ScrollCarouselItem } from "./component/scroll-carousel-item";

export function AuidoListClient({ musics }: { musics: IMusic[] }) {
  const { handlePlayAudio } = useAudio();

  const { scrollRef, scrollLeft, scrollRight } = useScrollCarousel();

  return (
    <>
      <ScrollCarouselItem scrollLeft={scrollLeft} scrollRight={scrollRight}>
        <div
          ref={scrollRef}
          className="relative grid snap-x snap-mandatory grid-flow-col grid-rows-2 overflow-x-auto scroll-smooth scrollbar-hide md:snap-none"
        >
          {musics.map((music, index) => (
            <div key={music.id} className="snap-start">
              <div
                className={`w-full shrink-0 ${
                  index === 0 || index === 1 ? "ml-2 md:ml-[270px]" : ""
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
    </>
  );
}
