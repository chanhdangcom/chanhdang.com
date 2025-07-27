"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignIn, UserCircle } from "phosphor-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { FavoritesCount } from "./favorites-count";

export function LogoutButton() {
  const { user, logout } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/music");
  };

  return (
    <div>
      {!user ? (
        <Link
          href={"auth/login"}
          className="flex items-center justify-center gap-1 rounded-xl border px-4 py-1 shadow-sm backdrop-blur-sm dark:border-zinc-800"
        >
          <div className="font-semibold">Login</div>

          <SignIn size={25} className="size-6" />
        </Link>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <div className="flex items-center gap-1">
                <UserCircle size={12} weight="fill" className="size-8" />

                <div className="text-sm font-semibold hover:underline">
                  {user.username}
                </div>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-64 space-y-2 rounded-xl border bg-zinc-50 text-lg dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-md rounded-t-md bg-zinc-300 px-1 py-0.5 font-bold dark:bg-zinc-900">
              Menu
            </div>

            <div className="text-lg">
              <div className="rounded-md px-1 py-0.5 hover:bg-zinc-300 dark:hover:bg-zinc-800">
                <Link href={"music/add"} className="flex items-center gap-1">
                  <div>Add Music</div>
                </Link>
              </div>

              <div className="rounded-md px-1 py-0.5 hover:bg-zinc-300 dark:hover:bg-zinc-800">
                <Link
                  href={"music/favorites"}
                  className="flex items-center gap-1"
                >
                  <div>Favorites</div>
                  <FavoritesCount userId={user?.id} />
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
