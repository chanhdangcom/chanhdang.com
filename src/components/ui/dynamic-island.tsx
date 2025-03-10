"use client";

import { motion } from "framer-motion";

const bars = new Array(8).fill(0); // 8 cột sóng nhỏ

type IPlay = {
  isPlay: boolean;
};

export function DynamicIslandWave({ isPlay }: IPlay) {
  return (
    <div className="relative flex h-5 w-16 items-center justify-center rounded-full px-1">
      {bars.map((_, i) => (
        <motion.div
          key={`bar-${i}`}
          className="mx-0.5 w-[2px] rounded-full bg-gray-400"
          animate={{
            height: isPlay
              ? ["10%", "100%", "15%", "90%", "20%", "95%", "10%"] // Biên độ cao hơn
              : ["40%", "50%", "45%", "55%", "42%", "48%", "40%"],
            opacity: isPlay ? [0.5, 1, 0.7] : [0.5, 0.6, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: isPlay ? 0.4 + i * 0.08 : 1.2 + i * 0.15, // Nhanh hơn một chút
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default DynamicIslandWave;
