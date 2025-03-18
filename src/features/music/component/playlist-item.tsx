"use client";
import Image from "next/image";
import { IPlaylistItem } from "../type/playlist";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { AuidoItem } from "./audio-item";
import { useAudio } from "@/components/music-provider";

type IProp = {
  music: IPlaylistItem;
};

export function PlaylistItem({ music }: IProp) {
  const { handlePlayAudio } = useAudio();

  if (!music) {
    return <div className="text-red-500">Dữ liệu chưa sẵn sàng</div>;
  }

  return (
    <Drawer>
      <DrawerTrigger className="">
        <div className="w-fit shrink-0 cursor-pointer space-y-2 rounded-3xl p-3 hover:bg-zinc-100 hover:dark:bg-zinc-900">
          {music.cover ? (
            <Image
              height={300}
              width={300}
              alt="cover"
              src={music.cover}
              quality={100}
              className="mx-auto size-32 justify-center rounded-2xl border object-cover shadow-sm dark:border-zinc-800"
            />
          ) : (
            <div className="size-32 rounded-2xl bg-zinc-800"></div>
          )}

          <div className="text-center">
            <div className="line-clamp-1 w-32 font-semibold">
              {music.title || "TITLE"}
            </div>

            <div className="line-clamp-1 w-32 text-zinc-500">
              {music.singer || "SINGER"}
            </div>
          </div>
        </div>
      </DrawerTrigger>

      <div className="w-fit text-xl">
        <DrawerContent className="border bg-zinc-50 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <DrawerHeader className="border-b shadow-sm dark:border-zinc-900">
            <div className="absolute inset-0 top-4 mx-auto h-1.5 w-32 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
            <DrawerTitle className="mx-auto font-mono text-xl">
              {music.title}
            </DrawerTitle>

            <DrawerDescription className="mx-auto font-mono">
              Playlist of {music.singer}
            </DrawerDescription>
          </DrawerHeader>

          <div className="mx-auto flex h-[40vh] items-center overflow-y-auto p-4">
            {music.musics?.map((music) => (
              <AuidoItem
                key={music.id}
                music={music}
                handlePlay={() => handlePlayAudio(music)}
              />
            ))}
          </div>
        </DrawerContent>
      </div>
    </Drawer>
  );
}
