"use client";

import { MusicType } from "./music-type";

import { LogoutButton } from "./component/logout-button";

type IProp = {
  name?: string;
};

export const HeaderMusicPage = ({ name }: IProp) => {
  return (
    <div className="bt-2 sticky inset-0 top-0 z-10 rounded-b-xl pb-4 font-apple transition">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="ml-3 text-3xl font-bold md:ml-0">
              {name || "Home"}
            </div>

            <div className="hidden md:flex">
              <MusicType />
            </div>
          </div>

          <div className="mr-4">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
};
