"use client";
import { useEffect, useMemo, useState } from "react";
import { useAudio } from "@/components/music-provider";
import { MenuBar } from "../menu-bar";
import { MenuBarMobile } from "../menu-bar-mobile";
import { AudioBar } from "../audio-bar";
import { IPlaylistItem } from "../type/playlist";
import { AudioItemOrder } from "../component/audio-item-order";
import {
  DotsThree,
  DotsThreeVertical,
  Play,
  Shuffle,
} from "@phosphor-icons/react/dist/ssr";
import { MotionHeaderMusic } from "../component/motion-header-music";
import { LibraryPlaylistButton } from "../library/library-playlist-button";
import { useUser } from "@/hooks/use-user";
import { BackButton } from "../component/back-button";
import { useScroll, useSpring, useTransform, motion } from "framer-motion";
import { useImageHoverColor } from "@/hooks/use-image-hover-color";

type Props = {
  playlist: IPlaylistItem;
};

export function PlaylistDetailClient({ playlist }: Props) {
  const { handlePlayAudio, handlePlayRandomAudio } = useAudio();
  const { user } = useUser();
  const [isMobile, setIsMobile] = useState(false);
  const hoverColor = useImageHoverColor(playlist.cover, { alpha: 0.6 });

  const musics = useMemo(
    () => playlist.musics?.filter((m) => m && m.id) ?? [],
    [playlist.musics]
  );

  // Validate cover URL to prevent "Failed to construct 'URL': Invalid URL" error

  const handlePlayFirstAudio = () => {
    if (!musics.length) return;
    handlePlayAudio(musics[0]);
  };

  const handleRandomAudio = () => {
    if (musics.length === 0) return;
    const random = musics[Math.floor(Math.random() * musics.length)];
    if (random) {
      handlePlayAudio(random);
    } else {
      void handlePlayRandomAudio();
    }
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
    <div className="">
      <MotionHeaderMusic name={playlist.title} />

      <div className="font-apple md:flex">
        <MenuBar />

        <div className="w-full">
          <AudioBar />

          <MenuBarMobile />

          <BackButton />

          <>
            <div className="fixed right-3 top-2 z-10 flex items-center justify-end gap-6 rounded-full border border-white/10 bg-zinc-300/60 p-2 backdrop-blur-xl dark:bg-zinc-900/60">
              <div>
                <LibraryPlaylistButton playlist={playlist} userId={user?.id} />
              </div>

              <div>
                <DotsThree size={25} weight="bold" className="text-white" />
              </div>
            </div>
          </>

          <div className="flex rounded-3xl">
            <div className="w-full flex-col items-center md:flex-none">
              <div className="relative overflow-hidden">
                <div
                  className="pointer-events-none absolute inset-0 -z-10"
                  style={{
                    backgroundColor: hoverColor,
                  }}
                />

                <div className="md:my-36 md:ml-[270px]">
                  <motion.div
                    role="img"
                    aria-label="cover"
                    className="mx-auto aspect-square w-full bg-cover bg-center bg-no-repeat shadow-2xl md:size-60 md:rounded-3xl"
                    style={{
                      backgroundImage: `url(${playlist.cover})`,
                      y: isMobile ? smoothParallax : 0,
                      scale: isMobile ? smoothScale : 1,
                    }}
                  />
                </div>

                <div className="absolute inset-x-4 bottom-8 space-y-4">
                  <motion.div
                    className="stext-center gap-2 font-semibold text-black md:ml-[270px]"
                    style={{ opacity: smoothOpacity }}
                  >
                    <div className="text-4xl text-white">
                      {playlist.title || "Playlist"}
                    </div>

                    <div className="text-white">
                      {playlist.singer || "ChanhDang Music"}
                    </div>
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

                      <div className="text-xl">Play</div>
                    </motion.div>

                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      className="flex w-full items-center justify-center gap-2 rounded-3xl bg-zinc-400 px-4 py-2 font-semibold text-black"
                      onClick={() => handleRandomAudio()}
                    >
                      <Shuffle size={20} weight="fill" />

                      <div className="text-xl">Mix song</div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          <>
            <div className="pointer-events-auto mx-4 mt-8 flex-1 space-y-2 md:ml-[270px]">
              {musics.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
                  Playlist chưa có bài hát nào.
                </div>
              ) : (
                musics.map((music, index) => (
                  <div
                    key={music.id}
                    className="flex items-center gap-4 rounded-2xl bg-transparent p-1"
                  >
                    <div className="font-apple font-medium text-zinc-500">
                      {index + 1}
                    </div>

                    <AudioItemOrder
                      music={music}
                      handlePlay={() => handlePlayAudio(music)}
                      border
                      date={
                        music.createdAt
                          ? new Date(music.createdAt as Date).toISOString()
                          : undefined
                      }
                      item={<DotsThreeVertical size={20} weight="bold" />}
                    />
                  </div>
                ))
              )}
            </div>
          </>

          <div className="h-52" />
        </div>
      </div>
    </div>
  );
}
