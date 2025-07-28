"use client";
import * as React from "react";

// import { Playlist } from "@phosphor-icons/react/dist/ssr";
import { MUSICSPLAYLIST } from "./data/music-page-playlist";
import { PlaylistItem } from "./component/playlist-item";

export function CarouselAudioPlaylist() {
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <div className="w-full md:max-w-full">
      <div
        ref={ref}
        className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide md:mx-auto"
      >
        {MUSICSPLAYLIST.map((music, index) => (
          <div key={music.id} className="shrink-0 snap-start">
            <div
              ref={ref}
              className={`${index === 0 ? "ml-2 md:ml-[270px]" : ""} `}
            >
              <PlaylistItem music={music} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
