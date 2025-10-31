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
    <div>
      <div className="flex text-3xl font-bold">
        <div className="ml-2 px-1 text-2xl text-black dark:text-white md:ml-[270px]">
          Top Pick For You
        </div>
      </div>

      <div
        ref={useRefScroll}
        className="mt-2 flex w-full snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-1.5 text-white scrollbar-hide"
      >
        <div className="snap-start">
          <div
            className="relative ml-4 h-72 w-56 shrink-0 overflow-hidden rounded-3xl md:ml-[270px]"
            onClick={() => handlePlayRandomAudio()}
          >
            <BorderPro roundedSize="rounded-3x">
              <img
                src="/img/image-3.PNG"
                alt=""
                className="h-72 w-56 rounded-3xl object-cover"
              />
            </BorderPro>

            <div className="absolute inset-0 flex h-full flex-col justify-between">
              <div className="p-4">
                <ChanhdangLogotype className="mb-1 w-24 text-white" />

                <div className="text-balance text-4xl font-bold">
                  Heavy Rotation
                </div>
                <div className="text-3xl">Mix</div>
              </div>

              <div className="rounded-b-xl bg-zinc-700/50 px-4 py-2">
                <div className="line-clamp-2 text-center">
                  Ê Kê Vin, Khầy, Jack - J97, Vũ , Son Tung M-TP and more
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="snap-start">
          <div
            className="relative ml-2 h-72 w-56 shrink-0 overflow-hidden rounded-3xl"
            onClick={() => handlePlayRandomAudio()}
          >
            <img src="/img/image-1.PNG" alt="" className="h-72 w-56" />

            <div className="absolute inset-0 flex h-full flex-col justify-between">
              <div className="p-4">
                <ChanhdangLogotype className="mb-1 w-24 text-white" />
                <div className="text-4xl font-bold">New Music</div>
                <div className="text-3xl">Mix</div>
              </div>

              <div className="rounded-b-xl bg-zinc-700/50 px-4 py-2">
                <div className="line-clamp-2 text-center">
                  Ê Kê Vin, Khầy, Jack - J97, Vũ , Son Tung M-TP and more
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="snap-start">
          <div
            className="relative ml-2 h-72 w-56 shrink-0 snap-start overflow-hidden rounded-3xl"
            onClick={() => handlePlayRandomAudio()}
          >
            <img src="/img/image.png" alt="" className="h-full w-full" />
            <div className="absolute inset-0 flex h-full flex-col justify-between">
              <div className="p-4">
                <ChanhdangLogotype className="mb-1 w-24 text-white" />
                <div className="text-4xl font-bold">Get Up!</div>
                <div className="text-3xl">Mix</div>
              </div>
              <div className="rounded-b-xl bg-zinc-700/50 px-4 py-2">
                <div className="line-clamp-2 text-center">
                  Ê Kê Vin, Khầy, Jack - J97, Vũ , Son Tung M-TP and more
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative ml-2 h-72 w-56 shrink-0 snap-start overflow-hidden rounded-3xl"
          onClick={() => handlePlayRandomAudio()}
        >
          <img
            src="/img/image-2.PNG"
            alt=""
            className="h-72 w-56 rounded-3xl"
          />

          <div className="absolute inset-0 flex h-full flex-col justify-between">
            <div className="p-4">
              <ChanhdangLogotype className="mb-1 w-24 text-white" />

              <div className="text-4xl font-bold">Chill</div>
              <div className="text-3xl">Mix</div>
            </div>

            <div className="rounded-b-xl bg-zinc-700/50 px-4 py-2">
              <div className="line-clamp-2 text-center">
                Ê Kê Vin, Khầy, Jack - J97, Vũ , Son Tung M-TP and more
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
