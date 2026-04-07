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

        <div className="pointer-events-none fixed bottom-0 z-10 h-24 w-full bg-zinc-950 opacity-70 blur-3xl dark:bg-zinc-600" />
      </div>
    </>
  );
}
