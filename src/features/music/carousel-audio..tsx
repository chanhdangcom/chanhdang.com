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
    <Carousel className="mx-auto w-full max-w-sm rounded-3xl border-b p-2 shadow-sm backdrop-blur-md dark:border-zinc-800 md:max-w-5xl">
      <div className="font-bol container mb-2 flex gap-1 text-2xl">
        <MusicNotesSimple size={32} weight="fill" className="text-zinc-500" />

        <div>Single song</div>
      </div>
      <CarouselContent>
        {MUSICS.map((music) => (
          <CarouselItem
            key={music.id}
            className="flex basis-1/2 items-center justify-center py-2 lg:basis-1/6"
          >
            <AuidoItem
              music={music}
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
