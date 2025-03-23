"use client";

import * as React from "react";

import { AuidoItem } from "./component/audio-item";

import { useAudio } from "@/components/music-provider";

import { MUSICS } from "../profile/data/music";
import Image from "next/image";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";

export function CarouselReplayAudio() {
  const { handlePlayAudio } = useAudio();

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300; // Khoảng cách cuộn mỗi lần
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
    <div className="md:hidden">
      <div className="container flex items-center justify-between gap-2 backdrop-blur-md">
        <div className="flex gap-2">
          <Image
            src="/img/avatar.jpeg"
            height={64}
            width={64}
            alt="avt"
            className="size-14 rounded-full border border-zinc-800"
          />
          <div>
            <div className="text-lg text-zinc-400">Nguyễn Chánh Đang</div>
            <div className="text-xl font-semibold">Replay</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="flex size-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 p-1"
            onClick={() => scroll("left")}
          >
            <CaretLeft size={16} />
          </button>

          <button
            className="flex size-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 p-2"
            onClick={() => scroll("right")}
          >
            <CaretRight size={16} />
          </button>
        </div>
      </div>

      <div className="mx-auto w-full rounded-lg border-b border-zinc-800 text-zinc-50 backdrop-blur-md md:max-w-5xl">
        <div ref={scrollRef} className="flex overflow-x-auto">
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
    </div>
  );
}
