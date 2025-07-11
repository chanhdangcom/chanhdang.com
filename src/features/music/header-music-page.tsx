"use client";

// import { Search } from "./component/search";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { MusicType } from "./music-type";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SwitchTheme } from "@/components/switch-theme";

export const HeaderMusicPage = () => {
  return (
    <div className="sticky inset-0 top-0 z-50 rounded-b-xl py-4 transition md:container">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-end gap-1">
              <Link href={"/music"} className="flex cursor-pointer">
                <ChanhdangLogotype className="w-40" />

                <div className="mt-4 flex text-sm font-semibold">Music</div>
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

          <div className="mr-2">
            {" "}
            <SwitchTheme />
          </div>
        </div>

        {/* <div className="md:hidden">
          <MusicType />
        </div> */}
      </div>
    </div>
  );
};
