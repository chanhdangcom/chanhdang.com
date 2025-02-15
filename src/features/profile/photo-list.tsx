import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carouse";
import { Photos } from "./components/photo";

type IPhoto = {
  photoUrl: string;
};

const IPhotoItem: IPhoto[] = [
  { photoUrl: "/img/ImgBlog/Blog1/2_3002c57a6f.webp" },
  { photoUrl: "/img/ImgBlog/Blog2/large_procreate_1_824cb1acaf.webp" },
  {
    photoUrl:
      "/img/ImgBlog/Blog3/large_siri_open_brain_new_york_times_1_dd4ec78bfc.webp",
  },
];

export const PhotoList = () => {
  return (
    <Carousel className="w-full max-w-6xl">
      <CarouselContent>
        {IPhotoItem.map((item, key) => (
          <CarouselItem className="basis-1/2" key={key}>
            <div className="flex items-center justify-center object-cover">
              <Photos photoUrl={item.photoUrl} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
