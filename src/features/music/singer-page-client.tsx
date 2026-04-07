"use client";
import { CaretRight, ChartLine, Play } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useMemo, useState } from "react";

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
import { useUser } from "@/hooks/use-user";
import { LibrarySingerButton } from "./library/library-singer-button";

type IProp = {
  singer: ISingerItem;
};

export function SingerPageClient({ singer }: IProp) {
  const { handlePlayAudio } = useAudio();
  const { user } = useUser();
  const [isMobile, setIsMobile] = useState(false);
  const totalPlayCount = useMemo(
    () =>
      singer.musics?.reduce(
        (total, music) => total + (typeof music.playCount === "number" ? music.playCount : 0),
        0
      ) ?? 0,
    [singer.musics]
  );
  const totalPlayCountLabel = `${totalPlayCount.toLocaleString("vi-VN")} lượt nghe`;

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
  const rawParallax = useTransform(scrollY, [0, 450], [0, 100]);
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

              <div className="absolute right-4 top-4 z-50">
                <LibrarySingerButton singer={singer} userId={user?.id} />
              </div>

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
                        className="mx-auto aspect-square w-full bg-cover bg-center bg-no-repeat shadow-2xl md:size-60 md:rounded-full"
                        style={{
                          backgroundImage: `url(${singer.cover})`,
                          y: isMobile ? smoothParallax : 0,
                          scale: isMobile ? smoothScale : 1,
                        }}
                      />
                    </div>

                    <motion.div
                      style={{ opacity: smoothOpacity }}
                      className="absolute bottom-4 right-4 z-50 hidden items-center gap-2 md:flex"
                    >
                      <ChartLine
                        size={22}
                        weight="bold"
                        className="mb-0.5 text-white/40"
                      />

                      <div className="text-sm text-white/40">
                        {totalPlayCountLabel}
                      </div>
                    </motion.div>

                    <motion.div
                      style={{ opacity: smoothOpacity }}
                      className="absolute inset-x-8 bottom-6 flex items-center justify-between bg-fixed text-3xl font-semibold text-white md:ml-[270px] md:justify-start md:gap-4"
                    >
                      <motion.div
                        className="hidden rounded-full bg-rose-500 p-3 md:flex"
                        onClick={() => handleRandomAudio()}
                        whileTap={{ scale: 0.5 }}
                      >
                        <Play size={22} weight="fill" className="text-white" />
                      </motion.div>

                      <div className="">{singer.singer}</div>

                      <div className="flex items-center gap-2">
                        <div
                          className="rounded-full bg-rose-500 p-3 md:hidden"
                          onClick={() => handleRandomAudio()}
                        >
                          <Play
                            size={22}
                            weight="fill"
                            className="text-white"
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-4 items-center md:mx-8 md:ml-[270px] md:flex">
              <div className="justify-centers mt-4 w-full max-w-full space-y-4 px-3 md:max-w-full md:justify-center">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-1 px-1 text-xl font-bold text-black dark:text-white">
                    <div>Top Songs</div>

                    <CaretRight
                      size={20}
                      weight="bold"
                      className="text-zinc-500 md:mt-1"
                    />
                  </h2>

                  <div className="z-50 flex items-center gap-2 md:hidden">
                    <ChartLine
                      size={20}
                      weight="bold"
                      className="mb-0.5 text-zinc-500"
                    />

                    <div className="text-xs text-zinc-500">
                      {totalPlayCountLabel}
                    </div>
                  </div>
                </div>

                <AudioSingerItem music={singer} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
