"use client";

import * as React from "react";

import { AuidoItem } from "./component/audio-item";

import { useAudio } from "@/components/music-provider";
import { MUSICS } from "./data/music-page";
import {
  CaretLeft,
  CaretRight,
  // MusicNotesSimple,
} from "@phosphor-icons/react/dist/ssr";

export function CarouselAudio() {
  const { handlePlayAudio } = useAudio();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 100; // Khoảng cách cuộn mỗi lần
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      if (direction === "left" && scrollLeft <= 0) return; // Đã ở đầu, không cuộn nữa
      if (direction === "right" && scrollLeft + clientWidth >= scrollWidth)
        return; // Đã ở cuối, không cuộn nữa

      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full rounded-3xl text-zinc-50 md:max-w-6xl">
      <div className="flex justify-between">
        <div className="flex gap-1 text-3xl font-bold">
          <div className="px-1 text-xl text-zinc-50">Trending Now</div>
        </div>

        <div className="flex gap-2 rounded-full bg-zinc-950">
          <button
            className="flex size-8 items-center justify-center rounded-full bg-zinc-800 p-1"
            onClick={() => scroll("left")}
          >
            <CaretLeft size={16} />
          </button>

          <button
            className="flex size-8 items-center justify-center rounded-full bg-zinc-800 p-1"
            onClick={() => scroll("right")}
          >
            <CaretRight size={16} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="scrollbar-hide flex overflow-x-auto">
        {MUSICS.map((music) => (
          <div key={music.id} className="shrink-0">
            <AuidoItem
              music={music}
              handlePlay={() => handlePlayAudio(music)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
