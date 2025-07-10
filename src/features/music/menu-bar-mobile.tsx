import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import {
  Bookmarks,
  Broadcast,
  House,
  MagnifyingGlass,
  SquaresFour,
} from "phosphor-react";
import { useEffect, useRef, useState } from "react";

export function MenuBarMobile() {
  const [show, setShow] = useState(true);
  const lastScrollY = useRef(0);
  const scrollDir = useRef<"up" | "down" | null>(null);

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const threshold = 15; // chỉ xử lý nếu chênh lệch đủ lớn
    const delay = 10; // debounce nhẹ để phản ứng mượt hơn

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (Math.abs(delta) < threshold) return;

      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        if (delta > 0 && scrollDir.current !== "down") {
          setShow(false); // scroll xuống → ẩn
          scrollDir.current = "down";
        } else if (delta < 0 && scrollDir.current !== "up") {
          setShow(true); // scroll lên → hiện
          scrollDir.current = "up";
        }

        lastScrollY.current = currentScrollY;
      }, delay);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="fixed bottom-4 z-20 flex w-full items-center justify-between sm:hidden">
      <AnimatePresence>
        {show ? (
          <motion.div
            layout
            transition={{
              type: "spring",
              duration: 1,
            }}
            layoutId="item"
            className="ml-2 flex items-center gap-8 rounded-full border-2 border-transparent bg-gradient-to-tl from-transparent to-white/10 px-8 py-1.5 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center text-red-600">
              <House size={30} weight="fill" />
              <div className="text-sm font-semibold">Home</div>
            </div>

            <div className="flex flex-col items-center">
              <SquaresFour size={30} color="#dedede" weight="fill" />
              <div className="text-sm">New</div>
            </div>

            <div className="flex flex-col items-center">
              <Broadcast size={30} color="#dedede" weight="fill" />
              <div className="text-sm">Radio</div>
            </div>

            <div className="flex flex-col items-center">
              <Bookmarks size={30} color="#dedede" weight="fill" />
              <div className="text-sm"> Library</div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            layout
            transition={{
              duration: 0.5,
              type: "spring",
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
            transition={{
              type: "spring",
              duration: 1,
              ease: "easeInOut",
            }}
            className="mr-4 rounded-full border-2 border-transparent bg-gradient-to-bl from-transparent to-zinc-400/10 p-4 backdrop-blur-sm"
          >
            <Link href={"/music/search"}>
              <MagnifyingGlass size={28} color="#dedede" weight="bold" />
            </Link>
          </motion.div>
        ) : (
          <motion.div
            layout
            layoutId="Search"
            transition={{
              duration: 1,
              type: "spring",
            }}
            className="order mr-4 rounded-full border border-transparent bg-gradient-to-bl from-transparent to-zinc-400/10 p-4 backdrop-blur-sm"
          >
            <Link href={"/music/search"}>
              <MagnifyingGlass size={30} color="#dedede" weight="bold" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
