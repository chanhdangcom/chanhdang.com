"use client";

import React, {
  useRef,
  useState,
  useLayoutEffect,
  // Removed unused imports: useEffect, MutableRefObject
} from "react";
import { AnimatePresence, motion } from "framer-motion";

interface LensProps {
  children: React.ReactNode;
  zoomFactor?: number;
  lensSize?: number;
  position?: {
    x: number;
    y: number;
  };
  isStatic?: boolean;
  isFocusing?: () => void;
  hovering?: boolean;
  setHovering?: (hovering: boolean) => void;
}

export const Lens: React.FC<LensProps> = ({
  children,
  zoomFactor = 1.5,
  lensSize = 170,
  isStatic = false,
  position = { x: 200, y: 150 },
  hovering,
  setHovering,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [localIsHovering, setLocalIsHovering] = useState(false);
  const isHovering = hovering !== undefined ? hovering : localIsHovering;
  const setIsHovering = setHovering || setLocalIsHovering;

  const [mousePosition, setMousePosition] = useState({ x: 100, y: 100 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  useLayoutEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-10 overflow-hidden rounded-lg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      {children}

      <AnimatePresence>
        {(isStatic || isHovering) && (
          <motion.div
            key="lens"
            initial={{ opacity: 0, scale: 0.58 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="pointer-events-none absolute left-0 top-0"
            style={{
              width: containerSize.width,
              height: containerSize.height,
              // Corrected template literals for maskImage and WebkitMaskImage
              maskImage: `radial-gradient(circle ${lensSize / 2}px at ${isStatic ? position.x : mousePosition.x}px ${isStatic ? position.y : mousePosition.y}px, black 100%, transparent 100%)`,
              WebkitMaskImage: `radial-gradient(circle ${lensSize / 2}px at ${isStatic ? position.x : mousePosition.x}px ${isStatic ? position.y : mousePosition.y}px, black 100%, transparent 100%)`,
              transformOrigin: `${isStatic ? position.x : mousePosition.x}px ${isStatic ? position.y : mousePosition.y}px`,
              zIndex: 30,
            }}
          >
            <div
              className="absolute left-0 top-0 h-full w-full"
              style={{
                // Corrected template literal for transform
                transform: `scale(${zoomFactor})`,
                transformOrigin: `${isStatic ? position.x : mousePosition.x}px ${isStatic ? position.y : mousePosition.y}px`,
              }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
