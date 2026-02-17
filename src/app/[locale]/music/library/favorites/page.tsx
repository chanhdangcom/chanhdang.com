"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LibraryTracksList } from "@/features/music/library/library-tracks-list";
import { useUser } from "@/hooks/use-user";
import { MenuBar } from "@/features/music/menu-bar";
import { MenuBarMobile } from "@/features/music/menu-bar-mobile";
import { AudioBar } from "@/features/music/audio-bar";
import { MotionHeaderMusic } from "@/features/music/component/motion-header-music";
import { Play, Shuffle, Star } from "phosphor-react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useAudio } from "@/components/music-provider";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { BackButton } from "@/features/music/component/back-button";

export default function LibraryFavoriteSongsPage() {
  const t = useTranslations("musicDetail.favorites");
  const { user } = useUser();
  const { handlePlayAudio } = useAudio();
  const [tracks, setTracks] = useState<IMusic[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchTracks = async () => {
      try {
        const res = await fetch(`/api/library?userId=${user.id}&type=music`);
        if (!res.ok) return;
        const data = await res.json();
        const normalized: IMusic[] = data
          .map((entry: { resourceData?: IMusic }) => entry.resourceData)
          .filter(Boolean);
        setTracks(normalized);
      } finally {
        // ignore
      }
    };

    void fetchTracks();
  }, [user?.id]);

  const handlePlayFirstAudio = () => {
    if (!tracks.length) return;

    handlePlayAudio(tracks[0]);
  };

  const handleRandomAudio = () => {
    if (!tracks.length) return;

    const randomIndex = Math.floor(Math.random() * tracks.length);
    const randomMusic = tracks[randomIndex];

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

  return (
    <div className="font-apple">
      <MenuBar />

      <MotionHeaderMusic name={t("title")} />

      <div className="pointer-events-none fixed bottom-0 z-50 h-16 w-full bg-gradient-to-t from-white to-transparent dark:from-black" />

      <div>
        <BackButton />

        <div className="flex rounded-3xl">
          <div className="w-full flex-col items-center md:flex-none">
            <div className="relative overflow-hidden">
              <div className="absolute left-0 -z-10 h-full w-full bg-zinc-200 md:bg-zinc-700" />

              <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.35) 100%)",
                }}
              />

              <div className="md:my-36 md:ml-[270px]">
                <motion.div
                  role="img"
                  aria-label="cover"
                  className="mx-auto aspect-square w-full bg-cover bg-center bg-no-repeat shadow-2xl md:size-60 md:rounded-3xl"
                  style={{
                    backgroundImage: `url(/img/favorites-icon.jpg)`,
                    y: isMobile ? smoothParallax : 0,
                    scale: isMobile ? smoothScale : 1,
                  }}
                />
              </div>

              <div className="absolute inset-x-4 bottom-8 space-y-4">
                <motion.div
                  className="stext-center flex items-center justify-center gap-2 text-xl font-semibold text-black md:ml-[270px]"
                  style={{ opacity: smoothOpacity }}
                >
                  <div className="md:text-white">{t("favouriteSongs")}</div>

                  <Star size={15} weight="fill" className="text-zinc-500" />
                </motion.div>

                <motion.div
                  className="flex justify-between gap-4 md:ml-[270px]"
                  style={{ opacity: smoothOpacity }}
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="flex w-full items-center justify-center gap-2 rounded-3xl bg-zinc-400 px-4 py-1 font-semibold text-black"
                    onClick={() => handlePlayFirstAudio()}
                  >
                    <Play size={20} weight="fill" />

                    <div className="text-xl">{t("play")}</div>
                  </motion.div>

                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="flex w-full items-center justify-center gap-2 rounded-3xl bg-zinc-400 px-4 py-2 font-semibold text-black"
                    onClick={() => handleRandomAudio()}
                  >
                    <Shuffle size={20} weight="fill" />

                    <div className="text-xl">{t("mixSong")}</div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-4 items-center md:mx-8 md:ml-[270px] md:flex">
        <LibraryTracksList userId={user?.id} />
      </div>

      <div className="h-32" />

      <div className="">
        <AudioBar />
        <MenuBarMobile />
      </div>
    </div>
  );
}
