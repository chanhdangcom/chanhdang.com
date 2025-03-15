import { IMusic } from "@/features/profile/types/music";

export type IPlaylistItem = {
  id: string;
  title: string;
  singer: string;
  cover: string;
  musics?: IMusic[];
}