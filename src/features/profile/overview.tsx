"use client";

import React, { JSX } from "react";
import { IntroItem } from "./components/intro-item";
import Image from "next/image";
import { Building, Call, Location, Sms } from "iconsax-react";
import { TypewriterEffect } from "./components/typewriter-effect";
import dynamic from "next/dynamic";

const RatingButton = dynamic(
  () =>
    import("@/features/profile/components/rating-button").then(
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
        {/* <a href="https://quaric.com/" className="text-cyan-400">
          Quaric
        </a> */}

        <a href="https://quaric.com/" className="text-red-500">
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
  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100 font-medium shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="relative aspect-video overflow-hidden before:absolute before:inset-0 before:bg-[image:url(/img/cover-304.jpeg)] before:bg-cover before:bg-center after:absolute after:bottom-0 after:left-0 after:z-[1] after:h-px after:w-full after:bg-white/20">
        <div className="relative m-2 flex justify-end">
          <div className="p-2">
            <RatingButton />
          </div>
        </div>
      </div>

      {/* <div className="relative left-[5px] z-[1] -mt-12 h-48 px-8 lg:-mt-24 lg:mb-6">
        <Image
          src="/img/avatar.jpeg"
          alt="Avatar"
          width={192}
          height={192}
          className="size-44 rounded-full ring-1 ring-zinc-700 ring-offset-4 ring-offset-zinc-950 md:size-40 lg:size-48"
        />
      </div> */}

      <div className="relative left-[5px] z-[1] -mt-12 h-48 px-8 lg:-mt-24 lg:mb-6">
        <Image
          src="/img/avatar.jpeg"
          alt="Avatar"
          width={192}
          height={192}
          className="size-44 rounded-full ring-2 ring-yellow-600 ring-offset-2 ring-offset-red-500 md:size-40 lg:size-48"
        />
      </div>

      <div className="mb-6 space-x-2 px-8 text-3xl font-bold sm:text-4xl md:text-3xl lg:text-4xl">
        <span className="flex items-center">
          <TypewriterEffect words={NAME} />

          {/* <svg
            className="text-blue-600"
            width="0.6em"
            height="0.6em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.3393 0.582135C12.6142 -0.194045 11.3836 -0.194045 10.6584 0.582135L8.88012 2.48429C8.51756 2.8711 8.00564 3.0843 7.47584 3.06515L4.87538 2.97706C3.81324 2.94132 2.94259 3.81197 2.97834 4.87411L3.06642 7.47712C3.0843 8.00691 2.87238 8.51884 2.48429 8.88139L0.582135 10.6584C-0.194045 11.3836 -0.194045 12.6155 0.582135 13.3406L2.48429 15.1189C2.87238 15.4815 3.0843 15.9921 3.06642 16.5232L2.97706 19.1249C2.94259 20.1871 3.81324 21.0577 4.87538 21.022L7.47712 20.9339C8.00691 20.916 8.51884 21.1279 8.88139 21.5148L10.6584 23.4169C11.3848 24.1944 12.6155 24.1944 13.3419 23.4169L15.1202 21.5148C15.4815 21.1279 15.9934 20.9147 16.5232 20.9339L19.1249 21.022C20.1871 21.0577 21.059 20.1871 21.022 19.1249L20.9352 16.5219C20.916 15.9921 21.1292 15.4815 21.516 15.1189L23.4182 13.3406C24.1944 12.6155 24.1944 11.3836 23.4182 10.6584L21.516 8.88012C21.1292 8.51884 20.916 8.00691 20.9352 7.47584L21.022 4.87411C21.059 3.81197 20.1871 2.94132 19.1249 2.97706L16.5232 3.06642C15.9934 3.08302 15.4815 2.8711 15.1189 2.48429L13.3393 0.582135ZM5.91327 12.5402L10.2908 16.9164L17.5458 8.99374L15.8262 7.4018L10.2091 13.5232L7.56393 10.878L5.91327 12.5402Z"
              fill="currentColor"
            ></path>
          </svg> */}

          <Image
            src="img/flag-for-vietnam.svg"
            alt="flag"
            height={20}
            width={20}
            className="flex size-6 items-center"
          />
        </span>
      </div>

      {/* <div className="flex h-4 w-full bg-[image:repeating-linear-gradient(315deg,_var(--pattern-foreground)_0,_var(--pattern-foreground)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] [--pattern-foreground:#e4e4e7] dark:[--pattern-foreground:#27272a]" /> */}

      <div className="space-y-2 px-8">
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
