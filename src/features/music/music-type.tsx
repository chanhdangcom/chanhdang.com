"use client";

import { useRef, useState } from "react";
import { MusicTypeItem } from "./component/music-type-item";
import { AudioItemOrder } from "./component/audio-item-order";
import { MUSICS } from "./data/music-page";
import { useAudio } from "@/components/music-provider";
import Link from "next/link";
import { motion } from "framer-motion";
import { useOutsideClick } from "../profile/hook/use-outside-click";

export function MusicType() {
  const { handlePlayAudio } = useAudio();
  const [isTitle, setIsTitle] = useState("");
  const [isHide, setIsHide] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setIsHide(true), !isHide);

  return (
    <div className="z-10">
      <div
        onClick={() => setIsHide(false)}
        className="flex items-center gap-4 overflow-x-auto font-semibold text-black dark:text-white"
      >
        <MusicTypeItem title="Relax" onClick={(title) => setIsTitle(title)} />
        <MusicTypeItem title="Sad" onClick={(title) => setIsTitle(title)} />
        <MusicTypeItem
          title="Feel good"
          onClick={(title) => setIsTitle(title)}
        />
        <MusicTypeItem title="RAP" onClick={(title) => setIsTitle(title)} />
      </div>

      {!isHide && (
        <div ref={ref}>
          {MUSICS.filter((item) => item.type === isTitle).map((item) => (
            <div key={item.id} className="container mt-4 space-y-4">
              <motion.div
                layout
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="rounded-2xl p-1 hover:bg-zinc-900"
              >
                <Link href="/music">
                  <AudioItemOrder
                    music={item}
                    handlePlay={() => handlePlayAudio(item)}
                    className="size-20"
                    classNameOrder="w-96"
                  />
                </Link>
              </motion.div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
