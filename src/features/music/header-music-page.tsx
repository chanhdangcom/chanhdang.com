"use client";

import React from "react";
// import { Search } from "./component/search";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { MusicType } from "./music-type";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export const HeaderMusicPage = () => {
  return (
    <div className="container sticky inset-0 top-0 z-10 py-4 backdrop-blur-md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-end gap-1">
              <Link href="/">
                <ChanhdangLogotype />
              </Link>

              <div className="mb-1 text-xs font-semibold">Premium</div>
            </div>

            <div className="hidden md:flex">
              <MusicType />
            </div>
          </div>

          <AnimatePresence>
            <motion.div
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 20,
                duration: 0.1,
              }}
              layoutId="Search"
              className="flex gap-4 text-zinc-500"
            >
              <Link href="/music/search">
                <MagnifyingGlass size={25} />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="md:hidden">
          <MusicType />
        </div>
      </div>

      {/* <div className="hidden items-center justify-between md:flex">
        <div className="flex">
          <Search />
        </div>
      </div> */}
    </div>
  );
};
