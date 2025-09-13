import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

interface HoverBorderGradientProps {
  as?: React.ElementType;
  containerClassName?: string;
  className?: string;
  duration?: number;
  clockwise?: boolean;
  children?: React.ReactNode;
  [key: string]: unknown;
}

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as,
  duration = 1,
  clockwise = true,
  ...props
}: HoverBorderGradientProps) {
  const Tag = as || "button";

  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = useCallback(
    (current: Direction): Direction => {
      const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
      const idx = directions.indexOf(current);
      const next = clockwise
        ? (idx - 1 + directions.length) % directions.length
        : (idx + 1) % directions.length;
      return directions[next];
    },
    [clockwise]
  );

  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(0,0%,100%) 0%, rgba(255,255,255,0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, hsl(0,0%,100%) 0%, rgba(255,255,255,0) 100%)",
    BOTTOM:
      "radial-gradient(20.7% 50% at 50% 100%, hsl(0,0%,100%) 0%, rgba(255,255,255,0) 100%)",
    RIGHT:
      "radial-gradient(16.2% 41.2% at 100% 50%, hsl(0,0%,100%) 0%, rgba(255,255,255,0) 100%)",
  };

  const highlight =
    "radial-gradient(75% 181.16% at 50% 50%, #3275F8 0%, rgba(255,255,255,0) 100%)";

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prev) => rotateDirection(prev));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration, rotateDirection]);

  const tagProps = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    className: cn(
      "relative flex h-min w-fit flex-col items-center justify-center gap-10 overflow-visible rounded-full border bg-black/20 p-px transition duration-500 hover:bg-black/10 dark:bg-white/20",
      containerClassName
    ),
    ...props,
  };

  return React.createElement(
    Tag,
    tagProps,
    <div
      className={cn(
        "z-10 w-auto rounded-[inherit] bg-black px-4 py-2 text-white",
        className
      )}
    >
      {children}
    </div>,
    <motion.div
      className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
      style={{
        filter: "blur(2px)",
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
      initial={{ background: movingMap[direction] }}
      animate={{
        background: hovered
          ? [movingMap[direction], highlight]
          : movingMap[direction],
      }}
      transition={{ ease: "linear", duration }}
    />,
    <div className="z-1 absolute inset-[2px] rounded-[100px] bg-black" />
  );
}
