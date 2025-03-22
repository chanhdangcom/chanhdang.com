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
      <DrawerTrigger>
        <div className="cursor-pointer space-y-2 rounded-3xl p-3 hover:bg-zinc-900">
          {music.cover ? (
            <Image
              height={300}
              width={300}
              alt="cover"
              src={music.cover}
              quality={100}
              className="mx-auto size-32 justify-center rounded-2xl border border-zinc-800 object-cover"
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

      <div className="text-xl">
        <DrawerContent className="border border-zinc-800 bg-zinc-950">
          <DrawerHeader className="border-b border-zinc-900">
            <div className="absolute inset-0 top-4 mx-auto h-1.5 w-32 rounded-full bg-zinc-800"></div>
            <DrawerTitle className="mx-auto font-mono text-xl">
              {music.title}
            </DrawerTitle>

            <DrawerDescription className="mx-auto font-mono text-zinc-50">
              Playlist of {music.singer}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex h-[40vh] items-center overflow-x-auto p-4">
            {music.musics?.map((music) => (
              <div key={music.id} className="shrink-0s">
                <AuidoItem
                  key={music.id}
                  music={music}
                  handlePlay={() => handlePlayAudio(music)}
                />
              </div>
            ))}
          </div>
        </DrawerContent>
      </div>
    </Drawer>
  );
}
