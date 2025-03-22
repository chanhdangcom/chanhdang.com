"use client";
import { useAudio } from "@/components/music-provider";
import {
  CaretDown,
  DotsThreeVertical,
  FastForward,
  Pause,
  Play,
  Repeat,
  Rewind,
  Shuffle,
} from "@phosphor-icons/react/dist/ssr";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { AudioTimeLine } from "./component/audio-time-line";
import DynamicIslandWave from "@/components/ui/dynamic-island";
import { FastAverageColor } from "fast-average-color";
import Markdown from "react-markdown";

type IProp = {
  setIsClick: () => void;
};

export function PlayerPage({ setIsClick }: IProp) {
  const {
    currentMusic,
    isPlaying,
    isPaused,

    handlePlayRandomAudio,
    handlePauseAudio,
    handleResumeAudio,
    handleAudioSkip,
    handAudioForward,
  } = useAudio();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [waveColor, setWaveColor] = useState("");

  useEffect(() => {
    if (!currentMusic?.cover) {
      setWaveColor("rgba(250, 250, 250, 0.6)"); // Màu trắng mờ
      return;
    }

    const fac = new FastAverageColor();
    fac
      .getColorAsync(currentMusic?.cover)
      .then((color) => {
        const rgbaColor = `rgba(${color.value[0]}, ${color.value[1]}, ${color.value[2]}, 0.8)`;
        setWaveColor(rgbaColor);
      })
      .catch(() => setWaveColor("rgba(250, 250, 250, 0.6)"));
  }, [currentMusic?.cover]);

  const lyrics = `Mát lành như dòng suối\n
Tâm hồn mới chớm đôi mươi vô tư nơi rừng núi\n
Chưa từng ghé chốn xa xôi vào một ngày nắng xanh\n

Lảng tránh nhân duyên sắp đặt\n
Để rồi mình đi về phía chân đồi\n
Phía bên kia đồi có bầu trời mênh mông\n

Không ai biết trước chuyện chi\n
Có phải như mình ngóng trông\n
Lắng nghe tim này vững niềm tin ta mang\n
Tuổi trẻ này thênh thang có ngại chi ta sẵn sàng\n

Và ta đi đi vượt hết núi đồi\n
Giai điệu của mây trời đưa về nơi ngập tràn ánh nắng\n
Và ta đi đi vượt hết núi đồi\n
Phiêu lưu với cuộc đời mang hành trang kiêu hãnh ngút ngàn\n

Còn chần chừ chi\n
Hãy sống hết mình sống trọn phút giây chân tình\n
Thanh xuân đang chờ bình minh\n
Cuộc đời thật đẹp như mơ\n

Và sống hết mình\n
Dẫu trái tim còn đầy bỡ ngỡ\n
Thênh thang bước đi giữa trời rực rỡ\n

Phía bên kia đồi có dòng người xoay xoay\n
Gian nan khó khăn về tay đôi lần cam go lắm thay\n

Lắng nghe tim này vững niềm tin ta mang\n
Tuổi trẻ mình thênh thang có ngại chi ta sẵn sàng\n

Và ta đi đi vượt hết núi đồi\n
Giai điệu của mây trời đưa về nơi ngập tràn ánh nắng\n
Và ta đi đi vượt hết núi đồi\n
Phiêu lưu với cuộc đời mang hành trang kiêu hãnh ngút ngàn\n

Còn chần chừ chi\n
Hãy sống hết mình sống trọn phút giây chân tình\n
Thanh xuân đang chờ bình minh\n
Cuộc đời thật đẹp như mơ\n

Và sống hết mình\n
Dẫu trái tim còn đầy bỡ ngỡ\n
Thênh thang bước đi giữa trời rực rỡ\n

Như một vì tinh tú\n
Em lấp lánh trên bầu trời rộng lớn\n
Em chưa bao giờ quên đi mất rằng mình là ai\n
Vô tư và kiêu hãnh em biết hiện tại này mình đang sống\n
Hoạ một bức tranh cuộc đời em mong\n

Sống hết mình\n
Sống trọn phút giây chân tình\n
Thanh xuân đang chờ bình minh\n
Cuộc đời thật đẹp như mơ\n

Và sống hết mình\n
Dẫu trái tim còn đầy bỡ ngỡ\n
Thênh thang bước đi giữa trời rực rỡ\n

Sống hết mình\n
Sống trọn bước ta đi\n
Thanh xuân đang chờ bình minh\n
Cuộc đời thật đẹp như mơ\n

Và sống hết mình\n
Dẫu trái tim còn đầy bỡ ngỡ\n
Thênh thang bước đi giữa trời rực rỡ\n
Thênh thang bước đi giữa trời rực rỡ\n
Thênh thang bước đi giữa trời rực rỡ\n`;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        layoutId="audio-bar"
        className="fixed inset-0 z-50 space-y-4 rounded-3xl px-4 md:inset-x-96 md:inset-y-20"
        style={{
          background: `linear-gradient(to bottom,  
          ${waveColor}, 
          rgba(24, 24, 27, 0.7),  
          rgba(24, 24, 27, 0.7),  
          #18181b)`,
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
        }}
      >
        <header className="flex items-center justify-between p-1">
          <CaretDown
            size={20}
            className="cursor-pointer text-zinc-50"
            onClick={() => setIsClick()}
          />

          <div className="flex rounded-full p-1 font-semibold">
            <div className="rounded-full bg-zinc-800 px-3 py-1">Music</div>
            <div className="px-3 py-1">Video</div>
          </div>

          <DotsThreeVertical size={20} weight="bold" />
        </header>

        <div className="mx-3 space-y-4">
          {currentMusic?.cover ? (
            <motion.div
              layoutId="Cover"
              key={currentMusic?.cover}
              className="flex justify-between gap-4"
            >
              <Image
                src={currentMusic?.cover}
                alt="Cover"
                width={500}
                height={500}
                className="flex h-[45vh] w-full shrink-0 justify-center rounded-2xl object-cover md:w-[40vh]"
              />
              <div className="hidden h-[45vh] overflow-y-auto md:block">
                <div className="text-xl font-bold">LYRIC</div>
                <div className="text-sm">
                  <Markdown>{lyrics}</Markdown>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex h-[45vh] w-full shrink-0 justify-center rounded-2xl bg-zinc-700"></div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <div className="line-clamp-1 text-xl font-semibold">
                {currentMusic?.title || "TITLE SONG"}
              </div>

              <div className="text-lg text-zinc-500">
                {currentMusic?.singer || "SINGER"}
              </div>
            </div>

            <DynamicIslandWave
              isPlay={isPlaying}
              coverUrl={currentMusic?.cover}
            />
          </div>

          <div className="flex items-center justify-center">
            <AudioTimeLine />
          </div>

          <div className="flex items-center justify-between">
            <motion.div whileTap={{ scale: 0.5 }}>
              <Shuffle
                onClick={() => handlePlayRandomAudio()}
                size={25}
                className="cursor-pointer text-zinc-50"
              />
            </motion.div>

            <div className="flex gap-8">
              <motion.button
                onClick={handAudioForward}
                whileTap={{ scale: 0.5 }}
                className="flex cursor-pointer items-center justify-center text-zinc-50"
              >
                <Rewind size={30} weight="fill" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.5 }}
                onClick={
                  isPlaying
                    ? handlePauseAudio
                    : isPaused
                      ? handleResumeAudio
                      : handlePlayRandomAudio
                }
                className="flex cursor-pointer items-center justify-center text-zinc-50"
              >
                {isPlaying ? (
                  <Pause size={36} weight="fill" />
                ) : (
                  <Play size={36} weight="fill" />
                )}
              </motion.button>

              <motion.button
                onClick={handleAudioSkip}
                whileTap={{ scale: 0.5 }}
                className="flex cursor-pointer items-center justify-center text-zinc-50"
              >
                <FastForward size={32} weight="fill" />
              </motion.button>
            </div>

            <Repeat size={25} className="text-zinc-50" />
          </div>

          <div className="flex justify-between px-4 text-base text-zinc-500">
            <div>UP NEXT</div>
            <Drawer>
              <DrawerTrigger className="">LYRIC</DrawerTrigger>

              <DrawerContent className="h-[80vh] border border-zinc-800 bg-zinc-950 shadow-sm">
                <DrawerHeader className="border-b border-zinc-900 shadow-sm">
                  <div className="absolute inset-0 top-4 mx-auto h-1.5 w-32 rounded-full bg-zinc-800"></div>
                  <DrawerTitle className="mx-auto font-mono text-xl"></DrawerTitle>
                  <DrawerDescription className="mx-auto font-mono"></DrawerDescription>
                </DrawerHeader>

                <div className="h-full overflow-x-auto p-4">
                  <div className="text-xl font-bold">Lyric:</div>
                  <Markdown>{lyrics}</Markdown>
                </div>
              </DrawerContent>
            </Drawer>
            <div>RELATED</div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
