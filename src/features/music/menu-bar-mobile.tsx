import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import {
  Bookmarks,
  Broadcast,
  House,
  MagnifyingGlass,
  SquaresFour,
} from "phosphor-react";
import { useEffect, useState } from "react";

export function MenuBarMobile() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // scroll xuống
        setShow(false);
      } else {
        // scroll lên
        setShow(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="fixed bottom-4 z-20 flex w-full items-center justify-between sm:hidden">
      <AnimatePresence>
        {show ? (
          <motion.div
            layout
            initial={{ opacity: 1, scale: 0.9 }}
            exit={{ opacity: 1, scale: 0.9 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 10,
              mass: 0.1,
              ease: "easeInOut",
            }}
            layoutId="item"
            className="flex gap-8 rounded-full border-2 border-transparent bg-gradient-to-tl from-transparent to-white/10 px-8 py-2 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center text-red-600">
              <House size={35} weight="fill" />
              <div className="font-semibold">Home</div>
            </div>

            <div className="flex flex-col items-center">
              <SquaresFour size={35} color="#dedede" weight="fill" />
              <div className="">New</div>
            </div>

            <div className="flex flex-col items-center">
              <Broadcast size={35} color="#dedede" weight="fill" />
              <div className="">Radio</div>
            </div>

            <div className="flex flex-col items-center">
              <Bookmarks size={35} color="#dedede" weight="fill" />
              <div className=""> Library</div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            layout
            initial={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 10,
              mass: 0.1,
              ease: "easeInOut",
            }}
            layoutId="item"
            className="ml-4 rounded-full border-2 border-transparent bg-gradient-to-tl from-transparent to-white/10 backdrop-blur-sm"
          >
            <div className="rounded-full p-4 text-red-600 backdrop-blur-md">
              <House size={28} weight="fill" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!show ? (
          <motion.div
            layout
            layoutId="Search"
            initial={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 300,
              damping: 10,
              mass: 0.2,
              ease: "easeInOut",
            }}
            className="mr-4 rounded-full border border-transparent bg-gradient-to-tl from-transparent to-white/10 p-4 backdrop-blur-sm"
          >
            <Link href={"/music/search"}>
              <MagnifyingGlass size={28} color="#dedede" weight="bold" />
            </Link>
          </motion.div>
        ) : (
          <motion.div
            layout
            layoutId="Search"
            initial={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 300,
              damping: 10,
              mass: 0.1,
              ease: "easeInOut",
            }}
            className="mr-4 rounded-full p-4 backdrop-blur-sm"
          >
            <Link href={"/music/search"}>
              <MagnifyingGlass size={35} color="#dedede" weight="bold" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
