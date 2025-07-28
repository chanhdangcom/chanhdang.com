"use client";
import * as React from "react";

// import { Playlist } from "@phosphor-icons/react/dist/ssr";
import { MUSICSPLAYLIST } from "./data/music-page-playlist";
import { PlaylistItem } from "./component/playlist-item";

export function CarouselAudioPlaylist() {
  return (
    <div className="w-full md:max-w-full">
      <div className="flex overflow-x-auto scrollbar-hide md:mx-auto">
        {MUSICSPLAYLIST.map((music, index) => (
          <div
            key={music.id}
            className={`${index === 0 ? "ml-2 md:ml-[270px]" : ""} shrink-0`}
          >
            <PlaylistItem music={music} />
          </div>
        ))}
      </div>
    </div>
  );
}
