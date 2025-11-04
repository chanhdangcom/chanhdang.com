"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface MarqueeTextProps {
  text: string;
  speed?: number;
  className?: string;
  fadeColor?: string;
  alwaysScroll?: boolean;
}

export default function MarqueeText({
  text,
  speed = 70,
  className = "",
  alwaysScroll = true,
}: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [textWidth, setTextWidth] = useState(0);
  const [scrollNeeded, setScrollNeeded] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const cWidth = containerRef.current.offsetWidth;
        const tWidth = textRef.current.scrollWidth;
        setTextWidth(tWidth);
        setScrollNeeded(alwaysScroll || tWidth > cWidth);
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [text, alwaysScroll]);

  const duration = Math.max(textWidth / speed, 5); // tối thiểu 5s để mượt

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden whitespace-nowrap ${className}`}
    >
      {scrollNeeded ? (
        <motion.div
          className="flex"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration,
            repeat: Infinity,
          }}
          style={{ width: "max-content" }}
        >
          <span
            ref={textRef}
            className="inline-block select-none px-2 font-medium"
          >
            {text}
          </span>

          <span
            className="inline-block select-none px-2 font-medium"
            aria-hidden="true"
          >
            {text}
          </span>
        </motion.div>
      ) : (
        <span
          ref={textRef}
          className="inline-block select-none px-2 font-medium"
        >
          {text}
        </span>
      )}
    </div>
  );
}
