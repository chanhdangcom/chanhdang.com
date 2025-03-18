import { Progress } from "@/components/ui/progress";

import React from "react";
import { Search } from "./component/search";
import {
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  Screencast,
} from "@phosphor-icons/react/dist/ssr";
import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { MusicType } from "./music-type";
import Link from "next/link";

export const HeaderMusicPage = () => {
  return (
    <div className="container sticky inset-0 top-0 z-40 pb-2 backdrop-blur-md">
      <Progress className="w-[60%]" value={33} />

      <div className="space-y-4 md:hidden">
        <div className="flex items-center justify-between">
          <ChanhdangLogotype />

          <div className="flex gap-4 text-zinc-500">
            <Screencast size={25} />

            {/* <SearchMotion /> */}
            <Link href="/search">
              <MagnifyingGlass size={25} />
            </Link>
          </div>
        </div>

        <MusicType />
      </div>

      <div className="hidden h-14 items-center justify-between md:flex">
        <div className="flex gap-16">
          <div className="flex items-center gap-4">
            <CaretLeft
              size={25}
              weight="bold"
              className="rounded-full bg-zinc-200 p-1 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-500"
            />
            <CaretRight
              size={25}
              weight="bold"
              className="rounded-full bg-zinc-200 p-1 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-500"
            />
          </div>

          <Search />
        </div>
      </div>
    </div>
  );
};
