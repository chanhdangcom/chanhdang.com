import { SwitchTheme } from "@/components/switch-theme";
import { Progress } from "@/components/ui/progress";

import React from "react";
import { Search } from "./component/search";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";

export const HeaderMusicPage = () => {
  return (
    <div className="container sticky inset-0 top-0 z-10 bg-zinc-100 pb-2 dark:border-b dark:border-zinc-800 dark:bg-zinc-950">
      <Progress className="w-[60%]" value={33} />
      <div className="flex h-14 items-center justify-between">
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

        <SwitchTheme />
      </div>
    </div>
  );
};
