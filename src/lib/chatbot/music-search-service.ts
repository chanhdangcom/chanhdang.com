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

/** Bài công khai (đồng bộ với trang nghe nhạc). */
export const publicMusicFilter = {
  $or: [{ status: { $exists: false } }, { status: "approved" as const }],
};

const audioReadyFilter = {
  audio: { $type: "string" as const, $ne: "" },
};

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

const normalizeForSearch = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Escape special regex characters
 */
const escapeRegex = (text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const levenshteinDistance = (a: string, b: string) => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => Array<number>(cols).fill(0));

  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[rows - 1][cols - 1];
};

const similarityScore = (a: string, b: string) => {
  const normalizedA = normalizeForSearch(a);
  const normalizedB = normalizeForSearch(b);
  if (!normalizedA || !normalizedB) return 0;

  const maxLength = Math.max(normalizedA.length, normalizedB.length);
  if (!maxLength) return 1;

  return 1 - levenshteinDistance(normalizedA, normalizedB) / maxLength;
};

const buildMusicScore = (music: MusicResult, query: string) => {
  const normalizedQuery = normalizeForSearch(query);
  const normalizedTitle = normalizeForSearch(music.title);
  const normalizedSinger = normalizeForSearch(music.singer);

  if (!normalizedQuery) {
    return 0;
  }

  let score = 0;

  if (normalizedTitle === normalizedQuery) score += 120;
  if (normalizedSinger === normalizedQuery) score += 80;
  if (normalizedTitle.startsWith(normalizedQuery)) score += 90;
  if (normalizedTitle.includes(normalizedQuery)) score += 70;
  if (normalizedSinger.includes(normalizedQuery)) score += 40;

  const titleSimilarity = similarityScore(normalizedTitle, normalizedQuery);
  const singerSimilarity = similarityScore(normalizedSinger, normalizedQuery);
  score += Math.round(titleSimilarity * 90);
  score += Math.round(singerSimilarity * 40);

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const titleTokens = normalizedTitle.split(" ").filter(Boolean);
  const singerTokens = normalizedSinger.split(" ").filter(Boolean);

  for (const token of queryTokens) {
    if (normalizedTitle.includes(token)) score += 16;
    if (normalizedSinger.includes(token)) score += 8;

    const bestTitleTokenScore = titleTokens.reduce((best, titleToken) => {
      return Math.max(best, similarityScore(token, titleToken));
    }, 0);
    const bestSingerTokenScore = singerTokens.reduce((best, singerToken) => {
      return Math.max(best, similarityScore(token, singerToken));
    }, 0);

    if (bestTitleTokenScore >= 0.72) {
      score += Math.round(bestTitleTokenScore * 22);
    }
    if (bestSingerTokenScore >= 0.72) {
      score += Math.round(bestSingerTokenScore * 10);
    }
  }

  const normType = normalizeForSearch(music.type ?? "");
  const normContent = normalizeForSearch((music.content ?? "").slice(0, 200));
  for (const token of queryTokens) {
    if (token.length > 1 && normType.includes(token)) score += 12;
    if (token.length > 1 && normContent.includes(token)) score += 8;
  }

  return score;
};

const dedupeMusicResults = (docs: unknown[]) => {
  const deduped = new Map<string, MusicResult>();

  for (const doc of docs) {
    const normalized = normalizeMusic(doc as Record<string, unknown>);
    if (normalized.id && normalized.audio) {
      deduped.set(normalized.id, normalized);
    }
  }

  return Array.from(deduped.values());
};

const baseMusicMatch = {
  $and: [publicMusicFilter, audioReadyFilter],
};

