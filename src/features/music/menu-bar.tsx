"use client";

import { useUser } from "@/hooks/use-user";
import { BookBookmark, House } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { MagnifyingGlass, Plus } from "phosphor-react";

export function MenuBar() {
  const { isAuthenticated } = useUser();

  return (
    <div className="fixed left-4 top-4 z-30 hidden md:flex">
      <div className="absolute h-[95vh] w-60 rounded-3xl border border-transparent bg-gradient-to-tr from-transparent to-black/10 px-3 pt-5 text-zinc-50 shadow-xl backdrop-blur-2xl dark:to-white/10">
        <>
          <div className="space-y-1 text-base text-black dark:text-white">
            <AnimatePresence>
              <motion.div
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 20,
                  duration: 0.5,
                }}
                // layoutId="Search"
                className="gap-4"
              >
                <Link href="/music/search">
                  <div className="flex items-center gap-2 rounded-xl p-2">
                    <MagnifyingGlass size={20} weight="bold" />
                    <div className="">Search</div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-2 rounded-xl bg-blue-700 p-2 text-white dark:bg-blue-600">
              <House size={20} weight="fill" />
              <div className="">Home</div>
            </div>

            {isAuthenticated ? (
              <Link
                href={"/music/add"}
                className="flex items-center gap-2 rounded-2xl p-2"
              >
                <Plus size={20} weight="bold" />
                <div className="">Add New Music</div>
              </Link>
            ) : (
              <div className="pointer-events-none flex items-center gap-2 p-2 opacity-30">
                <Plus size={20} weight="bold" />
                <div className="">Add New Music</div>
              </div>
            )}

            {isAuthenticated ? (
              <Link
                href={"/music/favorites"}
                className="flex items-center gap-2 rounded-2xl p-2"
              >
                <BookBookmark size={20} weight="fill" />
                <div className="">Library</div>
              </Link>
            ) : (
              <div className="pointer-events-none flex items-center gap-2 p-2 opacity-30">
                <BookBookmark size={20} weight="fill" />
                <div className="">Library</div>
              </div>
            )}
          </div>
        </>
      </div>
    </div>
  );
}
