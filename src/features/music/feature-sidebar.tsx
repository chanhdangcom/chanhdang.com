"use client";

import { Infinity, Shuffle } from "@phosphor-icons/react/dist/ssr";
import { MUSICS } from "./data/music-page";
import { AudioItemOrder } from "./component/audio-item-order";
import { useAudio } from "@/components/music-provider";
import { useEffect, useState } from "react";

export function FeatureSidebar() {
  const { handlePlayAudio, handlePlayRandomAudio } = useAudio();
  const [isOpen, setIsOpen] = useState(false);

  // Lắng nghe click từ AudioBar để bật/tắt sidebar lyric
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleToggle = () => {
      setIsOpen((prev) => !prev);
    };

    window.addEventListener("toggle-feature-sidebar", handleToggle);
    return () => {
      window.removeEventListener("toggle-feature-sidebar", handleToggle);
    };
  }, []);

  if (isOpen) {
    return (
      <aside className="fixed inset-y-0 right-0 z-50 hidden h-full w-[24vw] overflow-hidden border-l border-white/10 bg-zinc-950/80 shadow-[0_0_40px_rgba(0,0,0,0.65)] backdrop-blur-2xl lg:block">
        <div className="pointer-events-none absolute inset-0 -z-10" />

        <div className="flex h-full flex-col space-y-3 px-4 py-2">
          <div className="flex w-full justify-between gap-2">
            <div className="flex w-full cursor-pointer justify-center rounded-full bg-white/10 px-6 py-2 text-white hover:bg-white/20">
              <Infinity size={25} weight="regular" />
            </div>

            <div
              className="flex w-full cursor-pointer justify-center rounded-full bg-white/10 px-6 py-2 text-white hover:bg-white/20"
              onClick={() => handlePlayRandomAudio()}
            >
              <Shuffle size={25} weight="regular" />
            </div>
          </div>

          <div className="border-b border-white/10 pb-2 text-xl font-bold text-white">
            Continue Playing
          </div>

          <div className="flex flex-1 flex-col space-y-2 overflow-y-auto">
            {MUSICS.map((music) => (
              <AudioItemOrder
                key={music.id}
                music={music}
                handlePlay={() => handlePlayAudio(music)}
                titleVariant="alwaysWhite"
              />
            ))}
          </div>
        </div>
      </aside>
    );
  }
}
