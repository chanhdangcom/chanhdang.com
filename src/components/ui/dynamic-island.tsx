"use client";

import { motion } from "framer-motion";

const bars = [1, 2, 3, 4, 5]; // Số cột sóng

export function DynamicIslandWave() {
  return (
    <div className="relative flex h-4 w-20 items-center justify-center rounded-full px-3">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="mx-1 w-2 rounded-full bg-green-500 dark:bg-green-400"
          animate={{
            height: ["30%", "90%", "40%", "70%", "50%", "85%", "30%"], // Sóng lượn
          }}
          transition={{
            repeat: Infinity,
            duration: 0.8 + i * 0.1, // Điều chỉnh tốc độ sóng
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default DynamicIslandWave;
