import { IMusic } from "@/features/profile/types/music";

export type ISingerItem = {
  id: string;
  singer: string;
  cover: string;
  musics?: IMusic[];
}