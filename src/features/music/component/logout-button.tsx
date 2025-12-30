"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, UserCircle } from "phosphor-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { useUser } from "@/hooks/use-user";
import { LibraryCount } from "../library/library-count";
import { motion } from "framer-motion";
import { BorderPro } from "./border-pro";

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

            <div>Login</div>
          </div>
        </Link>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="my-2 flex items-center gap-2 font-semibold">
              <BorderPro roundedSize="rounded-full">
                {user?.avatarUrl ? (
                  <motion.img
                    src={user.avatarUrl}
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

          <DropdownMenuContent className="w-52 space-y-2 rounded-xl border bg-zinc-50 text-lg dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-md flex items-center gap-1 rounded-t-md bg-zinc-300 px-1 py-0.5 font-bold dark:bg-zinc-900">
              <User weight="fill" />

              {user.username}
            </div>

            <div className="text-lg">
              <div className="rounded-md px-1 py-0.5 hover:bg-zinc-300 dark:hover:bg-zinc-800">
                <Link
                  href={withLocale("/music/add-music")}
                  className="flex items-center gap-1"
                >
                  <div>Add Music</div>
                </Link>
              </div>

              <div className="rounded-md px-1 py-0.5 hover:bg-zinc-300 dark:hover:bg-zinc-800">
                <Link
                  href={withLocale("/music/library")}
                  className="flex items-center gap-1"
                >
                  <div>Library</div>
                  <LibraryCount userId={user?.id} />
                </Link>
              </div>

              <div className="flex items-center gap-1 rounded-md px-1 py-0.5 hover:bg-zinc-300 dark:hover:bg-zinc-800">
                <Link href={withLocale("/music/add-singer")}>Add Artists</Link>
              </div>

              <div className="flex items-center gap-1 rounded-md px-1 py-0.5 hover:bg-zinc-300 dark:hover:bg-zinc-800">
                <Link href={withLocale("/music/profile-setting")}>
                  Profile Setting
                </Link>
              </div>

              <div
                className="flex items-center gap-1 rounded-md px-1 py-0.5 hover:bg-zinc-300 dark:hover:bg-zinc-800"
                onClick={handleLogout}
              >
                <div>Log Out</div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
