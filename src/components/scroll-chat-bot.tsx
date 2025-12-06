"use client";
import { ChatBox } from "@/app/[locale]/features/profile/components/chat-box";
import Image from "next/image";

export const ScrollChatBot = () => {
  return (
    <header className="rou fixed bottom-6 right-6 z-[50] flex size-10 justify-end rounded-full border border-zinc-300 bg-zinc-100 p-2 shadow-xl">
      <ChatBox
        content={
          <Image
            src={"/img/gemini-icon.webp"}
            alt="Gemini"
            width={32}
            height={32}
          />
        }
      />

      <div className="absolute -top-1 right-6 w-16 rounded-xl bg-zinc-300 p-0.5 text-center font-apple text-xs font-semibold text-zinc-950">
        AI Chat
      </div>
    </header>
  );
};
