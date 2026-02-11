"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FastAverageColor } from "fast-average-color";

const bars = new Array(6).fill(0);

type IPlay = {
  isPlay: boolean;
  coverUrl?: string;
  color?: string;
};

export function DynamicIslandWave({ isPlay, coverUrl, color }: IPlay) {
  const [waveColor, setWaveColor] = useState("");

  useEffect(() => {
    if (!coverUrl) {
      setWaveColor("#FFFFFF");
      return;
    }

    let cancelled = false;
    const fac = new FastAverageColor();

    // Fallback: deterministic color from URL when CORS blocks pixel access
    const fallbackFromUrl = (url: string) => {
      let hash = 0;
      for (let i = 0; i < url.length; i++) {
        hash = (hash << 5) - hash + url.charCodeAt(i);
        hash |= 0;
      }
      const hue = Math.abs(hash) % 360;
      const sat = 65;
      const light = 55;
      return `hsl(${hue} ${sat}% ${light}%)`;
    };

    // Try with crossOrigin image to avoid canvas tainting
    const img = new Image();
    img.crossOrigin = "anonymous";
    // Cache buster to avoid cached responses without CORS headers
    const sep = coverUrl.includes("?") ? "&" : "?";
    img.src = `${coverUrl}${sep}avg_color=1`;

    img.onload = () => {
      fac
        .getColorAsync(img)
        .then((color) => {
          if (!cancelled) setWaveColor(color.hex);
        })
        .catch(() => {
          if (!cancelled) setWaveColor(fallbackFromUrl(coverUrl));
        });
    };
    img.onerror = () => {
      if (!cancelled) setWaveColor(fallbackFromUrl(coverUrl));
    };

    return () => {
      cancelled = true;
    };
  }, [coverUrl]);

  const getRandomHeight = () =>
    Array.from({ length: 6 }, () => `${Math.random() * 45 + 20}%`);

  return (
    <div className="relative flex h-6 w-fit items-center justify-center rounded-full px-0.5">
      {bars.map((_, i) => (
        <motion.div
          key={`bar-${i}`}
          className="mx-[0.8px] w-[1.8px] rounded-full"
          style={{
            backgroundColor: color || waveColor,
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
