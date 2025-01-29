"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { ThemeItem } from "./theme-item";

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
    <div className="flex items-center rounded-full border border-zinc-300 dark:border-zinc-700">
      <ThemeItem
        themeKey="light"
        themeIcon={<SunIcon size={20} />}
        isActive={theme === "light"}
        onChangeTheme={setTheme}
      />
      <ThemeItem
        themeKey="dark"
        themeIcon={<MoonIcon size={20} />}
        isActive={theme === "dark"}
        onChangeTheme={setTheme}
      />
      <ThemeItem
        themeKey="system"
        themeIcon={<MonitorIcon size={20} />}
        isActive={theme === "system"}
        onChangeTheme={setTheme}
      />
    </div>
  );
};
