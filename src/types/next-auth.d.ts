import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      friendCode?: string | null;
      bio?: string | null;
      location?: string | null;
      favoriteGenres?: string | null;
      favoriteArtists?: string | null;
      libraryVisibility?: string | null;
    } & DefaultSession["user"];
  }
}

export {};
