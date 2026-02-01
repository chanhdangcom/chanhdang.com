"use client";

import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { useUser } from "@/hooks/use-user";
import { usePermissions } from "@/hooks/use-permissions";
import {
  BookBookmark,
  CaretDown,
  CaretUp,
  Clock,
  Crown,
  House,
  MicrophoneStage,
  MusicNotesSimple,
  ShieldCheck,
  SquaresFour,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MagnifyingGlass } from "phosphor-react";
import { LogoutButton } from "./component/logout-button";
import { useState } from "react";

export function MenuBar() {
  const params = useParams();
  const locale = (params?.locale as string) || "vi";
  const { isAuthenticated } = useUser();
  const { canAddMusic, canAddSinger, canManageSystem, role } = usePermissions();
  const isRegularUser = role === "user";
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="fixed left-4 top-4 z-30 hidden font-apple md:flex">
      <div className="absolute h-[96vh] w-60 space-y-4 rounded-3xl bg-gradient-to-tr from-transparent to-zinc-50 px-3 pt-5 text-zinc-50 shadow-xl backdrop-blur-3xl dark:to-white/10">
        <>
          <div className="text-base text-black dark:text-white">
            <div className="flex items-end justify-center gap-1">
              <Link href={`/${locale}/music`} className="flex cursor-pointer">
                <ChanhdangLogotype className="w-full" />

                <div className="my-4 flex text-xs font-semibold">Music</div>
              </Link>
            </div>

            <AnimatePresence>
              <motion.div
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 20,
                  duration: 0.5,
                }}
                className="rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <Link href={`/${locale}/music/search`}>
                  <div className="flex items-center gap-2 rounded-xl px-4 py-2">
                    <MagnifyingGlass
                      size={25}
                      className="text-red-500 dark:text-blue-500"
                    />
                    <div className="font-medium">Search</div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>

            <Link href={`/${locale}/music`}>
              <div className="flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                <House size={25} className="text-red-500 dark:text-blue-500" />

                <div className="font-medium">Home</div>
              </div>
            </Link>

            <Link href={`/${locale}/music/new-release`}>
              <div className="flex items-center gap-2 rounded-2xl px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                <SquaresFour
                  size={25}
                  className="text-red-500 dark:text-blue-500"
                />

                <div className="font-medium">New</div>
              </div>
            </Link>

            <div className="mt-4 pl-3 text-xs font-medium text-zinc-500">
              Library
            </div>

            {isAuthenticated ? (
              <div>
                <Link
                  href={`/${locale}/music/library`}
                  className="flex items-center gap-2 rounded-2xl px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                >
                  <Clock
                    size={25}
                    className="text-red-500 dark:text-blue-500"
                  />

                  <div className="font-medium">Recently Played</div>
                </Link>

                <Link
                  href={`/${locale}/music/library`}
                  className="flex items-center gap-2 rounded-2xl px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                >
                  <BookBookmark
                    size={25}
                    className="text-red-500 dark:text-blue-500"
                  />

                  <div className="font-medium">Library</div>
                </Link>
              </div>
            ) : (
              <div className="pointer-events-none opacity-30">
                <Link
                  href={`/${locale}/music/library`}
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <Clock
                    size={25}
                    className="text-red-500 dark:text-blue-500"
                  />

                  <div className="font-medium">Recently Played</div>
                </Link>

                <Link
                  href={`/${locale}/music/library`}
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <BookBookmark
                    size={25}
                    className="text-red-500 dark:text-blue-500"
                  />

                  <div className="font-medium">Library</div>
                </Link>
              </div>
            )}

            {isRegularUser && (
              <Link
                href={`/${locale}/music/my-music`}
                className="flex items-center gap-2 rounded-2xl px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <UserCircle
                  size={25}
                  className="text-red-500 dark:text-blue-500"
                />

                <div className="font-medium">My Music</div>
              </Link>
            )}

            {canManageSystem && (
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2 rounded-2xl px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                  <Crown
                    size={25}
                    className="text-red-500 dark:text-blue-500"
                  />

                  <div className="flex w-full items-center justify-between gap-2">
                    <div className="font-medium">Manage</div>

                    {isDropdownOpen ? (
                      <CaretUp size={15} weight="bold" />
                    ) : (
                      <CaretDown size={15} weight="bold" />
                    )}
                  </div>
                </div>
              </div>
            )}

            {canManageSystem && (
              <div>
                {isDropdownOpen && (
                  <div className="space-y-2 pl-4">
                    <Link
                      href={`/${locale}/music/admin`}
                      className="flex items-center gap-2 rounded-2xl px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                    >
                      <ShieldCheck
                        size={25}
                        className="text-red-500 dark:text-blue-500"
                      />

                      <div className="font-medium">Admin Panel</div>
                    </Link>

                    {canAddMusic ? (
                      <Link
                        href={`/${locale}/music/add-music`}
                        className="flex items-center gap-2 rounded-2xl px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                      >
                        <MusicNotesSimple
                          size={25}
                          weight="bold"
                          className="text-red-500 dark:text-blue-500"
                        />

                        <div className="font-medium">Add New Music</div>
                      </Link>
                    ) : (
                      <div className="pointer-events-none flex items-center gap-2 px-4 py-2 opacity-30">
                        <MusicNotesSimple
                          size={25}
                          weight="bold"
                          className="text-red-500 dark:text-blue-500"
                        />

                        <div className="font-medium">Add New Music</div>
                      </div>
                    )}

                    {canAddSinger ? (
                      <Link
                        href={`/${locale}/music/add-singer`}
                        className="flex items-center gap-2 rounded-2xl px-4 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                      >
                        <MicrophoneStage
                          size={25}
                          className="text-red-500 dark:text-blue-500"
                        />

                        <div className="font-medium">Add Artists</div>
                      </Link>
                    ) : null}
                  </div>
                )}
              </div>
            )}

            <div className="absolute bottom-0 left-0 flex w-full justify-center">
              <LogoutButton />
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
