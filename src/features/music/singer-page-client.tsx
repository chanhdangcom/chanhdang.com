"use client";
import { CaretRight, Play } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";

import { AudioSingerItem } from "./component/audio-singer-item";

import { AudioBar } from "./audio-bar";
import {
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  motion,
} from "framer-motion";
import { MenuBar } from "./menu-bar";
import { MenuBarMobile } from "./menu-bar-mobile";
import { MotionHeaderMusic } from "./component/motion-header-music";
import { ISingerItem } from "./type/singer";
import { useAudio } from "@/components/music-provider";
import { BackButton } from "./component/back-button";
import { useImageHoverColor } from "@/hooks/use-image-hover-color";

type IProp = {
  singer: ISingerItem;
};

export function SingerPageClient({ singer }: IProp) {
  const { handlePlayAudio } = useAudio();
  const [isMobile, setIsMobile] = useState(false);

  const handleRandomAudio = () => {
    const musics = singer.musics;
    if (!musics?.length) return;

    const randomIndex = Math.floor(Math.random() * musics.length);
    const randomMusic = musics[randomIndex];

    handlePlayAudio(randomMusic);
  };

  const { scrollY } = useScroll();
  const rawOpacity = useTransform(scrollY, [100, 250], [1, 0]);
  const smoothOpacity = useSpring(rawOpacity, {
    stiffness: 300,
    damping: 20,
  });
  const rawParallax = useTransform(scrollY, [0, 450], [0, -140]);
  const smoothParallax = useSpring(rawParallax, {
    stiffness: 140,
    damping: 18,
  });
  const rawScale = useTransform(scrollY, [0, 450], [1, 1.1]);
  const smoothScale = useSpring(rawScale, {
    stiffness: 140,
    damping: 18,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", update);
      return () => mediaQuery.removeEventListener("change", update);
    }
    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  const hoverBg = useImageHoverColor(singer.cover, { alpha: 0.6 });

  return (
    <>
      <div className="bg-hoverBg font-apple md:flex">
        <MenuBar />

        <MotionHeaderMusic name={singer.singer} />

        <AnimatePresence>
          <motion.div className="mb-8 w-full" layoutId="singer">
            <AudioBar />
            <MenuBarMobile />

            <div>
              <BackButton />

              <div className="flex rounded-3xl">
                <div className="w-full flex-col items-center md:flex-none">
                  <div className="relative overflow-hidden">
                    <div
                      className="absolute left-0 -z-10 h-full w-full"
                      style={{
                        backgroundColor: hoverBg,
                      }}
                    />
                    <div
                      className="pointer-events-none absolute inset-0 -z-10"
                      style={{
                        backgroundImage:
                          "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.35) 100%)",
                      }}
                    />

                    <div className="md:my-32 md:ml-[270px]">
                      <motion.div
                        role="img"
                        aria-label="cover"
                        className="mx-auto aspect-square w-full bg-contain bg-no-repeat shadow-2xl md:size-60 md:rounded-full md:bg-cover md:bg-center"
                        style={{
                          backgroundImage: `url(${singer.cover})`,
                          y: isMobile ? smoothParallax : 0,
                          scale: isMobile ? smoothScale : 1,
                        }}
                      />
                    </div>

                    <motion.div
                      style={{ opacity: smoothOpacity }}
                      className="absolute inset-x-8 bottom-6 flex items-center justify-between bg-fixed text-3xl font-semibold text-white md:ml-[270px] md:justify-start md:gap-4"
                    >
                      <div>{singer.singer}</div>

                      <div
                        className="rounded-full bg-red-500 p-3 dark:md:bg-blue-500"
                        onClick={() => handleRandomAudio()}
                      >
                        <Play size={22} weight="fill" className="text-white" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-4 items-center md:mx-8 md:ml-[270px] md:flex">
              <div className="justify-centers mt-4 w-full max-w-full space-y-4 px-3 md:max-w-full md:justify-center">
                <h2 className="flex items-center gap-1 px-1 text-xl font-bold text-black dark:text-white">
                  <div>Top Songs</div>

                  <CaretRight
                    size={20}
                    weight="bold"
                    className="text-zinc-500 md:mt-1"
                  />
                </h2>

                <AudioSingerItem music={singer} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
