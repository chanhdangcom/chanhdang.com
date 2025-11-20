"use client";
import ChatbotPanel from "@/components/chatbot/chatbot-panel";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Iprop = {
  content?: React.ReactNode;
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 10,
    filter: "blur(5px)",
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

export function ChatBox({ content }: Iprop) {
  const [isClick, setIsClick] = useState(false);

  return (
    <>
      <motion.div
        className="cursor-pointer font-mono hover:underline"
        onClick={() => setIsClick(!isClick)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {content || "ChanhDang AI"}
      </motion.div>

      <AnimatePresence mode="wait">
        {isClick && (
          <>
            <motion.div
              key="backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.1 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsClick(false)}
            />

            <motion.div
              key="panel"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed bottom-4 right-4 z-50 max-w-md font-apple"
            >
              <ChatbotPanel handle={() => setIsClick(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
