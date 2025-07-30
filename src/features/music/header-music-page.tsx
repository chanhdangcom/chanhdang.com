"use client";

import { MusicType } from "./music-type";

import { LogoutButton } from "./component/logout-button";

export const HeaderMusicPage = () => {
  return (
    <div className="sticky inset-0 top-0 z-50 rounded-b-xl py-2 font-apple transition">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="ml-3 text-4xl font-bold md:ml-0"> Home</div>

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
