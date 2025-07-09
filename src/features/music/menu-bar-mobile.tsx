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
            initial={{ opacity: 1, scale: 0.9 }}
            exit={{ opacity: 1, scale: 0.9 }}
            transition={{
              duration: 1,
              type: "spring",
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
            transition={{
              duration: 0.7,
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
              duration: 1,
              type: "spring",
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
            transition={{
              duration: 1,
              type: "spring",
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
