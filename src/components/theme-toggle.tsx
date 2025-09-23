"use client";

import { useTheme } from "next-themes";
import { useCallback, useRef } from "react";
import { Moon, Sun } from "phosphor-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      className="flex items-center rounded-full border border-zinc-300 p-1.5 shadow-sm backdrop-blur-sm hover:bg-zinc-200 dark:border-zinc-800 dark:hover:bg-zinc-700"
    >
      {resolvedTheme === "dark" ? (
        <Sun size={18} weight="fill" />
      ) : (
        <Moon size={18} weight="fill" />
      )}

      <audio ref={audioRef}>
        <source src="https://cdn.chanhdang.com/screenshot-sound.mp3" />
      </audio>
    </button>
  );
}
