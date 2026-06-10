"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SKILL_META } from "../constants";
import type { SkillCard } from "../types";
import { SkillCardView } from "./skill-card";

type AiSkillFlashProps = {
  card: SkillCard | null;
};

export function AiSkillFlash({ card }: AiSkillFlashProps) {
  const meta = card ? SKILL_META[card.type] : null;

  return (
    <AnimatePresence>
      {card && meta && (
        <motion.div
          key={card.id}
          className="pointer-events-none fixed inset-0 z-[55] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.35] }}
            transition={{ duration: 0.5 }}
            style={{
              background: `radial-gradient(circle at center, ${meta.accent}55 0%, transparent 55%)`,
            }}
          />

          <motion.div
            className="absolute inset-0 bg-red-950/40"
            animate={{ opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 0.25, repeat: 3 }}
          />

          <motion.p
            className="absolute top-[18%] text-3xl tracking-[0.35em] text-[#ff6b6b] sm:text-4xl"
            style={{
              fontFamily: "var(--font-caro-display)",
              textShadow: "0 0 20px #ef4444, 3px 3px 0 #000",
            }}
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            AI DÙNG SKILL!
          </motion.p>

          <motion.div
            initial={{ y: -120, scale: 0.3, rotate: -12, opacity: 0 }}
            animate={{
              y: 0,
              scale: [0.3, 1.2, 1.05],
              rotate: [-12, 4, 0],
              opacity: 1,
            }}
            exit={{ y: 40, scale: 0.8, opacity: 0 }}
            transition={{
              duration: 0.38,
              ease: [0.22, 1.2, 0.36, 1],
            }}
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-6 rounded-full blur-2xl"
                style={{ background: meta.accent }}
                animate={{ opacity: [0.3, 0.8, 0.4] }}
                transition={{ duration: 0.6, repeat: 2 }}
              />
              <SkillCardView card={card} size="draw" />
            </div>
          </motion.div>

          <motion.p
            className="absolute bottom-[22%] text-xl text-[#f5e6c8] sm:text-2xl"
            style={{ fontFamily: "var(--font-caro-display)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            {meta.icon} {meta.name}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
