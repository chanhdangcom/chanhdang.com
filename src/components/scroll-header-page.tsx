"use client";

import { ChevronsUpIcon } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export const ScrollHeaderPage = () => {
  const { scrollY } = useScroll();

  const _bottom = useTransform(scrollY, [100, 400], [-80, 20]);
  const bottom = useSpring(_bottom, { stiffness: 100, damping: 15 });

  const opacity = useTransform(scrollY, [100, 400], [0, 1]);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.header
      className="fixed bottom-0 left-0 right-0 z-[1000] m-8 flex justify-end"
      style={{ bottom, opacity }}
      onClick={scrollToTop}
    >
      <ChevronsUpIcon className="size-10 cursor-pointer rounded-full border bg-zinc-100 p-2 shadow-sm hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800" />
    </motion.header>
  );
};
