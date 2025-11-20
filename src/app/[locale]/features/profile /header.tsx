/* eslint-disable @next/next/no-img-element */
"use client";
import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChatBox } from "./components/chat-box";
import { motion } from "framer-motion";

export const Header = () => {
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
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

      <div className="flex items-center justify-between px-2" role="banner">
        <Link href="/">
          <ChanhdangLogotype />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6 font-mono text-sm">
            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/" className="hover:underline">
                Daifolio
              </Link>
            </motion.li>

            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/music" className="hover:underline">
                Musics
              </Link>
            </motion.li>

            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/blog" className="hover:underline">
                Blogs
              </Link>
            </motion.li>

            <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/components" className="hover:underline">
                Components
              </Link>
            </motion.li>

            <li>
              <ChatBox />
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* <SwitchLanguage /> */}

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
