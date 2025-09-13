/* eslint-disable @next/next/no-img-element */
"use client";
import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { SwitchTheme } from "@/components/switch-theme";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

import React, { useEffect, useState } from "react";
import { SwitchLanguage } from "./components/swtich-language";
import { useTheme } from "next-themes";
export const Header = () => {
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // tránh mismatch: render placeholder hoặc hình mặc định
    return (
      <img
        src="/img/tech-stack/github-mark.svg"
        alt="icon"
        className="size-6"
      />
    );
  }

  return (
    <>
      <div className="absolute">
        <Progress className="w-[60%]" value={33} />
      </div>

      <div className="flex items-center justify-between px-2">
        <Link href="/">
          <ChanhdangLogotype />
        </Link>

        <div className="hidden items-center gap-6 font-mono text-sm font-semibold md:flex">
          <div>Daifolio</div>
          <div>Blogs</div>
          <div>Components</div>
        </div>

        <div className="flex items-center gap-2">
          <SwitchTheme />

          <SwitchLanguage />

          <Link
            href="https://github.com/chanhdangcom"
            target="_blank"
            className="rounded-full border border-zinc-300 p-1 dark:border-zinc-800"
          >
            <img
              src={
                theme === "dark"
                  ? "/img/tech-stack/github-mark-white.svg"
                  : "/img/tech-stack/github-mark.svg"
              }
              alt="icon"
              className="size-6"
            />
          </Link>
        </div>
      </div>
    </>
  );
};
