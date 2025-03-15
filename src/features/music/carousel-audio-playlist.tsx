"use client";

import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carouse";

import { Playlist } from "@phosphor-icons/react/dist/ssr";
import { MUSICS } from "./data/music-page-playlist";
import { PlaylistItem } from "./component/playlist-item";

export function CarouselAudioPlaylist() {
  return (
    <Carousel className="mt-4 w-full max-w-3xl rounded-3xl border-b p-2 shadow-sm dark:border-zinc-800">
      <div className="font-bol mb-2 flex gap-1 text-2xl">
        <Playlist size={32} weight="fill" className="text-pink-500" />

        <div>Playlist</div>
      </div>
      <CarouselContent>
        {MUSICS.map((music) => (
          <CarouselItem
            key={music.id}
            className="flex items-center justify-center py-2 md:basis-1/2 lg:basis-1/4"
          >
            <PlaylistItem
              id={music.id}
              title={music.title}
              singer={music.singer}
              cover={music.cover}
              musics={music.musics}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
