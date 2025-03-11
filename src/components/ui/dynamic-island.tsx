"use client";

import { motion } from "framer-motion";

const bars = [1, 2, 3, 4, 5];

const activeColors = ["#86efac", "#4ade80", "#22c55e", "#16a34a", "#15803d"]; // Xanh nhạt đến đậm
const inactiveColors = ["#d4d4d8", "#a1a1aa", "#71717a", "#52525b", "#3f3f46"]; // Xám nhạt đến đậm

type IPlay = {
  isPlay: boolean;
};

export function DynamicIslandWave({ isPlay }: IPlay) {
  return (
    <div className="relative flex h-5 items-center justify-center rounded-full px-3">
      {bars.map((_, i) => (
        <motion.div
          key={`bar-${i}`} // Đảm bảo key duy nhất
          className="mx-0.5 w-0.5 rounded-full"
          style={{
            backgroundColor: isPlay ? activeColors[i] : inactiveColors[i],
          }}
          animate={{
            height: isPlay
              ? ["30%", "90%", "40%", "70%", "50%", "85%", "30%"] // Sóng động mạnh
              : ["40%", "50%", "45%", "42%", "48%", "44%", "40%"], // Sóng nhấp nhô nhẹ
          }}
          transition={{
            repeat: Infinity,
            duration: isPlay ? 0.8 + i * 0.1 : 1.2 + i * 0.2, // Khi tĩnh thì chậm hơn một chút
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default DynamicIslandWave;
