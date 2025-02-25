"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingBar() {
  const [progress, setProgress] = useState(0);
  const [loadingdone, setloadingdone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 85 : 100));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setloadingdone(true);
    }
  }, [progress]);

  return (
    <div>
      {!loadingdone && (
        <motion.div
          className="fixed left-0 top-0 h-0.5 bg-zinc-400"
          style={{ width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        />
      )}
    </div>
  );
}
