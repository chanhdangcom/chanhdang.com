"use client";

import { LogoutButton } from "./component/logout-button";

type IProp = {
  name?: string;
};

export const HeaderMusicPage = ({ name }: IProp) => {
  return (
    <div className="bt-2 sticky inset-0 top-0 z-10 rounded-b-xl pb-2 font-apple transition">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <>
              <div className="pointer-events-none fixed left-0 top-0 z-10 h-14 w-full bg-gradient-to-b from-zinc-100/40 to-transparent dark:from-zinc-950/80">
                <div className="h-10 w-full backdrop-blur-[1px]" />
              </div>

              <div className="z-20 ml-3 text-3xl font-bold md:ml-0 md:mt-4">
                {name || "Home"}
              </div>
            </>
          </div>

          <div className="z-20 mr-4 md:hidden">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
};
