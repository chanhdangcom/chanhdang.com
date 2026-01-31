import { ObjectId } from "mongodb";

/**
 * Normalize MongoDB document: convert _id ObjectId to id string
 */
export function normalizeDocument<T extends Record<string, unknown>>(
  doc: T
): T & { _id: string; id: string } {
  const rawId = doc._id;
  const id = rawId instanceof ObjectId ? rawId.toString() : String(rawId || "");
  return {
    ...doc,
    _id: id,
    id,
  } as T & { _id: string; id: string };
}

/**
 * Normalize embedded music object (used in playlists, topics, singers)
 */
export function normalizeMusic(music: Record<string, unknown>) {
  const getId = () => {
    if (typeof music.id === "string") return music.id;
    const raw = (music as { _id?: unknown })._id;
    if (typeof raw === "string") return raw;
    if (raw instanceof ObjectId) return raw.toString();
    if (raw && typeof (raw as { toString?: () => string }).toString === "function") {
      return (raw as { toString: () => string }).toString();
    }
    return "";
  };

  return {
    id: getId(),
    title: String(music.title ?? ""),
    singer: String(music.singer ?? ""),
    cover: String(music.cover ?? ""),
    audio: String(music.audio ?? ""),
    youtube: String(music.youtube ?? ""),
    content: String(music.content ?? ""),
    type: music.type ? String(music.type) : undefined,
    playCount:
      typeof music.playCount === "number" ? Number(music.playCount) : undefined,
    srt: music.srt ? String(music.srt) : undefined,
    beat: music.beat ? String(music.beat) : undefined,
    addedAt: music.addedAt
      ? new Date(music.addedAt as string | Date).toISOString()
      : undefined,
  };
}

/**
 * Validate and convert string IDs to ObjectIds
 */
export function parseObjectIds(ids: unknown[]): ObjectId[] {
  return ids
    .filter((id): id is string => typeof id === "string" && ObjectId.isValid(id))
    .map((id) => new ObjectId(id));
}

