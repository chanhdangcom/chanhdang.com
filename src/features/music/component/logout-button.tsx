"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { motion } from "framer-motion";
import { BorderPro } from "./border-pro";
import {
  CardsThree,
  Gear,
  MicrophoneStage,
  MusicNotesSimple,
  SignOut,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";
import { ThemeToggleMenuBar } from "@/components/theme-toggle-menubar";
import { SwitchLanguageMenuBar } from "@/app/[locale]/features/profile/components/swtich-language-menu-bar";

export function LogoutButton() {
  const { user, logout } = useUser();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const withLocale = (path: string) => `/${locale}${path}`;

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

  return (
    <div>
      {!user ? (
        <Link href={withLocale("/auth/login")} className="size-10">
          <div className="my-2 flex items-center gap-2 text-black dark:text-white">
            <UserCircle size={20} weight="fill" className="size-10" />

            <div className="hidden md:flex">Login</div>
          </div>
        </Link>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="my-2 flex items-center gap-2 font-semibold">
              <BorderPro roundedSize="rounded-full">
                {user?.avatarUrl ? (
                  <motion.img
                    src={user.avatarUrl || "/img/Logomark.png"}
                    alt={user.username}
                    className="size-10 rounded-full object-cover"
                    whileTap={{ scale: 0.9 }}
                  />
                ) : (
                  <div className="flex size-10 items-center justify-center rounded-full bg-zinc-200 text-sm font-bold uppercase text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                    {user?.username?.charAt(0) || <UserCircle size={20} />}
                  </div>
                )}
              </BorderPro>

              <div className="line-clamp-1 hidden max-w-[140px] truncate text-sm md:flex">
                {user.username}
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="m-2 w-60 rounded-xl border bg-zinc-50 text-lg dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-md flex items-center gap-1 rounded-t-md bg-zinc-200 px-2.5 py-0.5 font-bold dark:bg-zinc-800">
              <div className="line-clamp-1 w-full truncate py-1.5 text-sm md:flex">
                {user.username}
              </div>
            </div>

            <div className="pt-1">
              <Link
                href={`/${locale}/music/add-music`}
                className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <MusicNotesSimple
                  size={20}
                  weight="bold"
                  className="text-rose-500 dark:text-blue-500"
                />

                <div className="text-sm font-medium">Add New Music</div>
              </Link>

              <Link
                href={`/${locale}/music/library`}
                className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <CardsThree
                  size={20}
                  className="text-rose-500 dark:text-blue-500"
                />

                <div className="text-sm font-medium">Library</div>
              </Link>

              <Link
                href={`/${locale}/music/add-singer`}
                className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <MicrophoneStage
                  size={20}
                  className="text-rose-500 dark:text-blue-500"
                />

                <div className="text-sm font-medium">Add Artists</div>
              </Link>

              <div className="pb-1">
                <Link
                  href={`/${locale}/music/profile-setting`}
                  className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                >
                  <Gear size={20} className="text-rose-500 dark:text-blue-500" />

                  <div className="text-sm font-medium">Profile Setting</div>
                </Link>
              </div>

              <div className="space-y-2 border-t py-2 dark:border-zinc-800 md:hidden">
                <div className="flex items-center gap-2 rounded-2xl px-2 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                  <ThemeToggleMenuBar className="size-5 text-sm font-medium text-rose-500 dark:text-blue-500" />

                  <div className="text-sm font-medium">Theme</div>
                </div>

                <div className="flex items-center gap-2 rounded-2xl px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                  <SwitchLanguageMenuBar className="text-sm font-medium" />
                </div>
              </div>

              <div className="space-y-2 border-t pt-1 dark:border-zinc-800">
                <div
                  className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  onClick={handleLogout}
                >
                  <SignOut
                    size={20}
                    className="text-rose-500 dark:text-blue-500"
                  />

                  <div className="text-sm font-medium">Log Out</div>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