export async function searchMusicCandidates(
  searchQuery: string,
  limit: number = 5
): Promise<MusicResult[]> {
  if (!searchQuery || !searchQuery.trim()) {
    return [];
  }

  try {
    const client = await clientPromise;
    const db = client.db("musicdb");
    const collection = db.collection("musics");

    const trimmedQuery = searchQuery.trim();
    const escapedQuery = escapeRegex(trimmedQuery);
    const tokens = normalizeForSearch(trimmedQuery).split(" ").filter(Boolean);

    const regexQueries = [
      { title: { $regex: new RegExp(escapedQuery, "i") } },
      { singer: { $regex: new RegExp(escapedQuery, "i") } },
      ...tokens.flatMap((token) => [
        { title: { $regex: new RegExp(escapeRegex(token), "i") } },
        { singer: { $regex: new RegExp(escapeRegex(token), "i") } },
      ]),
    ];

    const docs = await collection
      .find({ $and: [baseMusicMatch, { $or: regexQueries }] })
      .limit(30)
      .toArray();

    let candidates = dedupeMusicResults(docs);

    const scoredInitial = candidates
      .map((music) => ({
        music,
        score: buildMusicScore(music, trimmedQuery),
      }))
      .sort((a, b) => b.score - a.score);

    const topInitialScore = scoredInitial[0]?.score ?? 0;

    if (candidates.length === 0 || topInitialScore < 70) {
      const fallbackDocs = await collection
        .find(baseMusicMatch)
        .project({
          title: 1,
          singer: 1,
          cover: 1,
          audio: 1,
          youtube: 1,
          content: 1,
          type: 1,
        })
        .limit(250)
        .toArray();

      candidates = dedupeMusicResults([...docs, ...fallbackDocs]);
    }

    return candidates
      .map((music) => ({
        music,
        score: buildMusicScore(music, trimmedQuery),
      }))
      .filter((item) => item.score >= 35)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.music);
  } catch (error) {
    console.error("[music-search-service] Error searching music candidates:", error);
    return [];
  }
}

/**
 * Search for a specific song by title
 * Uses case-insensitive matching (MongoDB regex with "i" flag handles case-insensitive)
 * Works with: "Hồng Nhan", "HỒNG NHAN", "hong nhan", "HONG NHAN", etc.
 */
export async function searchMusicByTitle(searchQuery: string): Promise<MusicResult | null> {
  const [firstMatch] = await searchMusicCandidates(searchQuery, 1);
  return firstMatch ?? null;
}

/**
 * Get a random song from the database
 */
export async function getRandomMusic(): Promise<MusicResult | null> {
  try {
    const client = await clientPromise;
    const db = client.db("musicdb");
    const collection = db.collection("musics");

    const musics = await collection
      .aggregate([{ $match: baseMusicMatch }, { $sample: { size: 1 } }])
      .toArray();

    if (musics.length === 0) {
      return null;
    }

    return normalizeMusic(musics[0] as Record<string, unknown>);
  } catch (error) {
    console.error("[music-search-service] Error getting random music:", error);
    return null;
  }
}

export async function getMusicRecommendations(limit: number = 3): Promise<MusicResult[]> {
  try {
    const client = await clientPromise;
    const db = client.db("musicdb");
    const collection = db.collection("musics");

    const musics = await collection
      .aggregate([{ $match: baseMusicMatch }, { $sample: { size: limit } }])
      .toArray();

    return musics
      .map((music) => normalizeMusic(music as Record<string, unknown>))
      .filter((music) => Boolean(music.id && music.audio));
  } catch (error) {
    console.error("[music-search-service] Error getting music recommendations:", error);
    return [];
  }
}

/** Bài có nhiều lượt nghe (ưu tiên demo / “đang hot”). */
export async function getTrendingMusicRecommendations(limit: number = 5): Promise<MusicResult[]> {
  try {
    const client = await clientPromise;
    const db = client.db("musicdb");
    const collection = db.collection("musics");

    const docs = await collection
      .find(baseMusicMatch)
      .project({
        title: 1,
        singer: 1,
        cover: 1,
        audio: 1,
        youtube: 1,
        content: 1,
        type: 1,
        playCount: 1,
      })
      .sort({ playCount: -1, updatedAt: -1 })
      .limit(Math.max(limit * 4, 24))
      .toArray();

    const list = dedupeMusicResults(docs)
      .filter((m) => m.audio)
      .slice(0, limit);

    if (list.length >= limit) {
      return list;
    }

    const extra = await getMusicRecommendations(limit - list.length);
    const seen = new Set(list.map((m) => m.id));
    for (const m of extra) {
      if (!seen.has(m.id)) {
        list.push(m);
        seen.add(m.id);
      }
    }
    return list.slice(0, limit);
  } catch (error) {
    console.error("[music-search-service] trending error:", error);
    return getMusicRecommendations(limit);
  }
}

