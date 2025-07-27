"use client";

import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { useUser } from "@/hooks/use-user";
import { BookBookmark, House } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Plus } from "phosphor-react";

export function MenuBar() {
  const { isAuthenticated } = useUser();

  return (
    <div className="relative ml-4 mt-4 hidden md:flex">
      <div className="w-60"></div>
      <div className="absolute h-full w-60 rounded-3xl bg-gradient-to-b from-zinc-100 to-zinc-50 p-4 dark:from-zinc-900 dark:to-zinc-950">
        <div className="">
          <div className="space-y-2 text-base font-medium text-black dark:text-white">
            <Link href={"/music"} className="mb-8 flex cursor-pointer">
              <ChanhdangLogotype className="w-40" />

              <div className="mt-4 flex text-sm font-semibold">Music</div>
            </Link>

            <div className="flex items-center gap-2 rounded-2xl bg-zinc-300 p-2 dark:bg-zinc-800">
              <House size={20} weight="fill" />
              <div className="font-semibold">Home</div>
            </div>

            {isAuthenticated ? (
              <Link
                href={"/music/add"}
                className="flex items-center gap-2 rounded-2xl bg-zinc-300 p-2 dark:bg-zinc-800"
              >
                <Plus size={20} weight="bold" />
                <div className="font-semibold">Add New Music</div>
              </Link>
            ) : (
              <div className="pointer-events-none flex items-center gap-2 rounded-2xl bg-zinc-300 p-2 opacity-30 dark:bg-zinc-800">
                <Plus size={20} weight="bold" />
                <div className="font-semibold">Add New Music</div>
              </div>
            )}

            <Link
              href={"/music/favorites"}
              className="flex items-center gap-2 rounded-2xl bg-zinc-300 p-2 dark:bg-zinc-800"
            >
              <BookBookmark size={20} weight="fill" />
              <div className="font-semibold">Library</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
