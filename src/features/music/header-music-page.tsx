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
        <Link href="/">
          <ChanhdangLogotype />
          <div className="font-handwritten text-sm">
            &quot;Feel the Rhythm, Live the Music!s&quot;
          </div>
        </Link>

        <SwitchTheme />
      </div>
    </div>
  );
};
