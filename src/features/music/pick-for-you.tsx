/* eslint-disable @next/next/no-img-element */
"use client";
import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { useAudio } from "@/components/music-provider";
import { useRef } from "react";
import { BorderPro } from "./component/border-pro";

export function PickForYou() {
  const { handlePlayRandomAudio } = useAudio();

  const useRefScroll = useRef<HTMLDivElement>(null);
  return (
    <>
      <div className="flex text-xl font-bold">
        <div className="px-3 text-black dark:text-white md:ml-[270px] md:px-0">
          Top Pick For You
        </div>
      </div>

      <div
        ref={useRefScroll}
        className="mt-2 flex w-full snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth text-white scrollbar-hide"
      >
        <div className="snap-start">
          <div className="mx-4 mb-1 font-apple text-sm font-medium text-zinc-500 md:ml-[270px]">
            Make for you
          </div>

          <div
            className="relative ml-3 h-80 w-60 shrink-0 overflow-hidden rounded-2xl md:ml-[270px]"
            onClick={() => handlePlayRandomAudio()}
          >
            <BorderPro roundedSize="rounded-2xl">
              <img
                src="https://images.squarespace-cdn.com/content/v1/59124bd8197aeaf88cc3c03d/1653669849405-D703IX313VK0GIHTC9VH/Music_JP-New-Life-6-16x9-Cinemagraph-Clouds-Social_03_rev0_Video_JP-JP_TBD_AMXD0118174H_MOS.gif"
                alt=""
                className="h-80 w-60 shrink-0 object-cover"
              />
            </BorderPro>

            <div className="absolute inset-0 flex h-full flex-col justify-between">
              <div className="px-4 pb-4">
                <ChanhdangLogotype className="w-24 text-white" />
                <div className="text-4xl font-bold">New Music</div>
                <div className="text-3xl">Mix</div>
              </div>

              <div className="rounded-b-xl px-4 py-2 backdrop-blur-sm">
                <div className="line-clamp-2 text-center">
                  Ê Kê Vin, Khầy, Jack - J97, Son Tung M-TP and more
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="snap-start">
          <div className="mx-4 mb-1 font-apple text-sm font-medium text-zinc-500">
            Make for you
          </div>

          <div
            className="relative h-80 w-60 shrink-0 overflow-hidden rounded-2xl"
            onClick={() => handlePlayRandomAudio()}
          >
            <BorderPro roundedSize="rounded-xl">
              <img
                src="https://images.squarespace-cdn.com/content/v1/59124bd8197aeaf88cc3c03d/1653668270064-UU9B0HGZ4398GMDYI902/AppleMusic_JP-Summer_15_rev0_Video_JP-JP_24JULY2019_AMXD0124133H_YouTube-WM_1.gif?format=750w-3.PNG"
                alt=""
                className="h-80 w-60 shrink-0 rounded-xl object-cover"
              />
            </BorderPro>

            <div className="absolute inset-0 flex h-full flex-col justify-between">
              <div className="p-4">
                <ChanhdangLogotype className="mb-1 w-24 text-white" />

                <div className="text-balance text-4xl font-bold">
                  Heavy Rotation
                </div>
                <div className="text-xl">Mix</div>
              </div>

              <div className="rounded-b-xl px-4 py-2 backdrop-blur-sm">
                <div className="line-clamp-2 text-center">
                  Ê Kê Vin, Khầy, Jack - J97, Son Tung M-TP and more
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="snap-start">
          <div className="mx-4 mb-1 font-apple text-sm font-medium text-zinc-500">
            Make for you
          </div>

          <div
            className="relative h-80 w-60 shrink-0 snap-start overflow-hidden rounded-2xl"
            onClick={() => handlePlayRandomAudio()}
          >
            <img
              src="https://images.squarespace-cdn.com/content/v1/59124bd8197aeaf88cc3c03d/1653668385276-EQS3NB8CPBGT59HC4O2U/am_NewLife_1920x1080_0418_JGV7_WEBMIX_v001.gif?format=750w"
              alt=""
              className="h-full w-full shrink-0 object-cover"
            />
            <div className="absolute inset-0 flex h-full flex-col justify-between">
              <div className="p-4">
                <ChanhdangLogotype className="mb-1 w-24 text-white" />
                <div className="text-4xl font-bold">Get Up!</div>
                <div className="text-xl">Mix</div>
              </div>
              <div className="rounded-b-xl px-4 py-2 backdrop-blur-sm">
                <div className="line-clamp-2 text-center">
                  Ê Kê Vin, Khầy, Jack - J97, Son Tung M-TP and more
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mx-4 mb-1 font-apple text-sm font-medium text-zinc-500">
            Make for you
          </div>

          <div
            className="relative h-80 w-60 shrink-0 snap-start overflow-hidden rounded-2xl bg-red-600"
            onClick={() => handlePlayRandomAudio()}
          >
            <img
              src="https://images.squarespace-cdn.com/content/v1/59124bd8197aeaf88cc3c03d/1653668275696-Z3YWVUO29XROHX94ASTD/AppleMusic_JP-Summer_15_rev0_Video_JP-JP_24JULY2019_AMXD0124133H_YouTube-WM.gif?format=750w"
              alt=""
              className="h-80 w-60 shrink-0 rounded-3xl object-cover"
            />

            <div className="absolute inset-0 flex h-full flex-col justify-between">
              <div className="p-4">
                <ChanhdangLogotype className="mb-1 w-24 text-white" />

                <div className="text-4xl font-bold">Chill</div>
                <div className="text-3xl">Mix</div>
              </div>

              <div className="rounded-b-xl px-4 py-2 backdrop-blur-sm">
                <div className="line-clamp-2 text-center">
                  Ê Kê Vin, Khầy, Jack - J97, Son Tung M-TP and more
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
