"use client";

import { Photos } from "./components/photo";

type IPhoto = {
  photoUrl: string;
  time?: string;
  title?: string;
};

const IPhotoItem: IPhoto[] = [
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
    photoUrl: "/img/photo-me/4.webp",
    time: "24/12/2023",
    title: "Trung thu cho em",
  },
];

export const PhotoList = () => {
  return (
    <>
      <div className="grid grid-cols-3 gap-8 p-8">
        {IPhotoItem.map((item, key) => (
          <div key={key} className="relative">
            <Photos
              photoUrl={item.photoUrl}
              time={item.time}
              title={item.title}
            />
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-[-10px] right-[-10px] top-0 h-px bg-zinc-300 dark:bg-zinc-800" />

              <div className="absolute bottom-0 left-[-10px] right-[-10px] h-px bg-zinc-300 dark:bg-zinc-800" />

              <div className="absolute bottom-[-10px] left-0 top-[-10px] w-px bg-zinc-300 dark:bg-zinc-800" />

              <div className="absolute bottom-[-10px] right-0 top-[-10px] w-px bg-zinc-300 dark:bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
