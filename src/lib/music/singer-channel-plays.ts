import type { Db, Document } from "mongodb";
import { ObjectId } from "mongodb";

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const singerPublicMusicFilter = {
  $or: [{ status: { $exists: false } }, { status: "approved" }],
} as const;

export function normalizeObjectIds(ids: unknown[]): ObjectId[] {
  return ids
    .map((id) => {
      if (id instanceof ObjectId) return id;
      if (typeof id === "string" && ObjectId.isValid(id)) {
        return new ObjectId(id);
      }
      return null;
    })
    .filter((id): id is ObjectId => Boolean(id));
}

/**
 * Tổng lượt nghe kênh — cùng logic với `getSinger` (trang `/music/singer/[id]`):
 * có `musicIds` thì cộng playCount các bài đó; không thì khớp theo singerId / tên (tối đa 80 bài).
 */
export async function getSingerChannelTotalPlays(
  db: Db,
  singer: Document & { _id: ObjectId; singer?: unknown; musicIds?: unknown }
): Promise<number> {
  const musicIds = Array.isArray(singer.musicIds)
    ? normalizeObjectIds(singer.musicIds)
    : [];

  if (musicIds.length > 0) {
    const rows = await db
      .collection("musics")
      .aggregate<{ total: number }>([
        { $match: { _id: { $in: musicIds }, ...singerPublicMusicFilter } },
        {
          $group: {
            _id: null,
            total: { $sum: { $ifNull: ["$playCount", 0] } },
          },
        },
      ])
      .toArray();
    return rows[0]?.total ?? 0;
  }

  const singerName = String(singer.singer ?? "").trim();
  if (!singerName) {
    return 0;
  }

  const singerRegex = new RegExp(
    `(^|,)\\s*${escapeRegex(singerName)}\\s*(,|$)`,
    "i"
  );

  const rows = await db
    .collection("musics")
    .aggregate<{ total: number }>([
      {
        $match: {
          $and: [
            {
              $or: [
                { singerId: singer._id },
                { singer: singerRegex },
                { singer: singerName },
              ],
            },
            { ...singerPublicMusicFilter },
          ],
        },
      },
      { $limit: 80 },
      {
        $group: {
          _id: null,
          total: { $sum: { $ifNull: ["$playCount", 0] } },
        },
      },
    ])
    .toArray();

  return rows[0]?.total ?? 0;
}
