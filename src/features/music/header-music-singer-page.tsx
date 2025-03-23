"use client";
import { Progress } from "@/components/ui/progress";

import React from "react";
import { Search } from "./component/search";
import {
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
} from "@phosphor-icons/react/dist/ssr";
import { ChanhdangLogotype } from "@/components/chanhdang-logotype";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export const HeaderMusicSingerPage = () => {
  return (
    <div className="container sticky inset-0 top-0 z-10 pb-2">
      <Progress className="w-[60%]" value={33} />

      <div className="space-y-4 md:hidden">
        <div className="flex items-center justify-between">
          <ChanhdangLogotype />
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
      </div>

      <div className="hidden h-14 items-center justify-between md:flex">
        <div className="flex gap-16">
          <div className="flex items-center gap-4">
            <CaretLeft
              size={25}
              weight="bold"
              className="rounded-full bg-zinc-900 p-1 text-zinc-50"
            />
            <CaretRight
              size={25}
              weight="bold"
              className="rounded-full bg-zinc-900 p-1 text-zinc-50"
            />
          </div>

          <Search />
        </div>
      </div>
    </div>
  );
};
