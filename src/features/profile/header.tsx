import { SwitchTheme } from "@/components/switch-theme";
import React from "react";
export const Header = () => {
  return (
    <div className="container">
      <div className="flex h-14 items-center justify-between">
        <div className="text-xl font-bold">Nguyễn Chánh Đang</div>

        <SwitchTheme />
      </div>
    </div>
  );
};
