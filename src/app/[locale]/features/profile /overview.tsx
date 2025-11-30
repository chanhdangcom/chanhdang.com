"use client";

import React, { JSX, useRef } from "react";
import { IntroItem } from "./components/intro-item";
import Image from "next/image";
import { Building, Call, Location, Sms } from "iconsax-react";
import { TypewriterEffect } from "./components/typewriter-effect";
import dynamic from "next/dynamic";
import { SpeakerHigh } from "@phosphor-icons/react/dist/ssr";

const RatingButton = dynamic(
  () =>
    import("@/app/[locale]/features/profile /components/rating-button").then(
      (res) => res.RatingButton
    ),
  {
    ssr: false, // Server-side Render (SSR), Client-side Render (CSR)
  }
);

type IIntroItem = {
  icon: JSX.Element;
  content: React.ReactNode;
  extra?: React.ReactNode;
};

const NAME = [
  { text: "Nguyễn", className: "text-mono md:text-2xl lg:text-3xl" },
  { text: "Chánh", className: "text-mono md:text-2xl lg:text-3xl" },
  { text: "Đang", className: "text-mono md:text-2xl lg:text-3xl" },
];

const INTRO: IIntroItem[] = [
  {
    icon: <Building variant="Bulk" size={24} color="currentColor" />,
    content: (
      <>
        <span>Developer at</span>
        <a href="https://quaric.com/" className="text-cyan-400">
          Quaric
        </a>
      </>
    ),
  },
  {
    icon: <Sms variant="Bulk" size={24} color="currentColor" />,
    content: (
      <a href="mailto:ncdang@quaric.com" className="hover:underline">
        ncdang@quaric.com
      </a>
    ),
  },
  {
    icon: <Location variant="Bulk" size={24} color="currentColor" />,
    content: "Can Tho, Viet Nam",
  },
  {
    icon: <Call variant="Bulk" size={24} color="currentColor" />,
    content: (
      <a href="tel:0799979382" className="hover:underline">
        079 997 9382
      </a>
    ),
  },
];

export const Overview = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const HandelPlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="relative overflow-hidden border-zinc-200 font-medium shadow-sm dark:border-zinc-900 dark:text-zinc-50 md:border-x">
      <div className="relative aspect-3/1 overflow-hidden before:absolute before:inset-0 before:bg-[image:url(/img/cover.jpg)] before:bg-cover before:bg-center after:absolute after:bottom-0 after:left-0 after:z-[1] after:h-px after:w-full after:bg-white/20">
        <div className="relative m-2 flex justify-end">
          <div className="p-2">
            <RatingButton />
          </div>
        </div>
      </div>

      <div className="relative left-[5px] z-[1] -mt-12 h-48 px-8 lg:-mt-24 lg:mb-6">
        <Image
          src="/img/avatar.jpeg"
          alt="Avatar"
          width={192}
          height={192}
          className="size-44 rounded-full ring-1 ring-zinc-700 ring-offset-4 ring-offset-zinc-950 md:size-40 lg:size-48"
        />
      </div>

      <div className="mb-6 space-x-2 border-zinc-200 pl-8 text-3xl dark:border-zinc-900 sm:text-4xl md:text-3xl lg:text-4xl">
        <span className="flex items-center">
          <TypewriterEffect words={NAME} className="font-bold" />

          <div className="flex items-center gap-1">
            <Image
              src={"/img/Verified-icon.png"}
              alt="icon"
              width={300}
              height={300}
              className="size-8"
            />

            <audio ref={audioRef}>
              <source src="https://cdn.chanhdang.com/ChanhDang-voice.mp3" />
            </audio>

            <SpeakerHigh
              size={18}
              weight="regular"
              className="cursor-pointer text-zinc-500"
              onClick={() => HandelPlayAudio()}
            />
          </div>
        </span>
      </div>

      {/* <div className="flex h-4 w-full bg-[image:repeating-linear-gradient(315deg,_var(--pattern-foreground)_0,_var(--pattern-foreground)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] [--pattern-foreground:#e4e4e7] dark:[--pattern-foreground:#27272a]" /> */}

      <div className="space-y-2 border-zinc-200 px-8 dark:border-zinc-900">
        {/* <div className="absolute left-9 top-[402px] hidden w-full font-mono text-xs text-zinc-400 dark:text-zinc-700 md:block">
          text-lg font-mono text-zinc-500
        </div> */}

        {INTRO.map((item, index) => {
          return (
            <IntroItem
              key={index}
              icon={item.icon}
              content={item.content}
              extra={item.extra}
            />
          );
        })}
      </div>
      {/* <div className="flex h-4 w-full bg-[image:repeating-linear-gradient(315deg,_var(--pattern-foreground)_0,_var(--pattern-foreground)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] [--pattern-foreground:#e4e4e7] dark:[--pattern-foreground:#27272a]" /> */}
      <div className="flex h-6 w-full" />
    </div>
  );
};
