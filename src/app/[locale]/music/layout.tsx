import { ReactNode } from "react";
import { AudioBar } from "@/features/music/audio-bar";
import { MenuBarMobile } from "@/features/music/menu-bar-mobile";
import { FriendsPanel } from "@/features/music/social/friends-panel";

import { ScrollChatBot } from "@/components/scroll-chat-bot";

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
        <FriendsPanel />
        <ScrollChatBot />

        <div className="pointer-events-none fixed bottom-0 z-10 h-24 w-full bg-zinc-950 opacity-70 blur-3xl dark:bg-zinc-600" />
      </div>
    </>
  );
}
