"use client";

import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carouse";
import { AuidoItem } from "./component/audio-item";

import { useAudio } from "@/components/music-provider";
import { MUSICS } from "./data/music-page";
import { MusicNotesSimple } from "@phosphor-icons/react/dist/ssr";

export function CarouselAudio() {
  const { handlePlayAudio } = useAudio();

  return (
    <Carousel className="w-full max-w-4xl rounded-3xl border-b p-2 shadow-sm backdrop-blur-md dark:border-zinc-800">
      <div className="font-bol mb-2 flex gap-1 text-2xl">
        <MusicNotesSimple size={32} weight="fill" className="text-pink-500" />

        <div>Single song</div>
      </div>
      <CarouselContent>
        {MUSICS.map((music) => (
          <CarouselItem
            key={music.id}
            className="flex items-center justify-center py-2 md:basis-1/2 lg:basis-1/5"
          >
            <AuidoItem
              title={music.title}
              singer={music.singer}
              cover={music.cover}
              handlePlay={() => handlePlayAudio(music)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
