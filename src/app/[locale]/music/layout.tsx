import { ReactNode } from "react";
import { AudioBar } from "@/features/music/audio-bar";
import { LyricSidebar } from "@/features/music/lyric-sidebar";
import { MenuBarMobile } from "@/features/music/menu-bar-mobile";

// import { DisableRightClick } from "@/features/music/disable-right-click";

type Props = {
  children: ReactNode;
};

export default function MusicLayout({ children }: Props) {
  return (
    <>
      {/* <DisableRightClick /> */}

      {children}

      <LyricSidebar />
      <div className="my-40">
        <AudioBar />
        <MenuBarMobile />
      </div>
    </>
  );
}
