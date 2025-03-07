"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "./hook/use-outside-click";
import { ExperienceInfoItem } from "./components/experience-info-item";
import { useAudio } from "@/components/music-provider";
import { MusicIcon } from "lucide-react";

export function MusicList() {
  const { handlePlayAudio } = useAudio();
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
            className="bg-zinc/50 fixed inset-0 z-10 h-[50vh] w-full"
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
              className="flex h-full w-full max-w-md flex-col overflow-hidden rounded-xl border bg-zinc-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:rounded-3xl md:max-h-[85%]"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <Image
                  priority
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="h-72 w-full rounded-xl object-cover object-top p-1 md:rounded-3xl lg:h-80"
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
            className="flex cursor-pointer flex-row items-center justify-between rounded-xl p-4 hover:bg-zinc-200 dark:hover:bg-zinc-800"
          >
            <div className="flex flex-row gap-4">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <Image
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="size-14 rounded-xl border object-cover object-top shadow-sm dark:border-zinc-800"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="text-left font-medium text-zinc-800 dark:text-zinc-200"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-left text-zinc-600 dark:text-zinc-400"
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
    description: "Robber",
    title: "Huslang all day",
    src: "/img/music-cover/HustlangAllDay.jpg",
    ctaText: "Play",
    ctaLink: "/audio/HUSTLANG ALL DAY.mp3",
    content: () => {
      return (
        <p className="container flex-wrap text-lg">
          Hustlang All Day” bài hát xoay quanh sự tận hưởng cuộc sống, những
          khoảnh khắc vui vẻ và thái độ “chơi tới bến” của tuổi trẻ. Với phần
          rap cuốn hút, flow mượt mà cùng cách gieo vần đầy sáng tạo, Huslang đã
          tạo nên một bản nhạc dễ gây nghiện, khiến người nghe cảm thấy hứng
          khởi ngay từ những giây đầu tiên. Giai điệu của “All Day” pha trộn
          giữa chất Trap và một chút Melodic Rap, mang đến sự cân bằng giữa sự
          mạnh mẽ và cảm xúc. Đây là ca khúc thích hợp để nghe khi cần thêm động
          lực, muốn “chill” hoặc khuấy động bầu không khí.
        </p>
      );
    },
  },
  {
    description: "Sơn Tùng M-TP",
    title: "Có chắc yêu là đây",
    src: "/img/music-cover/CoChacYeuLaDay.jpg",
    ctaText: "Play",
    ctaLink: "/audio/CoChacYeuLaDay.mp3",
    content: () => {
      return (
        <p className="container flex-wrap text-lg">
          “Có Chắc Yêu Là Đây” mang đến cảm giác vui tươi, lãng mạn và tràn đầy
          năng lượng tích cực về tình yêu. Lời bài hát thể hiện những cảm xúc
          bồi hồi, rung động của chàng trai khi đang đắm chìm trong tình yêu.
          Giai điệu của bài hát có phần nhẹ nhàng, bay bổng hơn so với những ca
          khúc trước đó của Sơn Tùng M-TP, kết hợp cùng hình ảnh MV đầy màu sắc,
          mang phong cách đáng yêu, trẻ trung.
        </p>
      );
    },
  },
  {
    description: "Quốc Thiên",
    title: "Chia cách bình yên",
    src: "/img/music-cover/ChiaCachBinhYen.jpg",
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
          Với giai điệu nhẹ nhàng, sâu lắng cùng ca từ ý nghĩa, bài hát đã chạm
          đến trái tim của nhiều người từng trải qua một cuộc chia ly không mong
          muốn.
        </p>
      );
    },
  },
  {
    description: "Soobin Hoàng Sơn & Tùng Dương",
    title: "Giá như",
    src: "/img/music-cover/GiaNhu.jpg",
    ctaText: "Play",
    ctaLink: "/audio/GiaNhu.mp3",
    content: () => {
      return (
        <p className="container flex-wrap text-lg">
          “Chia Cách Bình Yên” là một ca khúc giàu cảm xúc, mang giai điệu nhẹ
          nhàng nhưng đầy day dứt về một cuộc chia ly. Bài hát kể về hai người
          yêu nhau nhưng buộc phải rời xa nhau, không phải vì hết yêu, mà vì
          những lý do ngoài tầm kiểm soát. Lời bài hát mang đến cảm giác tiếc
          nuối nhưng không quá bi lụy. Thay vì đau khổ dằn vặt, nó gợi lên sự
          chấp nhận trong lặng lẽ, một sự “chia cách bình yên” đúng như tên gọi.
          Với giai điệu nhẹ nhàng, sâu lắng cùng ca từ ý nghĩa, bài hát đã chạm
          đến trái tim của nhiều người từng trải qua một cuộc chia ly không mong
          muốn.
        </p>
      );
    },
  },
];
