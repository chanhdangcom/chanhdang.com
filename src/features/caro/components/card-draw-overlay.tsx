"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { CARD_DRAW_MS } from "../constants";
import { TEXTS } from "../texts";
import type { DrawAnimation } from "../types";
import { SkillCardView } from "./skill-card";

type CardDrawOverlayProps = {
  animation: DrawAnimation | null;
  deckCount: number;
  onComplete: () => void;
};

export function CardDrawOverlay({
  animation,
  deckCount,
  onComplete,
}: CardDrawOverlayProps) {
  useEffect(() => {
    if (!animation) return;
    const timer = setTimeout(onComplete, CARD_DRAW_MS);
    return () => clearTimeout(timer);
  }, [animation, onComplete]);

  return (
    <AnimatePresence>
      {animation && animation.for === "human" && (
        <motion.div
          key={animation.card.id}
          className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
        >
          <div className="absolute inset-0 bg-black/35" />

          <motion.p
            className="absolute top-[26%] text-3xl tracking-[0.25em] text-[#f5e6c8] sm:text-4xl"
            style={{
              fontFamily: "var(--font-caro-display)",
              textShadow: "0 0 16px #f59e0b",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            +1
          </motion.p>

          <motion.div
            className="absolute bottom-[30%] left-1/2 h-20 w-14 -translate-x-1/2 rounded-sm border-2 border-[#c9a66b] sm:bottom-[32%]"
            style={{
              background: "linear-gradient(145deg, #3d1515, #1a0a0a)",
              boxShadow: "0 0 20px #f59e0b44",
            }}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 0.92, 1] }}
            transition={{ duration: 0.2, times: [0, 0.5, 1] }}
          >
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm text-[#c9a66b]">
              {TEXTS.deckCount(deckCount)}
            </span>
          </motion.div>

          <motion.div
            className="relative"
            initial={{
              x: "-38vw",
              y: "32vh",
              rotateY: 160,
              scale: 0.5,
              opacity: 0,
            }}
            animate={{
              x: 0,
              y: 0,
              rotateY: 0,
              scale: 1.08,
              opacity: 1,
            }}
            exit={{
              y: "38vh",
              scale: 0.75,
              opacity: 0,
              transition: { duration: 0.18, ease: "easeIn" },
            }}
            transition={{
              duration: 0.32,
              ease: [0.22, 1.1, 0.36, 1],
            }}
            style={{ perspective: 900, transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute -inset-3 rounded-full opacity-50 blur-lg"
              style={{ background: "radial-gradient(circle, #fbbf2466, transparent)" }}
            />
            <SkillCardView card={animation.card} size="draw" isNew />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
