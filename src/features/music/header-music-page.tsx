import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { SwitchTheme } from "@/components/switch-theme";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

import React from "react";
import { Search } from "./component/search";
export const HeaderMusicPage = () => {
  return (
    <div className="container">
      <Progress className="w-[60%]" value={33} />
      <div className="flex h-14 items-center justify-between">
        <Link href="/">
          <ChanhdangLogotype />
          <div className="font-handwritten text-sm">
            &quot;Feel the Rhythm, Live the Music!&quot;
          </div>
        </Link>

        <Search />

        <SwitchTheme />
      </div>
    </div>
  );
};
