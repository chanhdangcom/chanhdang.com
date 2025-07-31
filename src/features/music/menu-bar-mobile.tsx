import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import {
  Bookmarks,
  House,
  MagnifyingGlass,
  Plus,
  SquaresFour,
} from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/hooks/use-user";
import LiquidGlassBackground from "@/components/liquid-glass-background";

export function MenuBarMobile() {
  const { isAuthenticated } = useUser();
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
          <LiquidGlassBackground className="ml-2 bg-zinc-200/70 px-8 py-1.5 dark:bg-black/80">
            <motion.div
              layout
              transition={{
                type: "spring",
                duration: 1,
              }}
              layoutId="item"
              className="flex items-center gap-8 rounded-full border border-transparent dark:text-white"
            >
              <div className="flex flex-col items-center text-red-500">
                <House size={30} weight="fill" />
                <div className="text-sm font-semibold">Home</div>
              </div>

              <div className="flex flex-col items-center">
                <SquaresFour size={30} weight="fill" className="" />
                <div className="text-sm">New</div>
              </div>

              {isAuthenticated ? (
                <Link
                  href={"/music/add"}
                  className="flex flex-col items-center"
                >
                  <Plus size={30} weight="fill" />
                  <div className="text-sm">Add</div>
                </Link>
              ) : (
                <div className="pointer-events-none flex flex-col items-center opacity-30">
                  <Plus size={30} weight="fill" />
                  <div className="text-sm">Add</div>
                </div>
              )}

              {isAuthenticated ? (
                <Link
                  href={"/music/add"}
                  className="flex flex-col items-center"
                >
                  <div className="flex flex-col items-center">
                    <Bookmarks size={30} weight="fill" />
                    <div className="text-sm"> Library</div>
                  </div>
                </Link>
              ) : (
                <div className="pointer-events-none flex flex-col items-center opacity-30">
                  <div className="flex flex-col items-center">
                    <Bookmarks size={30} weight="fill" />
                    <div className="text-sm"> Library</div>
                  </div>
                </div>
              )}
            </motion.div>
          </LiquidGlassBackground>
        ) : (
          <motion.div
            layout
            transition={{
              duration: 0.5,
              type: "spring",
            }}
            layoutId="item"
            className="ml-4 rounded-full border border-white/20 bg-zinc-200/80 dark:bg-black/80"
          >
            <div className="rounded-full p-4 text-red-600">
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
            className="mr-4 rounded-full border border-white/20 bg-zinc-200/80 p-4 dark:bg-black/90"
          >
            <Link href={"/music/search"}>
              <MagnifyingGlass
                size={28}
                weight="bold"
                className="text-black dark:text-white"
              />
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
            className="mr-2 rounded-full border border-white/20 bg-zinc-200/80 p-4 dark:bg-black/90"
          >
            <Link href={"/music/search"}>
              <MagnifyingGlass
                size={30}
                weight="bold"
                className="text-black dark:text-white"
              />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
