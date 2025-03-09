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
    <div className="relative flex h-6 w-20 items-center justify-center rounded-full px-3">
      {bars.map((_, i) => (
        <motion.div
          key={`bar-${i}`} // Đảm bảo key duy nhất
          className="mx-1 w-2 rounded-full"
          style={{
            backgroundColor: isPlay ? activeColors[i] : inactiveColors[i],
          }}
          animate={{
            height: isPlay
              ? ["30%", "90%", "40%", "70%", "50%", "85%", "30%"] // Sóng động
              : "40%", // Sóng tĩnh giữ nguyên chiều cao
          }}
          transition={
            isPlay
              ? {
                  repeat: Infinity,
                  duration: 0.8 + i * 0.1,
                  ease: "easeInOut",
                }
              : { duration: 0.3 } // Animation dừng lại khi không phát
          }
        />
      ))}
    </div>
  );
}

export default DynamicIslandWave;
