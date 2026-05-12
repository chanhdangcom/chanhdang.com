import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getUserRole } from "@/lib/auth-helpers";
import { requireAdmin } from "@/lib/permissions";
import { getSingerChannelTotalPlays } from "@/lib/music/singer-channel-plays";
import {
  computeEstimatedChannelVnd,
  getSingerChannelEarningsConfigFromEnv,
} from "@/lib/music/singer-channel-earnings";

const CHUNK = 12;

export type SingerEarningsRow = {
  singerId: string;
  singerName: string;
  cover?: string;
  totalPlays: number;
  estimatedVnd: number;
  isUserProfile?: boolean;
  addedBy?: string;
};

/**
 * GET — admin: danh sách kênh ca sĩ + lượt nghe + ước tính tiền (sắp xếp cao → thấp theo VND).
 */
export async function GET(request: Request) {
  try {
    const role = await getUserRole(request);
    if (!requireAdmin(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    const config = getSingerChannelEarningsConfigFromEnv();

    const singers = await db
      .collection("singers")
      .find(
        {},
        {
          projection: {
            singer: 1,
            cover: 1,
            musicIds: 1,
            addedBy: 1,
            isUserProfile: 1,
          },
        }
      )
      .toArray();

    const rows: SingerEarningsRow[] = [];

    for (let i = 0; i < singers.length; i += CHUNK) {
      const slice = singers.slice(i, i + CHUNK);
      const chunk = await Promise.all(
        slice.map(async (doc) => {
          const totalPlays = await getSingerChannelTotalPlays(db, doc);
          const estimatedVnd = computeEstimatedChannelVnd(totalPlays, config);
          return {
            singerId: String(doc._id),
            singerName: String(doc.singer ?? ""),
            cover: typeof doc.cover === "string" ? doc.cover : undefined,
            totalPlays,
            estimatedVnd,
            isUserProfile: Boolean(doc.isUserProfile),
            addedBy: typeof doc.addedBy === "string" ? doc.addedBy : undefined,
          } satisfies SingerEarningsRow;
        })
      );
      rows.push(...chunk);
    }

    rows.sort((a, b) => {
      if (b.estimatedVnd !== a.estimatedVnd) {
        return b.estimatedVnd - a.estimatedVnd;
      }
      return b.totalPlays - a.totalPlays;
    });

    return NextResponse.json({
      rows,
      config: {
        thresholdPlays: config.thresholdPlays,
        blockPlays: config.blockPlays,
        vndPerBlock: config.vndPerBlock,
      },
    });
  } catch (error) {
    console.error("[admin/singer-earnings]", error);
    return NextResponse.json(
      { error: "Failed to compute singer earnings" },
      { status: 500 }
    );
  }
}
