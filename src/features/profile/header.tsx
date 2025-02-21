import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { SwitchTheme } from "@/components/switch-theme";
import { Progress } from "@/components/ui/progress";
import React from "react";
export const Header = () => {
  return (
    <div className="container">
      <Progress className="w-[60%]" value={33} />
      <div className="flex h-14 items-center justify-between">
        <ChanhdangLogotype />

        <SwitchTheme />
      </div>
    </div>
  );
};
