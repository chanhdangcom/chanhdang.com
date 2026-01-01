import { IMusic } from "@/app/[locale]/features/profile/types/music";

export type ISingerItem = {
  id?: string;
  _id?: string;
  singer: string;
  cover: string;
  musics?: IMusic[];
  addedBy?: string; // User ID who created this artist profile
  isUserProfile?: boolean; // Whether this is a user-created profile
  createdAt?: Date;
  updatedAt?: Date;
};
