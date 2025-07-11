"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FastAverageColor } from "fast-average-color";

const bars = new Array(13).fill(0);

type IPlay = {
  isPlay: boolean;
  coverUrl?: string;
};

export function DynamicIslandWave({ isPlay, coverUrl }: IPlay) {
  const [waveColor, setWaveColor] = useState("");

  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (!coverUrl) {
      setWaveColor(isDark ? "#111111" : "#fafafa");
      return;
    }

    const fac = new FastAverageColor();
    fac
      .getColorAsync(coverUrl)
      .then((color) => setWaveColor(color.hex))
      .catch(() => setWaveColor(isDark ? "#111111" : "#fafafa"));
  }, [coverUrl]);

  const getRandomHeight = () =>
    Array.from({ length: 6 }, () => `${Math.random() * 60 + 20}%`);

  return (
    <div className="relative flex h-6 w-fit items-center justify-center rounded-full px-1">
      {bars.map((_, i) => (
        <motion.div
          key={`bar-${i}`}
          className="mx-[1px] w-[2px] rounded-full"
          style={{
            backgroundColor: waveColor,
          }}
          animate={{
            height: isPlay
              ? getRandomHeight()
              : ["50%", "55%", "52%", "58%", "50%", "54%", "51%"],
          }}
          transition={{
            repeat: Infinity,
            duration: isPlay ? Math.random() * 0.5 + 0.4 : 1.2 + (i % 5) * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default DynamicIslandWave;
