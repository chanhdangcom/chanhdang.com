"use client";
import * as React from "react";

// import { Playlist } from "@phosphor-icons/react/dist/ssr";
import { MUSICSPLAYLIST } from "./data/music-page-playlist";
import { PlaylistItem } from "./component/playlist-item";

export function CarouselAudioPlaylist() {
  return (
    <div className="w-full text-zinc-50 md:max-w-7xl">
      <div className="container mb-2 flex gap-1 text-3xl font-semibold">
        {/* <Playlist size={32} weight="fill" className="text-zinc-500" /> */}

        <div className="text-zinc-50">Playlist</div>
      </div>

      <div className="flex overflow-x-auto md:mx-auto md:justify-center">
        {MUSICSPLAYLIST.map((music) => (
          <div key={music.id} className="shrink-0">
            <PlaylistItem music={music} />
          </div>
        ))}
      </div>
    </div>
  );
}
