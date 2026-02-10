"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "phosphor-react";
import { cn } from "@/utils/cn";

type IProp = { className?: string };

export function ThemeToggleMenuBar({ className }: IProp) {
  const { resolvedTheme, setTheme } = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const switchTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <button
      onClick={() => {
        if (document.startViewTransition) {
          document.startViewTransition(() => switchTheme());
        } else {
          switchTheme();
        }

        handlePlayAudio();
      }}
      className={cn("flex items-center", className)}
    >
      {/* Avoid hydration mismatch by rendering a stable fallback until mounted */}
      {mounted ? (
        resolvedTheme === "dark" ? (
          <Sun size={25} />
        ) : (
          <Moon size={25} />
        )
      ) : (
        <span style={{ width: 18, height: 18, display: "inline-block" }} />
      )}

      <audio ref={audioRef}>
        <source src="https://cdn.chanhdang.com/screenshot-sound.mp3" />
      </audio>
    </button>
  );
}
