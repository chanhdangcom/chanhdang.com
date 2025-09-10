import { IMusic } from "@/app/[locale]/features/profile /types/music";


export type ISingerItem = {
  id: string;
  singer: string;
  cover: string;
  musics?: IMusic[];
}