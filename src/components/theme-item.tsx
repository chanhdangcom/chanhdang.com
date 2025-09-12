import { cn } from "@/utils/cn";
import React, { JSX } from "react";

type IThemeItemProps = {
  themeKey: string;
  themeIcon: JSX.Element;
  isActive?: boolean;
  onChangeTheme: (themeKey: string) => void;
};

export const ThemeItem = ({
  themeKey,
  themeIcon,
  isActive,
  onChangeTheme,
}: IThemeItemProps) => {
  const handleClick = () => {
    onChangeTheme(themeKey);
  };

  return (
    <button
      className={cn("flex size-8 items-center justify-center rounded-full", {
        "bg-zinc-200/50 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50":
          isActive,
      })}
      onClick={handleClick}
    >
      {themeIcon}
    </button>
  );
};
