"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { useState, useRef, useEffect } from "react";

const FollowingEye = ({ className }: { className?: string }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const eye1Ref = useRef<HTMLDivElement>(null);
  const eye2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 z-50 flex items-center justify-center",
        className
      )}
    >
      <div className="flex gap-2">
        <Eye
          mouseX={mousePos.x}
          mouseY={mousePos.y}
          selfRef={eye1Ref as React.RefObject<HTMLDivElement>}
          otherRef={eye2Ref as React.RefObject<HTMLDivElement>}
        />
        <Eye
          mouseX={mousePos.x}
          mouseY={mousePos.y}
          selfRef={eye2Ref as React.RefObject<HTMLDivElement>}
          otherRef={eye1Ref as React.RefObject<HTMLDivElement>}
        />
      </div>
    </div>
  );
};

interface EyeProps {
  mouseX: number;
  mouseY: number;
  selfRef: React.RefObject<HTMLDivElement>;
  otherRef: React.RefObject<HTMLDivElement>;
}

const Eye: React.FC<EyeProps> = ({ mouseX, mouseY, selfRef, otherRef }) => {
  const pupilRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState({ x: 0, y: 0 });

  const updateCenter = React.useCallback(() => {
    if (!selfRef.current) return;
    const rect = selfRef.current.getBoundingClientRect();
    setCenter({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }, [selfRef]);

  useEffect(() => {
    updateCenter();
    window.addEventListener("resize", updateCenter);
    return () => window.removeEventListener("resize", updateCenter);
  }, [updateCenter]);

  useEffect(() => {
    updateCenter();

    const isInside = (ref: React.RefObject<HTMLDivElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return false;
      return (
        mouseX >= rect.left &&
        mouseX <= rect.right &&
        mouseY >= rect.top &&
        mouseY <= rect.bottom
      );
    };

    if (isInside(selfRef) || isInside(otherRef)) return;

    const dx = mouseX - center.x;
    const dy = mouseY - center.y;
    const angle = Math.atan2(dy, dx);

    const maxMove = 20;
    const pupilX = Math.cos(angle) * maxMove;
    const pupilY = Math.sin(angle) * maxMove;

    if (pupilRef.current) {
      pupilRef.current.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    }
  }, [mouseX, mouseY, center, otherRef, selfRef, updateCenter]);

  return (
    <div
      ref={selfRef}
      className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-white"
    >
      <div
        ref={pupilRef}
        className="absolute h-4 w-4 rounded-full bg-black transition-transform duration-75"
      >
        <div className="absolute bottom-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-white"></div>
      </div>
    </div>
  );
};

export { FollowingEye };
