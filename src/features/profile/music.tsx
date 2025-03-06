"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "./hook/use-outside-click";
import { ExperienceInfoItem } from "./components/experience-info-item";
import { MusicIcon, PauseIcon } from "lucide-react";
import { Button } from "@/components/button-new";
import { useAudio } from "@/components/music-provider";

export function Music() {
  const { handlePlayAudio, handlePauseAudio } = useAudio();
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <div className="space-y-8">
        <div className="my-2 flex items-center space-x-2 font-mono text-sm">
          <ExperienceInfoItem icon={<MusicIcon />} content="Music Gallery" />
        </div>
      </div>

      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-zinc/50 fixed inset-0 z-10 h-full w-full"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 z-[1001] m-4 grid place-items-center rounded-xl">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 lg:hidden"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="flex h-full w-full max-w-[500px] flex-col overflow-hidden rounded-xl border bg-zinc-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:rounded-3xl md:h-fit md:max-h-[90%]"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <Image
                  priority
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="h-96 w-full rounded-xl object-cover object-top p-1 md:rounded-3xl lg:h-80"
                />
              </motion.div>

              <div>
                <div className="flex items-start justify-between p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="text-2xl font-bold text-zinc-700 dark:text-zinc-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-zinc-600 dark:text-zinc-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    onClick={() => handlePlayAudio(active.ctaLink)}
                    layoutId={`button-${active.title}-${id}`}
                    target="_blank"
                    className="cursor-pointer rounded-full bg-green-500 px-4 py-3 text-sm font-bold text-zinc-50 hover:bg-green-700"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <Button onClick={handlePauseAudio}>
                  <PauseIcon />
                  Pause
                </Button>
                <div className="relative px-4 pt-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-72 flex-col items-start gap-4 overflow-auto pb-10 text-xs text-zinc-600 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] dark:text-zinc-400 md:h-fit md:text-sm lg:text-base"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="mx-auto w-full max-w-2xl gap-4">
        {cards.map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="flex cursor-pointer flex-col items-center justify-between rounded-xl p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 md:flex-row"
          >
            <div className="flex flex-col gap-4 md:flex-row">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <Image
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="size-72 rounded-xl border object-cover object-top shadow-sm dark:border-zinc-800 md:h-14 md:w-14"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="text-center font-medium text-zinc-800 dark:text-zinc-200 md:text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-center text-zinc-600 dark:text-zinc-400 md:text-left"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="mt-4 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-black hover:bg-green-500 hover:text-white md:mt-0"
            >
              {card.ctaText}
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "Sơn tèo",
    title: "Ngày mai người ta lấy chồng",
    src: "/img/music-cover/music-1.jpg",
    ctaText: "Play",
    ctaLink: "/audio/NgayMaiNguoiTaLayChong.mp3",
    content: () => {
      return (
        <p className="container flex-wrap text-lg">
          “Ngày Mai Người Ta Lấy Chồng” là một ca khúc được nhiều người yêu
          thích, đặc biệt trong dòng nhạc balland. Bài hát mang giai điệu da
          diết, sâu lắng, kể về nỗi buồn và tiếc nuối của một chàng trai khi
          người con gái mình yêu chuẩn bị lên xe hoa với người khác. Lời bài hát
          thể hiện tâm trạng đau khổ, nhưng cũng có chút cam chịu khi tình yêu
          không trọn vẹn. Nhân vật trong bài không thể làm gì ngoài việc đứng
          nhìn người mình thương đi lấy chồng, mang theo bao kỷ niệm đẹp của cả
          hai. Ca khúc này được rất nhiều ca sĩ thể hiện, mỗi phiên bản lại mang
          một sắc thái khác nhau, nhưng điểm chung vẫn là sự luyến tiếc và đau
          xót của một cuộc tình dang dở.
        </p>
      );
    },
  },
  {
    description: "Quốc Thiên",
    title: "Chia cách bình yên",
    src: "/img/music-cover/music-2.jpg",
    ctaText: "Play",
    ctaLink: "/audio/ChiaCachBinhYen.mp3",
    content: () => {
      return (
        <p className="container flex-wrap text-lg">
          “Chia Cách Bình Yên” là một ca khúc giàu cảm xúc, mang giai điệu nhẹ
          nhàng nhưng đầy day dứt về một cuộc chia ly. Bài hát kể về hai người
          yêu nhau nhưng buộc phải rời xa nhau, không phải vì hết yêu, mà vì
          những lý do ngoài tầm kiểm soát. Lời bài hát mang đến cảm giác tiếc
          nuối nhưng không quá bi lụy. Thay vì đau khổ dằn vặt, nó gợi lên sự
          chấp nhận trong lặng lẽ, một sự “chia cách bình yên” đúng như tên gọi.
          Những kỷ niệm đẹp vẫn còn đó, nhưng cả hai chọn cách rời xa nhau trong
          sự bình thản, dù trong lòng vẫn còn yêu. Với giai điệu nhẹ nhàng, sâu
          lắng cùng ca từ ý nghĩa, bài hát đã chạm đến trái tim của nhiều người
          từng trải qua một cuộc chia ly không mong muốn.
        </p>
      );
    },
  },
];
