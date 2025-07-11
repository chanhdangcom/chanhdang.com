"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { ThemeItem } from "./theme-item";
import { Monitor, Moon, Sun } from "phosphor-react";

export const SwitchTheme = () => {
  const [isMounted, setIsMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex items-center rounded-full border shadow-sm backdrop-blur-sm dark:border-zinc-700">
      <ThemeItem
        themeKey="light"
        themeIcon={<Sun size={18} weight="fill" />}
        isActive={theme === "light"}
        onChangeTheme={setTheme}
      />
      <ThemeItem
        themeKey="dark"
        themeIcon={<Moon size={18} weight="fill" />}
        isActive={theme === "dark"}
        onChangeTheme={setTheme}
      />
      <ThemeItem
        themeKey="system"
        themeIcon={<Monitor size={18} weight="bold" />}
        isActive={theme === "system"}
        onChangeTheme={setTheme}
      />
    </div>
  );
};
