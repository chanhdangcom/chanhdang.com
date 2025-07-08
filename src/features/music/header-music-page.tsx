"use client";

import React, { useEffect, useState } from "react";
// import { Search } from "./component/search";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { MusicType } from "./music-type";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export const HeaderMusicPage = () => {
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY < 30);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // gọi lần đầu để đảm bảo đúng trạng thái ban đầu

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${isTop ? "pb-4" : "pb-16"} container sticky inset-0 top-0 z-10 rounded-b-xl bg-gradient-to-b from-black/95 via-black/80 to-transparent pt-4 transition`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-end gap-1">
              <Link
                href={"/music"}
                className="flex gap-1 rounded-3xl px-3 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <ChanhdangLogotype />

                {/* <div className="mt-2 flex text-lg text-pink-400">
                  <div>Mus</div>
                  <div className="text-cyan-400">ic</div>
                </div> */}
                <div className="mt-2 flex text-lg font-semibold">Music</div>
              </Link>
            </div>

            <div className="hidden md:flex">
              <MusicType />
            </div>

            <AnimatePresence>
              <motion.div
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 20,
                  duration: 0.5,
                }}
                // layoutId="Search"
                className="hidden gap-4 text-zinc-500 md:flex"
              >
                <Link href="/music/search">
                  <MagnifyingGlass size={25} />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* <div className="md:hidden">
          <MusicType />
        </div> */}
      </div>
    </div>
  );
};
