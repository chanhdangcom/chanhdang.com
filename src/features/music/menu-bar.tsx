"use client";

import { useUser } from "@/hooks/use-user";
import { BookBookmark, House } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Plus } from "phosphor-react";

export function MenuBar() {
  const { isAuthenticated } = useUser();

  return (
    <div className="fixed left-4 top-4 z-30 hidden md:flex">
      <div className="absolute h-screen w-60 rounded-2xl border-r border-t bg-zinc-100/60 p-4 shadow-sm backdrop-blur-xl dark:border-zinc-900 dark:bg-zinc-900/60">
        <>
          <div className="space-y-2 text-base font-medium text-black dark:text-white">
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
        </>
      </div>
    </div>
  );
}
