"use client";

import * as React from "react";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { BorderPro } from "./border-pro";
import {
  CardsThree,
  ChatCircleDots,
  ChartDonut,
  Faders,
  Gear,
  SignOut,
  SketchLogo,
  UserCircle,
  UsersThree,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { ThemeToggleMenuBar } from "@/components/theme-toggle-menubar";
import { SwitchLanguageMenuBar } from "@/app/[locale]/features/profile/components/swtich-language-menu-bar";
import { usePermissions } from "@/hooks/use-permissions";
import { FriendsPanelContent } from "../social/friends-panel";
import { ChatbotPanel } from "@/components/chatbot/chatbot-panel";

const panelVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 10,
    filter: "blur(5px)",
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

export function LogoutButton() {
  const { user, logout } = useUser();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const withLocale = (path: string) => `/${locale}${path}`;
  const { canManageSystem } = usePermissions();
  const [isFriendsOpen, setIsFriendsOpen] = React.useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = React.useState(false);
  const [isDesktopViewport, setIsDesktopViewport] = React.useState(false);
  const friendsPanelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateViewport = () => setIsDesktopViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const body = document.body;
    const html = document.documentElement;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = html.style.overflow;
    const previousTouchAction = body.style.touchAction;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isChatbotOpen && isMobile) {
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
      body.style.touchAction = "none";
    } else {
      body.style.overflow = previousBodyOverflow || "";
      html.style.overflow = previousHtmlOverflow || "";
      body.style.touchAction = previousTouchAction || "";
    }

    return () => {
      body.style.overflow = previousBodyOverflow || "";
      html.style.overflow = previousHtmlOverflow || "";
      body.style.touchAction = previousTouchAction || "";
    };
  }, [isChatbotOpen]);

  React.useEffect(() => {
    if (!isFriendsOpen || !isDesktopViewport) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (friendsPanelRef.current?.contains(event.target as Node)) {
        return;
      }

      setIsFriendsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFriendsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFriendsOpen, isDesktopViewport]);

  const handleLogout = async () => {
    try {
      await logout();
      // Force page reload to ensure session is fully cleared
      // This is important for NextAuth session cleanup
      window.location.href = withLocale("/music");
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even if there's an error
      window.location.href = withLocale("/music");
    }
  };

  const desktopFriendsPanel =
    isDesktopViewport && isFriendsOpen && typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence>
            <motion.div
              ref={friendsPanelRef}
              key="desktop-friends-panel"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed bottom-24 right-4 z-[70] hidden w-[420px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-zinc-200 bg-white/95 shadow-2xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95 md:block"
            >
              <div className="flex items-start justify-between border-b p-4 dark:border-zinc-900">
                <div>
                  <div className="text-lg font-semibold">Friends</div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    Manage friend requests and open a friend library.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFriendsOpen(false)}
                  className="rounded-full p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                  aria-label="Close friends panel"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="max-h-[65vh] overflow-y-auto p-4">
                <FriendsPanelContent
                  locale={locale}
                  onNavigate={() => setIsFriendsOpen(false)}
                />
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <div>
      {!user ? (
        <Link href={withLocale("/auth/login")} className="size-10">
          <div className="my-2 flex items-center gap-2 font-apple text-black dark:text-white">
            <UserCircle size={20} weight="fill" className="size-10" />

            <div className="hidden md:flex">Login</div>
          </div>
        </Link>
      ) : (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="my-2 flex items-center gap-2 font-apple font-semibold">
                <BorderPro roundedSize="rounded-full">
                  {user?.avatarUrl ? (
                    <motion.img
                      src={user.avatarUrl || "/img/Logomark.png"}
                      alt={user.username}
                      className="size-10 rounded-full object-cover"
                      whileTap={{ scale: 0.9 }}
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-full bg-zinc-200 font-apple text-sm font-bold uppercase text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                      {user?.username?.charAt(0) || <UserCircle size={20} />}
                    </div>
                  )}
                </BorderPro>

                <div className="line-clamp-1 hidden max-w-[140px] truncate font-apple text-sm md:flex">
                  {user.username}
                </div>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="m-2 w-60 rounded-xl border bg-zinc-50 text-lg dark:border-zinc-800 dark:bg-zinc-950">
              <div className="text-md flex items-center gap-1 rounded-t-md bg-zinc-200 px-2.5 py-0.5 font-apple font-bold dark:bg-zinc-800">
                <div className="line-clamp-1 w-full truncate py-1.5 font-apple text-sm md:flex">
                  {user.username}
                </div>
              </div>

              <div className="pt-1">
              {/* <Link
                href={`/${locale}/music/add-music`}
                className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <MusicNotesSimple
                  size={20}
                  weight="bold"
                  className="text-rose-500 0"
                />

                <div className="text-sm font-medium">Add New Music</div>
              </Link> */}

              <Link
                href={`/${locale}/music/library`}
                className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <CardsThree size={20} className="0 text-rose-500" />

                <div className="text-sm font-medium">Library</div>
              </Link>

              <Link
                href={`/${locale}/music/premium`}
                className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <SketchLogo size={20} className="0 text-rose-500" />

                <div className="text-sm font-medium">Premium</div>
              </Link>

              {/* <Link
                href={`/${locale}/music/add-singer`}
                className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <MicrophoneStage
                  size={20}
                  className="text-rose-500 0"
                />

                <div className="text-sm font-medium">Add Artists</div>
              </Link> */}

              <div className="py-1 dark:border-zinc-800">
                <DropdownMenuItem
                  onSelect={() => setIsFriendsOpen(true)}
                  className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                >
                  <UsersThree size={20} className="text-rose-500" />
                  <div className="text-sm font-medium">Friends</div>
                </DropdownMenuItem>

                <div className="md:hidden">
                  <DropdownMenuItem
                    onSelect={() => setIsChatbotOpen(true)}
                    className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  >
                    <ChatCircleDots size={20} className="text-rose-500" />
                    <div className="text-sm font-medium">AI Chat</div>
                  </DropdownMenuItem>
                </div>

                <div className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 md:hidden">
                  <ThemeToggleMenuBar className="0 size-5 text-rose-500" />

                  <div className="text-sm font-medium">Theme</div>
                </div>

                <div className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 md:hidden">
                  <SwitchLanguageMenuBar className="" />
                </div>
              </div>

              <div className="border-t pt-1 dark:border-zinc-800">
                {canManageSystem && (
                  <div className="">
                    <Link
                      href={`/${locale}/music/management-page`}
                      className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    >
                      <ChartDonut size={20} className="0 text-rose-500" />

                      <div className="text-sm font-medium">Management</div>
                    </Link>
                  </div>
                )}

                <div className="">
                  <Link
                    href={`/${locale}/music/my-music`}
                    className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  >
                    <Faders size={20} className="0 text-rose-500" />

                    <div className="text-sm font-medium">My Music</div>
                  </Link>
                </div>

                <div className="">
                  <Link
                    href={`/${locale}/music/profile-setting`}
                    className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  >
                    <Gear size={20} className="0 text-rose-500" />

                    <div className="text-sm font-medium">Profile Setting</div>
                  </Link>
                </div>
              </div>

              <div className="border-t pt-1 dark:border-zinc-800">
                <div
                  className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  onClick={handleLogout}
                >
                  <SignOut size={20} className="0 text-rose-500" />

                  <div className="text-sm font-medium">Log Out</div>
                </div>
              </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Drawer
            open={!isDesktopViewport && isFriendsOpen}
            onOpenChange={setIsFriendsOpen}
          >
            <DrawerContent className="border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
              <DrawerHeader className="border-b dark:border-zinc-900">
                <DrawerTitle>Friends</DrawerTitle>
                <DrawerDescription>
                  Manage friend requests and open a friend library.
                </DrawerDescription>
              </DrawerHeader>

              <div className="max-h-[75vh] overflow-y-auto p-4">
                <FriendsPanelContent
                  locale={locale}
                  onNavigate={() => setIsFriendsOpen(false)}
                />
              </div>
            </DrawerContent>
          </Drawer>
        </>
      )}

      {desktopFriendsPanel}

      <AnimatePresence mode="wait">
        {isChatbotOpen ? (
          <motion.div
            key="mobile-avatar-chatbot"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 max-w-full font-apple md:hidden"
          >
            <ChatbotPanel
              handle={() => setIsChatbotOpen(false)}
              className="h-full rounded-none"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
