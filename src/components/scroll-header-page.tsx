"use client";

import { ChevronsUpIcon } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export const ScrollHeaderPage = () => {
  const { scrollY } = useScroll();

  const _bottom = useTransform(scrollY, [100, 400], [-80, 75]);
  const bottom = useSpring(_bottom, { stiffness: 100, damping: 15 });

  const opacity = useTransform(scrollY, [100, 400], [0, 1]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.header
      className="fixed right-6 z-[50] flex justify-end"
      style={{ bottom, opacity }}
    >
      <ChevronsUpIcon
        onClick={scrollToTop}
        className="size-10 cursor-pointer rounded-full border border-white/10 bg-zinc-900 p-2 text-zinc-50 shadow-sm hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      />
    </motion.header>
  );
};
