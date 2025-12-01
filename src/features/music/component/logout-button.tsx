"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, UserCircle } from "phosphor-react";
import Link from "next/link";

import { useUser } from "@/hooks/use-user";
import { LibraryCount } from "../library/library-count";
import { motion } from "framer-motion";
import { BorderPro } from "./border-pro";

export function LogoutButton() {
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    window.location.href = "/music";
  };

  return (
    <div>
      {!user ? (
        <Link href={"/auth/login"} className="size-10">
          <div className="my-2 flex items-center gap-2 text-black dark:text-white">
            <UserCircle size={20} weight="fill" className="size-10" />

            <div>Login</div>
          </div>
        </Link>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="my-2 flex items-center gap-2 font-semibold">
              {user?.avatarUrl ? (
                <BorderPro roundedSize="rounded-full">
                  <motion.img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="size-10 rounded-full object-cover"
                    whileTap={{ scale: 0.8 }}
                  />
                </BorderPro>
              ) : (
                <div className="flex gap-2">
                  <UserCircle size={20} weight="fill" className="size-10" />

                  <div>Login</div>
                </div>
              )}

              <div> {user.username} </div>
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
                  href={"/music/add-music"}
                  className="flex items-center gap-1"
                >
                  <div>Add Music</div>
                </Link>
              </div>

              <div className="rounded-md px-1 py-0.5 hover:bg-zinc-300 dark:hover:bg-zinc-800">
                <Link
                  href={"/music/library"}
                  className="flex items-center gap-1"
                >
                  <div>Library</div>
                  <LibraryCount userId={user?.id} />
                </Link>
              </div>

              <div className="flex items-center gap-1 rounded-md px-1 py-0.5 hover:bg-zinc-300 dark:hover:bg-zinc-800">
                <Link href={"/music/add-singer"}>Add Artists</Link>
              </div>

              <div className="flex items-center gap-1 rounded-md px-1 py-0.5 hover:bg-zinc-300 dark:hover:bg-zinc-800">
                <Link href={"/music/profile-setting"}>Profile Setting</Link>
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
