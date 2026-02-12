"use client";

import { useEffect } from "react";
import { useRef } from "react";
import { useTheme } from "next-themes";

export default function AuthLightMode() {
  const { theme, setTheme } = useTheme();
  const previousThemeRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (previousThemeRef.current !== undefined) {
      return;
    }

    previousThemeRef.current = theme ?? "system";
    setTheme("light");
  }, [theme, setTheme]);

  useEffect(
    () => () => {
      if (previousThemeRef.current) {
        setTheme(previousThemeRef.current);
      }
    },
    [setTheme]
  );

  return null;
}
