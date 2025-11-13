import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET /api/history?userId=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limitParam = searchParams.get("limit");

    if (!userId) {
      return NextResponse.json({ error: "Thiếu userId" }, { status: 400 });
    }

    const limit = Math.max(
      1,
      Math.min(200, Number.isFinite(Number(limitParam)) ? Number(limitParam) : 50)
    );

    const client = await clientPromise;
    const db = client.db("musicdb");

    const items = await db
      .collection("history")
      .aggregate([
        { $match: { userId } },
        { $sort: { playedAt: -1 } },
        {
          $group: {
            _id: "$musicId",
            userId: { $first: "$userId" },
            musicId: { $first: "$musicId" },
            musicData: { $first: "$musicData" },
            playedAt: { $first: "$playedAt" },
            playCount: {
              $sum: {
                $cond: [
                  { $gt: ["$playCount", 0] },
                  "$playCount",
                  1,
                ],
              },
            },
          },
        },
        { $sort: { playedAt: -1 } },
        { $limit: limit },
      ])
      .toArray();

    return NextResponse.json(items);
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}

// POST /api/history
// body: { userId: string, musicId: string, musicData: any, playedAt?: string }
export async function POST(request: Request) {
  try {
    const { userId, musicId, musicData, playedAt } = await request.json();

    if (!userId || !musicId) {
      return NextResponse.json(
        { error: "Thiếu userId hoặc musicId" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");

    const result = await db.collection("history").insertOne({
      userId,
      musicId,
      musicData,
      playedAt: playedAt ? new Date(playedAt) : new Date(),
    });

    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json({ error: "Failed to add history" }, { status: 500 });
  }
}


