"use client";

import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { AuidoItem } from "./component/audio-item";
import { useAudio } from "@/components/music-provider";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { useRef } from "react";

export function AuidoListClient({ musics }: { musics: IMusic[] }) {
  const { handlePlayAudio } = useAudio();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <>
      <div
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 z-50 flex h-40 -translate-y-1/2 items-center rounded-r-xl border border-white/10 bg-zinc-500/60 text-xl opacity-40 backdrop-blur-sm duration-200 hover:opacity-100 md:left-[256px]"
      >
        <CaretLeft size={32} className="size-10 text-white" />
      </div>

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

      <div
        onClick={scrollRight}
        className="absolute right-0 top-1/2 flex h-40 -translate-y-1/2 items-center rounded-l-xl border border-white/10 bg-zinc-700/60 text-xl opacity-40 backdrop-blur-sm duration-200 hover:opacity-100"
      >
        <CaretRight size={32} className="size-10 text-white" />
      </div>
    </>
  );
}
