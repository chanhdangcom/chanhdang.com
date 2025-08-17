import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { SwitchTheme } from "@/components/switch-theme";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

import React from "react";
import { SwitchLanguage } from "./components/swtich-language";
export const Header = () => {
  return (
    <div>
      <div className="absolute">
        <Progress className="w-[60%]" value={33} />
      </div>

      <div className="flex items-center justify-between">
        <Link href="/">
          <ChanhdangLogotype />

          <div className="font-handwritten text-sm">
            &quot;Debuggin life, deployin dreams&quot;
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <SwitchLanguage />

          <SwitchTheme />
        </div>
      </div>
    </div>
  );
};
