import { IMusic } from "@/app/[locale]/features/profile/types/music";

export type IPlaylistItem = {
  id: string;
  title?: string;
  singer: string;
  cover: string;
  musicIds?: string[];
  musics?: IMusic[];
  queueName?: string;
};