/** Gợi ý theo tên ca sĩ / nghệ sĩ (trường singer). */
export async function searchMusicBySingerName(
  singerQuery: string,
  limit: number = 6
): Promise<MusicResult[]> {
  const q = singerQuery?.trim();
  if (!q) {
    return [];
  }

  try {
    const client = await clientPromise;
    const db = client.db("musicdb");
    const collection = db.collection("musics");
    const escaped = escapeRegex(q);

    const docs = await collection
      .find({
        $and: [
          baseMusicMatch,
          { singer: { $regex: new RegExp(escaped, "i") } },
        ],
      })
      .project({
        title: 1,
        singer: 1,
        cover: 1,
        audio: 1,
        youtube: 1,
        content: 1,
        type: 1,
        playCount: 1,
      })
      .sort({ playCount: -1, updatedAt: -1 })
      .limit(40)
      .toArray();

    let out = dedupeMusicResults(docs).slice(0, limit);
    if (out.length > 0) {
      return out;
    }

    return searchMusicCandidates(q, limit);
  } catch (error) {
    console.error("[music-search-service] by-singer error:", error);
    return searchMusicCandidates(singerQuery, limit);
  }
}

/**
 * Gợi ý theo mood / thể loại / chủ đề — khớp type, topic, title, đoạn đầu content.
 */
export async function searchMusicByMoodOrGenre(
  rawQuery: string,
  limit: number = 6
): Promise<MusicResult[]> {
  const trimmed = rawQuery?.trim();
  if (!trimmed) {
    return [];
  }

  const stop = new Set(
    normalizeForSearch(
      "gợi ý đề xuất cho mình muốn nghe bật mở phát nhạc bài hát some music play recommend suggest please đi nhé thử giúp tôi me i want to listen song"
    ).split(" ")
  );

  const tokens = normalizeForSearch(trimmed)
    .split(" ")
    .filter((t) => t.length > 1 && !stop.has(t));

  const core =
    tokens.length > 0
      ? tokens.join(" ")
      : normalizeForSearch(trimmed).replace(/\s+/g, " ").trim();

  if (!core) {
    return [];
  }

  try {
    const client = await clientPromise;
    const db = client.db("musicdb");
    const collection = db.collection("musics");

    let searchTokens = core.split(" ").filter((t) => t.length > 0).slice(0, 8);
    if (searchTokens.length === 0 && core.length > 0) {
      searchTokens = [core];
    }

    const ors: Record<string, unknown>[] = [];
    for (const token of searchTokens) {
      const rx = new RegExp(escapeRegex(token), "i");
      ors.push({ type: rx }, { topic: rx }, { title: rx }, { singer: rx });
    }

    if (ors.length === 0) {
      return [];
    }

    const fullRx = new RegExp(escapeRegex(searchTokens.join("|") || core), "i");
    ors.push({ content: fullRx });

    const docs = await collection
      .find({
        $and: [baseMusicMatch, { $or: ors }],
      })
      .project({
        title: 1,
        singer: 1,
        cover: 1,
        audio: 1,
        youtube: 1,
        content: 1,
        type: 1,
        topic: 1,
        playCount: 1,
      })
      .limit(48)
      .toArray();

    const candidates = dedupeMusicResults(docs);
    return candidates
      .map((music) => ({
        music,
        score: buildMusicScore(music, searchTokens.join(" ") || core),
      }))
      .filter((x) => x.score >= 28)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.music);
  } catch (error) {
    console.error("[music-search-service] mood/genre error:", error);
    return [];
  }
}

/** Gộp danh sách, bỏ trùng id. */
export function mergeUniqueMusicLists(lists: MusicResult[][], max: number): MusicResult[] {
  const seen = new Set<string>();
  const out: MusicResult[] = [];
  for (const list of lists) {
    for (const m of list) {
      if (!m.id || !m.audio || seen.has(m.id)) continue;
      seen.add(m.id);
      out.push(m);
      if (out.length >= max) return out;
    }
  }
  return out;
}
