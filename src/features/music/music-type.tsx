"use client";

import { useState } from "react";
import { MusicTypeItem } from "./component/music-type-item";
import { AudioItemOrder } from "./component/audio-item-order";
import { MUSICS } from "./data/music-page";
import { useAudio } from "@/components/music-provider";
import Link from "next/link";
import { motion } from "framer-motion";

export function MusicType() {
  const { handlePlayAudio } = useAudio();
  const [isTitle, setIsTitle] = useState("");

  return (
    <div>
      <div className="my-2 flex gap-2 overflow-x-auto font-semibold text-zinc-50">
        <MusicTypeItem title="Relax" onClick={(title) => setIsTitle(title)} />
        <MusicTypeItem title="Sad" onClick={(title) => setIsTitle(title)} />
        <MusicTypeItem
          title="Feel good"
          onClick={(title) => setIsTitle(title)}
        />
        <MusicTypeItem title="RAP" onClick={(title) => setIsTitle(title)} />
      </div>

      {MUSICS.filter((item) => item.type === isTitle).map((item) => (
        <div key={item.id} className="container mt-4 space-y-4">
          <motion.div
            key={item.id}
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
  );
}
