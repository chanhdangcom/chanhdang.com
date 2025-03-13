import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { SwitchTheme } from "@/components/switch-theme";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

import React from "react";
export const HeaderMusicPage = () => {
  return (
    <div className="container">
      <Progress className="w-[60%]" value={33} />
      <div className="flex h-14 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <ChanhdangLogotype />
          </Link>
          <div className="font-handwritten text-xl">
            “Feel the Rhythm, Live the Music!”
          </div>
        </div>

        <SwitchTheme />
      </div>
    </div>
  );
};
