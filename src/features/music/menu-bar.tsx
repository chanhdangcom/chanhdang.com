"use client";

import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { useUser } from "@/hooks/use-user";
import { usePermissions } from "@/hooks/use-permissions";
import {
  BookBookmark,
  House,
  MicrophoneStage,
  MusicNotesSimple,
  ShieldCheck,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MagnifyingGlass } from "phosphor-react";
import { LogoutButton } from "./component/logout-button";

export function MenuBar() {
  const params = useParams();
  const locale = (params?.locale as string) || "vi";
  const { isAuthenticated } = useUser();
  const { canAddMusic, canAddSinger, canManageSystem, role } = usePermissions();
  const isRegularUser = role === "user";

  return (
    <div className="fixed left-4 top-4 z-30 hidden font-apple md:flex">
      <div className="absolute h-[96vh] w-60 space-y-4 rounded-3xl bg-gradient-to-tr from-transparent to-zinc-50 px-3 pt-5 text-zinc-50 shadow-xl backdrop-blur-3xl dark:to-white/10">
        <>
          <div className="space-y-2 text-base text-black dark:text-white">
            <div className="flex items-end gap-1">
              <Link href={`/${locale}/music`} className="flex cursor-pointer">
                <ChanhdangLogotype className="w-40" />

                <div className="my-4 flex text-sm font-semibold">Music</div>
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
                // layoutId="Search"
                className="gap-4"
              >
                <Link href={`/${locale}/music/search`}>
                  <div className="flex items-center gap-2 rounded-xl p-2">
                    <MagnifyingGlass
                      size={25}
                      weight="bold"
                      className="text-red-500"
                    />
                    <div className="font-medium">Search</div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-2 rounded-3xl bg-zinc-200/60 p-2 text-white dark:bg-zinc-800/60">
              <House size={25} weight="fill" className="text-red-500" />
              <div className="font-medium text-red-500">Home</div>
            </div>

            {canAddMusic ? (
              <Link
                href={`/${locale}/music/add-music`}
                className="flex items-center gap-2 rounded-2xl p-2"
              >
                <MusicNotesSimple
                  size={25}
                  weight="bold"
                  className="text-red-500"
                />
                <div className="font-medium">Add New Music</div>
              </Link>
            ) : (
              <div className="pointer-events-none flex items-center gap-2 p-2 opacity-30">
                <MusicNotesSimple
                  size={25}
                  weight="bold"
                  className="text-red-500"
                />
                <div className="font-medium">Add New Music</div>
              </div>
            )}

            {canAddSinger ? (
              <Link
                href={`/${locale}/music/add-singer`}
                className="flex items-center gap-2 rounded-2xl p-2"
              >
                <MicrophoneStage
                  size={25}
                  weight="fill"
                  className="text-red-500"
                />
                <div className="font-medium">Add Artists</div>
              </Link>
            ) : null}

            {isRegularUser && (
              <Link
                href={`/${locale}/music/my-music`}
                className="flex items-center gap-2 rounded-2xl p-2"
              >
                <UserCircle size={25} weight="fill" className="text-red-500" />
                <div className="font-medium">My Music</div>
              </Link>
            )}

            {canManageSystem && (
              <Link
                href={`/${locale}/music/admin`}
                className="flex items-center gap-2 rounded-2xl p-2"
              >
                <ShieldCheck size={25} weight="fill" className="text-red-500" />
                <div className="font-medium">Admin Panel</div>
              </Link>
            )}

            {isAuthenticated ? (
              <Link
                href={`/${locale}/music/library`}
                className="flex items-center gap-2 rounded-2xl p-2"
              >
                <BookBookmark
                  size={25}
                  weight="fill"
                  className="text-red-500"
                />
                <div className="font-medium">Library</div>
              </Link>
            ) : (
              <div className="pointer-events-none flex items-center gap-2 p-2 opacity-30">
                <BookBookmark
                  size={25}
                  weight="fill"
                  className="text-red-500"
                />
                <div className="font-medium">Library</div>
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
