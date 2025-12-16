"use client";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

type IProp = {
  name?: string;
};

export function MotionHeaderMusic({ name }: IProp) {
  const { scrollY } = useScroll();
  const rawOpacity = useTransform(scrollY, [50, 100], [0, 1]);
  const smoothOpacity = useSpring(rawOpacity, {
    stiffness: 300,
    damping: 20,
  });

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-2 z-50 flex justify-center text-black dark:text-white"
      style={{ opacity: smoothOpacity }}
    >
      <>
        <div className="fixed left-0 top-0 h-12 w-full backdrop-blur-[1px]" />
        <div className="z-10 ml-3 font-apple md:ml-0">{name || "Home"}</div>
      </>
    </motion.div>
  );
}
