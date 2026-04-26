export type ChatMusic = {
  id: string;
  title: string;
  singer: string;
  cover: string;
  audio: string;
  youtube?: string;
  content?: string;
  type?: string;
};

export type ChatAction =
  | {
      type: "theme";
      value: "light" | "dark";
    }
  | {
      type: "play-music";
      track: ChatMusic;
      autoPlay?: boolean;
    }
  | {
      type: "suggest-music";
      tracks: ChatMusic[];
      reason?: string;
    };

export type ChatApiResponse = {
  answer?: string;
  actions?: ChatAction[];
  error?: string;
  meta?: {
    intent: "chat" | "theme" | "music-play" | "music-suggest";
  };
};
