import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import {
  Bookmarks,
  Broadcast,
  House,
  MagnifyingGlass,
  SquaresFour,
} from "phosphor-react";

export function MenuBarMobile() {
  return (
    <div className="fixed inset-x-2 bottom-4 z-20 flex items-center justify-between sm:hidden">
      <div className="flex items-center justify-center gap-8 rounded-3xl bg-zinc-900/50 px-6 py-2 backdrop-blur-md">
        <div className="flex gap-8">
          <div className="flex flex-col items-center">
            <House size={32} color="#dedede" weight="fill" />
            <div className="">Home</div>
          </div>

          <div className="flex flex-col items-center">
            <SquaresFour size={32} color="#dedede" weight="fill" />
            <div className="">New</div>
          </div>

          <div className="flex flex-col items-center">
            <Broadcast size={32} color="#dedede" weight="fill" />
            <div className="">Radio</div>
          </div>

          <div className="flex flex-col items-center">
            <Bookmarks size={32} color="#dedede" weight="fill" />
            <div>Library</div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 30,
            duration: 0.1,
          }}
          layoutId="Search"
          className="rounded-full p-4 backdrop-blur-md"
        >
          <Link href={"/music/search"}>
            <MagnifyingGlass size={32} color="#dedede" weight="bold" />
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
