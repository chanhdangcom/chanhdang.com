import { ReactNode } from "react";
import { AudioBar } from "@/features/music/audio-bar";
import { MenuBarMobile } from "@/features/music/menu-bar-mobile";

type Props = {
  children: ReactNode;
};

export default function MusicLayout({ children }: Props) {
  return (
    <>
      {/* <DisableRightClick /> */}

      {children}

      <div className="my-40">
        <AudioBar />
        <MenuBarMobile />
      </div>
    </>
  );
}
