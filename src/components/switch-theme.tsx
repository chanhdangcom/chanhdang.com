"use client";

import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ThemeItem } from "./theme-item";
import { Moon, Sun } from "phosphor-react";

export const SwitchTheme = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState<boolean>();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const withTransition = (callback: () => void) => {
    if (!document.startViewTransition) {
      callback();
      return;
    }
    document.startViewTransition(() => {
      callback();
    });
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const switchTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  if (!isMounted) return null;

  return (
    <div className="flex items-center rounded-full border border-zinc-300 shadow-sm backdrop-blur-sm hover:bg-zinc-200 dark:border-zinc-800 dark:hover:bg-zinc-700">
      <audio ref={audioRef}>
        <source src="https://cdn.chanhdang.com/screenshot-sound.mp3" />
      </audio>

      {isDark ? (
        <div
          onClick={() => {
            withTransition(() => {
              setIsDark(false);
            });

            if (document.startViewTransition) {
              document.startViewTransition(() => switchTheme());
            } else {
              switchTheme();
            }

            handlePlayAudio();
          }}
        >
          <ThemeItem
            themeKey="light"
            themeIcon={<Sun size={18} weight="fill" />}
            isActive={resolvedTheme === "light"}
            onChangeTheme={setTheme}
          />
        </div>
      ) : (
        <div
          onClick={() => {
            withTransition(() => {
              setIsDark(true);
            });

            if (document.startViewTransition) {
              document.startViewTransition(() => switchTheme());
            } else {
              switchTheme();
            }
            handlePlayAudio();
          }}
        >
          <ThemeItem
            themeKey="dark"
            themeIcon={<Moon size={18} weight="fill" />}
            isActive={resolvedTheme === "dark"}
            onChangeTheme={setTheme}
          />
        </div>
      )}
    </div>
  );
};
