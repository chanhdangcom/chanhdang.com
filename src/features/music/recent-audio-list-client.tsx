"use client";

import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { AuidoItem } from "./component/audio-item";
import { useAudio } from "@/components/music-provider";
import { ScrollCarouselItem } from "./component/scroll-carousel-item";
import { useScrollCarousel } from "@/hooks/use-scroll-carousel";

export function RecentAuidoListClient({ musics }: { musics: IMusic[] }) {
  const { handlePlayAudio } = useAudio();
  const { scrollRef, scrollLeft, scrollRight } = useScrollCarousel();

  return (
    <>
      <ScrollCarouselItem scrollLeft={scrollLeft} scrollRight={scrollRight}>
        <div
          ref={scrollRef}
          className="grid snap-x snap-mandatory grid-flow-col grid-rows-1 overflow-x-auto scroll-smooth scrollbar-hide md:snap-none"
        >
          {musics.slice(0, 8).map((music, index) => (
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
    </>
  );
}
