import { IMusic } from "@/app/[locale]/features/profile/types/music";

export type IPlaylistItem = {
  id: string;
  title?: string;
  singer: string;
  cover: string;
  musics?: IMusic[];
  queueName?: string;
};
