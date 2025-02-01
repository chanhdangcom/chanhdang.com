import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { SwitchTheme } from "@/components/switch-theme";
import React from "react";
export const Header = () => {
  return (
    <div className="container">
      <div className="flex h-14 items-center justify-between">
        <ChanhdangLogotype />

        <SwitchTheme />
      </div>
    </div>
  );
};
