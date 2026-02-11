"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { House, MagnifyingGlass } from "phosphor-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "@/hooks/use-user";
import {
  CardsThree,
  PlusSquare,
  SquaresFour,
} from "@phosphor-icons/react/dist/ssr";

export function MenuBarMobile() {
  const params = useParams();
  const locale = (params?.locale as string) || "vi";
  const { isAuthenticated } = useUser();
  const [show, setShow] = useState(true);
  const showStateRef = useRef(true);
  const [reactToScroll, setReactToScroll] = useState(false);
  const lastScrollY = useRef(0);
  const scrollDir = useRef<"up" | "down" | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const ticking = useRef(false);

  const updateShow = useCallback((isVisible: boolean) => {
    if (showStateRef.current === isVisible) return;
    showStateRef.current = isVisible;
    setShow(isVisible);
  }, []);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY.current;
        const threshold = 20; // Ngưỡng scroll để trigger
        const scrollOffset = 100; // Offset từ top để tự động hiện

        // Tự động hiện khi scroll về đầu trang
        if (currentScrollY < scrollOffset) {
          updateShow(true);
          scrollDir.current = "up";
          lastScrollY.current = currentScrollY;
          ticking.current = false;
          return;
        }

        // Chỉ xử lý khi scroll đủ lớn
        if (Math.abs(delta) < threshold) {
          lastScrollY.current = currentScrollY;
          ticking.current = false;
          return;
        }

        // Clear timeout cũ
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
        }

        // Debounce để tránh toggle quá nhanh
        timeoutRef.current = window.setTimeout(() => {
          if (delta > threshold && scrollDir.current !== "down") {
            updateShow(false); // scroll xuống → ẩn
            scrollDir.current = "down";
          } else if (delta < -threshold && scrollDir.current !== "up") {
            updateShow(true); // scroll lên → hiện
            scrollDir.current = "up";
          }

          lastScrollY.current = currentScrollY;
          ticking.current = false; // Chỉ set false khi timeout hoàn thành
        }, 150); // Debounce 150ms để mượt hơn
      });

      ticking.current = true;
    }
  }, [updateShow]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => {
      if (mq.matches) {
        setReactToScroll(true);
        lastScrollY.current = window.scrollY;
      } else {
        setReactToScroll(false);
        updateShow(true);
      }
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [updateShow]);

  useEffect(() => {
    if (!reactToScroll) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      ticking.current = false;
    };
  }, [handleScroll, reactToScroll]);

  return (
    <div className="fixed inset-x-4 bottom-6 z-10 flex items-center justify-between sm:hidden">
      <AnimatePresence>
        {show ? (
          <div className="bg-zinc-200/72 dark:bg-zinc-900/72 relative overflow-hidden rounded-[50px] border border-white/20 py-1.5 pr-2 shadow-[0_16px_34px_-14px_rgba(0,0,0,0.42),0_1px_0_rgba(255,255,255,0.55)_inset,0_-1px_0_rgba(0,0,0,0.06)_inset] backdrop-blur-3xl dark:border-white/10 dark:shadow-[0_18px_38px_-14px_rgba(0,0,0,0.78),0_1px_0_rgba(255,255,255,0.12)_inset,0_-1px_0_rgba(0,0,0,0.45)_inset]">
            <div className="via-white/8 dark:from-white/12 pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/35 to-transparent dark:via-transparent dark:to-transparent" />
            <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-black/10 dark:bg-white/10" />
            <div className="absolute inset-y-1 left-0 -z-10 ml-1 w-20 shrink-0 rounded-full bg-zinc-400 opacity-80 dark:bg-zinc-700" />

            <motion.div
              layout
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 30,
                mass: 0.7,
              }}
              layoutId="item"
              className="relative z-10 flex items-center justify-between gap-10 rounded-full border border-transparent px-1 dark:text-white"
            >
              <Link
                href={`/${locale}/music`}
                className="flex flex-col items-center rounded-full pl-5 text-rose-500"
              >
                <House size={30} weight="fill" />

                <div className="text-xs">Home</div>
              </Link>

              <Link
                href={`/${locale}/music/new-release`}
                className="flex flex-col items-center"
              >
                <SquaresFour size={30} weight="fill" />

                <div className="text-xs">New</div>
              </Link>

              {isAuthenticated ? (
                <Link
                  href={`/${locale}/music/add-music`}
                  className="flex flex-col items-center"
                >
                  <PlusSquare size={30} weight="fill" />

                  <div className="text-xs">Music</div>
                </Link>
              ) : (
                <div className="pointer-events-none flex flex-col items-center opacity-25">
                  <PlusSquare size={30} weight="fill" />

                  <div className="text-xs">Music</div>
                </div>
              )}

              {isAuthenticated ? (
                <Link
                  href={`/${locale}/music/library`}
                  className="flex flex-col items-center"
                >
                  <div className="flex flex-col items-center">
                    <CardsThree size={30} weight="fill" />
                    <div className="text-xs">Library</div>
                  </div>
                </Link>
              ) : (
                <div className="pointer-events-none flex flex-col items-center opacity-30">
                  <div className="flex flex-col items-center">
                    <CardsThree size={30} weight="fill" />
                    <div className="text-xs">Library</div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        ) : (
          <motion.div
            layout
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 30,
              mass: 0.7,
            }}
            layoutId="item"
            className="bg-zinc-200/72 dark:bg-zinc-900/72 rounded-full border border-white/20 p-4 shadow-[0_16px_34px_-14px_rgba(0,0,0,0.42),0_1px_0_rgba(255,255,255,0.55)_inset] backdrop-blur-lg dark:border-white/10 dark:shadow-[0_18px_38px_-14px_rgba(0,0,0,0.78),0_1px_0_rgba(255,255,255,0.12)_inset]"
          >
            <Link href={`/${locale}/music/`}>
              <House size={30} weight="fill" className="text-rose-600" />
            </Link>
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
              stiffness: 320,
              damping: 30,
              mass: 0.7,
            }}
            className="bg-zinc-200/72 dark:bg-zinc-900/72 rounded-full border border-white/20 p-4 shadow-[0_16px_34px_-14px_rgba(0,0,0,0.42),0_1px_0_rgba(255,255,255,0.55)_inset] backdrop-blur-lg dark:border-white/10 dark:shadow-[0_18px_38px_-14px_rgba(0,0,0,0.78),0_1px_0_rgba(255,255,255,0.12)_inset]"
          >
            <Link href={`/${locale}/music/search`}>
              <MagnifyingGlass
                size={30}
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
              type: "spring",
              stiffness: 320,
              damping: 30,
              mass: 0.7,
            }}
            className="bg-zinc-200/72 dark:bg-zinc-900/72 rounded-full border border-white/20 p-3 shadow-[0_16px_34px_-14px_rgba(0,0,0,0.42),0_1px_0_rgba(255,255,255,0.55)_inset] backdrop-blur-lg dark:border-white/10 dark:shadow-[0_18px_38px_-14px_rgba(0,0,0,0.78),0_1px_0_rgba(255,255,255,0.12)_inset]"
          >
            <Link href={`/${locale}/music/search`}>
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
