"use client";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { House } from "phosphor-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "@/hooks/use-user";
import { PlusSquare, SquaresFour } from "@phosphor-icons/react/dist/ssr";
import { Magnifyingglass } from "@/components/icon/magnifyingglass";
import { MusicNoteSquareStackFill } from "@/components/icon/music-note-square-stack-fill";
import {
  MenuBarMobileItem,
  type MenuBarMobileItemConfig,
} from "./component/menu-bar-mobile-item";

const expandedMenuMotion = {
  initial: { opacity: 0, y: 18, scale: 0.92, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: 18, scale: 0.94, filter: "blur(6px)" },
};

const compactMenuMotion = {
  initial: { opacity: 0, y: 14, scale: 0.82, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: 14, scale: 0.88, filter: "blur(6px)" },
};

const springTransition = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.7,
} as const;

export function MenuBarMobile() {
  const params = useParams();
  const pathname = usePathname();
  const locale = (params?.locale as string) || "vi";
  const { isAuthenticated } = useUser();
  const tCommon = useTranslations("music.common");

  const [show, setShow] = useState(true);
  const showStateRef = useRef(true);
  const [reactToScroll, setReactToScroll] = useState(false);
  const lastScrollY = useRef(0);
  const scrollDir = useRef<"up" | "down" | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const ticking = useRef(false);
  const basePath = `/${locale}/music`;

  const isPathActive = (target: string, exact = false) =>
    exact
      ? pathname === target
      : pathname === target || pathname.startsWith(`${target}/`);

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

  const mainItems: MenuBarMobileItemConfig[] = [
    {
      key: "home",
      label: tCommon("home"),
      href: `${basePath}`,
      isActive: isPathActive(basePath, true),
      icon: <House size={30} weight="fill" />,
    },
    {
      key: "new",
      label: tCommon("new"),
      href: `${basePath}/new-release`,
      isActive: isPathActive(`${basePath}/new-release`),
      icon: <SquaresFour size={30} weight="fill" />,
    },
    {
      key: "add-music",
      label: tCommon("music"),
      href: `${basePath}/add-music`,
      isActive: isPathActive(`${basePath}/add-music`),
      disabled: !isAuthenticated,
      icon: <PlusSquare size={30} weight="fill" />,
    },
    {
      key: "library",
      label: tCommon("library"),
      href: `${basePath}/library`,
      isActive: isPathActive(`${basePath}/library`),
      disabled: !isAuthenticated,
      icon: <MusicNoteSquareStackFill className="size-7" />,
    },
  ];

  // Xác định icon và href dựa trên router hiện tại
  const getCurrentRouteIcon = () => {
    if (isPathActive(`${basePath}/search`)) {
      return {
        icon: <Magnifyingglass className="size-7" />,
        href: `${basePath}/search`,
        isActive: true,
      };
    }
    if (isPathActive(`${basePath}/new-release`)) {
      return {
        icon: <SquaresFour size={30} weight="fill" />,
        href: `${basePath}/new-release`,
        isActive: true,
      };
    }
    if (isPathActive(`${basePath}/add-music`)) {
      return {
        icon: <PlusSquare size={30} weight="fill" />,
        href: `${basePath}/add-music`,
        isActive: true,
      };
    }
    if (isPathActive(`${basePath}/library`)) {
      return {
        icon: <MusicNoteSquareStackFill className="size-7" />,
        href: `${basePath}/library`,
        isActive: true,
      };
    }
    // Default: Home
    return {
      icon: <House size={30} weight="fill" />,
      href: `${basePath}`,
      isActive: isPathActive(basePath, true),
    };
  };

  const currentRoute = getCurrentRouteIcon();

  return (
    <div className="fixed inset-x-4 bottom-6 z-40 flex items-center justify-between font-apple sm:hidden">
      <LayoutGroup>
        <AnimatePresence mode="popLayout" initial={false}>
          {show ? (
            <motion.div
              key="mobile-menu-expanded"
              whileTap={{ scale: 1.05 }}
              layout
              layoutId="item"
              initial={expandedMenuMotion.initial}
              animate={expandedMenuMotion.animate}
              exit={expandedMenuMotion.exit}
              transition={springTransition}
              className="relative overflow-hidden rounded-[50px] border border-white/20 bg-white/70 px-0.5 py-1 backdrop-blur-sm dark:border-white/10 dark:bg-black/70"
            >
              <motion.div
                layout
                transition={springTransition}
                className="relative z-10 flex items-center justify-between rounded-full border border-transparent px-0.5 dark:text-white"
              >
                {mainItems.map((item, index) => (
                  <div key={item.key} className={index === 0 ? "" : ""}>
                    <MenuBarMobileItem item={item} />
                  </div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="mobile-menu-compact"
              layout
              layoutId="item"
              initial={compactMenuMotion.initial}
              animate={compactMenuMotion.animate}
              exit={compactMenuMotion.exit}
              transition={springTransition}
              className="rounded-full border border-white/20 bg-zinc-300/80 p-4 shadow-[0_16px_34px_-14px_rgba(0,0,0,0.42),0_1px_0_rgba(255,255,255,0.55)_inset] backdrop-blur-lg dark:border-white/10 dark:bg-zinc-950/80 dark:shadow-[0_18px_38px_-14px_rgba(0,0,0,0.78),0_1px_0_rgba(255,255,255,0.12)_inset]"
            >
              <Link href={currentRoute.href}>
                <div
                  className={
                    currentRoute.isActive
                      ? "text-rose-600"
                      : "text-black dark:text-white"
                  }
                >
                  {currentRoute.icon}
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout" initial={false}>
          {!show ? (
            <motion.div
              key="mobile-search-compact"
              layout
              layoutId="Search"
              initial={compactMenuMotion.initial}
              animate={compactMenuMotion.animate}
              exit={compactMenuMotion.exit}
              transition={springTransition}
              className="rounded-full border border-white/20 bg-zinc-300/80 p-4 shadow-[0_16px_34px_-14px_rgba(0,0,0,0.42),0_1px_0_rgba(255,255,255,0.55)_inset] backdrop-blur-lg dark:border-white/10 dark:bg-zinc-950/80 dark:shadow-[0_18px_38px_-14px_rgba(0,0,0,0.78),0_1px_0_rgba(255,255,255,0.12)_inset]"
            >
              <Link href={`${basePath}/search`}>
                <Magnifyingglass className="size-7 text-black dark:text-white" />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="mobile-search-expanded"
              layout
              layoutId="Search"
              initial={expandedMenuMotion.initial}
              animate={expandedMenuMotion.animate}
              exit={expandedMenuMotion.exit}
              transition={springTransition}
              className="rounded-full border border-white/20 bg-zinc-300/80 p-3 shadow-[0_16px_34px_-14px_rgba(0,0,0,0.42),0_1px_0_rgba(255,255,255,0.55)_inset] backdrop-blur-lg dark:border-white/10 dark:bg-zinc-950/80 dark:shadow-[0_18px_38px_-14px_rgba(0,0,0,0.78),0_1px_0_rgba(255,255,255,0.12)_inset]"
            >
              <Link href={`${basePath}/search`}>
                <Magnifyingglass className="size-7 text-black dark:text-white" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}
