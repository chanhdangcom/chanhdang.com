"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useRef, useState } from "react";
import { ThemeItem } from "./theme-item";
import { Moon, Sun } from "phosphor-react";

export const SwitchTheme = () => {
  const [isMounted, setIsMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  const [isDark, setIsDark] = useState<boolean>();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex items-center rounded-full border border-zinc-300 shadow-sm backdrop-blur-sm hover:bg-zinc-200 dark:border-zinc-800 dark:hover:bg-zinc-700">
      <audio ref={audioRef}>
        <source src="https://cdn.chanhdang.com/screenshot-sound.mp3" />
      </audio>

      {isDark ? (
        <div
          onClick={() => {
            setIsDark(!isDark);
            handlePlayAudio();
          }}
        >
          <ThemeItem
            themeKey="light"
            themeIcon={<Sun size={18} weight="fill" />}
            isActive={theme === "light"}
            onChangeTheme={setTheme}
          />
        </div>
      ) : (
        <div
          onClick={() => {
            setIsDark(!isDark);
            handlePlayAudio();
          }}
        >
          <ThemeItem
            themeKey="dark"
            themeIcon={<Moon size={18} weight="fill" />}
            isActive={theme === "dark"}
            onChangeTheme={setTheme}
          />
        </div>
      )}
    </div>
  );
};
