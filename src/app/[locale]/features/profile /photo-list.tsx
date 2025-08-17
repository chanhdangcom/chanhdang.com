"use client";

import { Photos } from "./components/photo";
import { ExperienceInfoItem } from "./components/experience-info-item";
import { ImageIcon } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carouse";

type IPhoto = {
  photoUrl: string;
  time?: string;
  title?: string;
};

const IPhotoItem: IPhoto[] = [
  // { photoUrl: "/img/ImgBlog/Blog1/2_3002c57a6f.webp" },
  // { photoUrl: "/img/ImgBlog/Blog2/large_procreate_1_824cb1acaf.webp" },
  // {
  //   photoUrl:
  //     "/img/ImgBlog/Blog3/large_siri_open_brain_new_york_times_1_dd4ec78bfc.webp",
  // },
  {
    photoUrl: "/img/photo-me/1.webp",
    time: "19/2/2024",
    title: "Hội xuân AGU",
  },
  {
    photoUrl: "/img/photo-me/11.webp",
    time: "11/11/2023",
    title: "Văn nghệ AGU",
  },
  {
    photoUrl: "/img/photo-me/4.webp",
    time: "24/12/2023",
    title: "Trung thu cho em",
  },
  {
    photoUrl: "/img/photo-me/5.webp",
    time: "3/11/2023",
    title: "Chủ nhật xanh",
  },
  // {
  //   photoUrl: "/img/photo-me/10.JPG",
  //   time: "26/12/2024",
  //   title: "Địa chỉ đỏ",
  // },
];

export const PhotoList = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="my-2 flex items-center space-x-2 font-mono text-sm">
          <ExperienceInfoItem icon={<ImageIcon />} content="Gallery" />
          <div className="text-gray-400">| 2023 - Present</div>
        </div>
      </motion.div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="mt-4">
          <Carousel setApi={setApi} className="w-full max-w-4xl">
            <CarouselContent className="p-3.5">
              {IPhotoItem.map((item, key) => (
                <CarouselItem
                  className="transform transition-transform duration-300 md:basis-1/3 md:hover:scale-105"
                  key={key}
                >
                  <motion.div
                    animate={{ x: [-3, 3, -3] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="grid items-center justify-center">
                      <Photos
                        photoUrl={item.photoUrl}
                        time={item.time}
                        title={item.title}
                      />
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="mx-auto mt-2 flex w-16 justify-center gap-1 rounded-xl border px-2 py-0.5 font-mono text-sm shadow-sm dark:border-zinc-800">
            {current}/{count}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
