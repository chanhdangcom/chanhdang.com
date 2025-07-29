"use client";

import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { MusicType } from "./music-type";

import Link from "next/link";

import { LogoutButton } from "./component/logout-button";

export const HeaderMusicPage = () => {
  return (
    <div className="sticky inset-0 top-0 z-50 rounded-b-xl py-4 font-apple transition">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-end gap-1">
              <Link href={"/music"} className="flex cursor-pointer">
                <ChanhdangLogotype className="w-40" />

                <div className="mt-4 flex text-sm font-semibold">Music</div>
              </Link>
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
