import clientPromise from "@/lib/mongodb";

export interface MusicResult {
  id: string;
  title: string;
  singer: string;
  cover: string;
  audio: string;
  youtube?: string;
  content?: string;
  type?: string;
}

const normalizeMusicId = (music: Record<string, unknown>): string => {
  if (typeof music.id === "string") return music.id;
  const raw = (music as { _id?: unknown })._id;
  if (typeof raw === "string") return raw;
  if (raw && typeof (raw as { toString: () => string }).toString === "function") {
    return (raw as { toString: () => string }).toString();
  }
  return "";
};

const normalizeMusic = (music: Record<string, unknown>): MusicResult => {
  return {
    id: normalizeMusicId(music),
    title: String(music.title ?? ""),
    singer: String(music.singer ?? ""),
    cover: String(music.cover ?? ""),
    audio: String(music.audio ?? ""),
    youtube: music.youtube ? String(music.youtube) : undefined,
    content: music.content ? String(music.content) : undefined,
    type: music.type ? String(music.type) : undefined,
  };
};

/**
 * Escape special regex characters
 */
const escapeRegex = (text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Search for a specific song by title
 * Uses case-insensitive matching (MongoDB regex with "i" flag handles case-insensitive)
 * Works with: "Hồng Nhan", "HỒNG NHAN", "hong nhan", "HONG NHAN", etc.
 */
export async function searchMusicByTitle(searchQuery: string): Promise<MusicResult | null> {
  if (!searchQuery || !searchQuery.trim()) {
    return null;
  }

  try {
    const client = await clientPromise;
    const db = client.db("musicdb");
    const collection = db.collection("musics");

    const trimmedQuery = searchQuery.trim();
    const escapedQuery = escapeRegex(trimmedQuery);

    // Try exact match first (case-insensitive)
    // MongoDB regex with "i" flag is case-insensitive
    let music = await collection.findOne({
      title: { $regex: new RegExp(`^${escapedQuery}$`, "i") },
    });

    if (music) {
      return normalizeMusic(music as Record<string, unknown>);
    }

    // Try partial match in title (case-insensitive)
    music = await collection.findOne({
      title: { $regex: new RegExp(escapedQuery, "i") },
    });

    if (music) {
      return normalizeMusic(music as Record<string, unknown>);
    }

    // Try searching in both title and singer (case-insensitive)
    const musics = await collection
      .find({
        $or: [
          { title: { $regex: new RegExp(escapedQuery, "i") } },
          { singer: { $regex: new RegExp(escapedQuery, "i") } },
        ],
      })
      .limit(1)
      .toArray();

    if (musics.length > 0) {
      return normalizeMusic(musics[0] as Record<string, unknown>);
    }

    return null;
  } catch (error) {
    console.error("[music-search-service] Error searching music:", error);
    return null;
  }
}

/**
 * Get a random song from the database
 */
export async function getRandomMusic(): Promise<MusicResult | null> {
  try {
    const client = await clientPromise;
    const db = client.db("musicdb");
    const collection = db.collection("musics");

    const musics = await collection.aggregate([{ $sample: { size: 1 } }]).toArray();

    if (musics.length === 0) {
      return null;
    }

    return normalizeMusic(musics[0] as Record<string, unknown>);
  } catch (error) {
    console.error("[music-search-service] Error getting random music:", error);
    return null;
  }
}

