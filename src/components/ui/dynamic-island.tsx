"use client";

import { motion } from "framer-motion";

const bars = [1, 2, 3, 4, 5];
const colors = ["#86efac", "#4ade80", "#22c55e", "#16a34a", "#15803d"]; // Xanh nhạt đến đậm

export function DynamicIslandWave() {
  return (
    <div className="relative flex h-6 w-20 items-center justify-center rounded-full px-3">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="mx-1 w-2 rounded-full"
          style={{ backgroundColor: colors[i] }} // Gán màu theo cột
          animate={{
            height: ["30%", "90%", "40%", "70%", "50%", "85%", "30%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.8 + i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default DynamicIslandWave;
