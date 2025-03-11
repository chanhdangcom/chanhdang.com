"use client";

import { motion } from "framer-motion";

const bars = new Array(8).fill(0); // 8 cột sóng nhỏ

type IPlay = {
  isPlay: boolean;
};

export function DynamicIslandWave({ isPlay }: IPlay) {
  return (
    <div className="relative flex h-5 items-center justify-center rounded-full">
      {bars.map((_, i) => (
        <motion.div
          key={`bar-${i}`}
          className="mx-0.5 w-[2px] rounded-full bg-green-400"
          animate={{
            height: isPlay
              ? ["20%", "80%", "30%", "90%", "40%", "85%", "25%"] // Biên độ mượt hơn
              : ["50%", "55%", "52%", "58%", "50%", "54%", "51%"],
            opacity: isPlay ? [0.6, 1, 0.8] : [0.5, 0.55, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: isPlay ? 0.7 + i * 0.1 : 1.8 + i * 0.2, // Chậm hơn trước
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default DynamicIslandWave;
