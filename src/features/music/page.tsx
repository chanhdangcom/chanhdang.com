"use client";
import { AudioBar } from "./audio-bar";
import { CarouselAudioPlaylist } from "./carousel-audio-playlist";
import { CarouselAudio } from "./carousel-audio";
import { HeaderMusicPage } from "./header-music-page";
import { MenuBar } from "./menu-bar";

import { TableRanking } from "./table-ranking";

import { CarouselReplayAudio } from "./carousel-replay-audio";
import { MusicType } from "./music-type";
import { SingerList } from "./singer-list";
import { useState, useEffect } from "react";
import { FastAverageColor } from "fast-average-color";
import { useAudio } from "@/components/music-provider";

export function MusicPage() {
  const [waveColor, setWaveColor] = useState("");
  const { currentMusic } = useAudio();

  useEffect(() => {
    if (!currentMusic?.cover) {
      setWaveColor("rgba(128, 128, 128, 0.6)"); // Xanh dương đậm mờ
      return;
    }

    const fac = new FastAverageColor();
    fac
      .getColorAsync(currentMusic?.cover)
      .then((color) => {
        const rgbaColor = `rgba(${color.value[0]}, ${color.value[1]}, ${color.value[2]}, 0.8)`;
        setWaveColor(rgbaColor);
      })
      .catch(() => setWaveColor("rgba(250, 250, 250, 0.6)"));
  }, [currentMusic?.cover]);

  return (
    <div className="flex">
      <MenuBar />

      <div className="mx-auto w-full">
        <div
          className="relative z-10"
          style={{
            background: `linear-gradient(to right, #101012, ${waveColor}),
                         linear-gradient(to bottom, ${waveColor}, rgba(20, 20, 25, 0.9), #101012)`,
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            backgroundBlendMode: "multiply",
          }}
        >
          <HeaderMusicPage />

          <div className="ml-28 hidden md:flex">
            <MusicType />
          </div>

          <div className="mt-8">
            <CarouselReplayAudio />
          </div>

          <div className="mt-8 flex justify-center">
            <CarouselAudio />
          </div>

          <div className="mt-8 flex justify-center">
            <SingerList />
          </div>

          <div className="mt-8 flex justify-center">
            <TableRanking />
          </div>

          <div className="mb-28 mt-8 flex justify-center md:mb-40">
            <CarouselAudioPlaylist />
          </div>
        </div>

        <AudioBar />
      </div>
    </div>
  );
}
