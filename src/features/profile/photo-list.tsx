import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carouse";
import { Photos } from "./components/photo";
import { ExperienceInfoItem } from "./components/experience-info-item";
import { ImageIcon } from "lucide-react";

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
    photoUrl: "/img/photo-me/1.JPG",
    time: "19/2/2024",
    title: "Hội xuân AGU",
  },
  {
    photoUrl: "/img/photo-me/IMG_9097.JPG",
    time: "11/11/2023",
    title: "Văn nghệ AGU",
  },
  {
    photoUrl: "/img/photo-me/4.JPG",
    time: "24/12/2023",
    title: "Trung thu cho em",
  },
  {
    photoUrl: "/img/photo-me/5.JPG",
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
  return (
    <div className="">
      <div className="my-2 flex items-center space-x-2 font-mono text-sm">
        <div className="">
          <ExperienceInfoItem icon={<ImageIcon />} content="Gallery" />
        </div>
        <div className="text-gray-400">| 2013 - Present</div>
      </div>

      <div className="mt-4">
        <Carousel className="w-full max-w-4xl">
          <CarouselContent className="">
            {IPhotoItem.map((item, key) => (
              <CarouselItem className="md:basis-1/3" key={key}>
                <div className="grid items-center justify-center">
                  <Photos
                    photoUrl={item.photoUrl}
                    time={item.time}
                    title={item.title}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};
