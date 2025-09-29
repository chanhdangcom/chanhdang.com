"use client";

import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { useUser } from "@/hooks/use-user";
import {
  BookBookmark,
  House,
  MicrophoneStage,
  MusicNotesSimple,
} from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { MagnifyingGlass } from "phosphor-react";

export function MenuBar() {
  const { isAuthenticated } = useUser();

  return (
    <div className="fixed left-4 top-4 z-30 hidden md:flex">
      <div className="absolute h-[96vh] w-60 rounded-3xl border border-transparent bg-gradient-to-tr from-transparent to-black/10 px-3 pt-5 text-zinc-50 shadow-xl backdrop-blur-2xl dark:to-white/10">
        <>
          <div className="space-y-1 text-base text-black dark:text-white">
            <div className="flex items-end gap-1">
              <Link href={"/music"} className="flex cursor-pointer">
                <ChanhdangLogotype className="w-40" />

                <div className="my-4 flex text-sm font-semibold">Music</div>
              </Link>
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
                href={"/music/add-music"}
                className="flex items-center gap-2 rounded-2xl p-2"
              >
                <MusicNotesSimple size={20} weight="bold" />

                <div className="">Add New Music</div>
              </Link>
            ) : (
              <div className="pointer-events-none flex items-center gap-2 p-2 opacity-30">
                <MusicNotesSimple size={20} weight="bold" />
                <div className="">Add New Music</div>
              </div>
            )}

            {isAuthenticated ? (
              <Link
                href={"/music/add-singer"}
                className="flex items-center gap-2 rounded-2xl p-2"
              >
                <MicrophoneStage size={20} weight="fill" />
                <div className="">Add Artists</div>
              </Link>
            ) : (
              <div className="pointer-events-none flex items-center gap-2 p-2 opacity-30">
                <MicrophoneStage size={20} weight="fill" />
                <div className="">Add Artists</div>
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
