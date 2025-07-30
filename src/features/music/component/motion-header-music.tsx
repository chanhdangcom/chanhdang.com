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
      className="fixed inset-x-0 top-2 z-50 flex justify-center text-xl text-black dark:text-white"
      style={{ opacity: smoothOpacity }}
    >
      {name || "Home"}
    </motion.div>
  );
}
