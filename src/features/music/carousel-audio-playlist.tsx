"use client";
import * as React from "react";

import { Playlist } from "@phosphor-icons/react/dist/ssr";
import { MUSICS } from "./data/music-page-playlist";
import { PlaylistItem } from "./component/playlist-item";

export function CarouselAudioPlaylist() {
  return (
    <div className="w-full rounded-lg border-b border-zinc-800 text-zinc-50 backdrop-blur-md md:max-w-3xl">
      <div className="font-bol container mb-2 flex gap-1 text-2xl">
        <Playlist size={32} weight="fill" className="text-pink-500" />

        <div>Playlist</div>
      </div>

      <div className="flex overflow-x-auto md:mx-auto md:justify-center">
        {MUSICS.map((music) => (
          <div key={music.id} className="shrink-0">
            <PlaylistItem music={music} />
          </div>
        ))}
      </div>
    </div>
  );
}
