import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const isRandom = url.searchParams.get("random");
    const limitParam = url.searchParams.get("limit");

    const limit = Math.max(
      1,
      Math.min(100, Number.isFinite(Number(limitParam)) ? Number(limitParam) : 1)
    );

    const client = await clientPromise;
    const db = client.db("musicdb");

    if (isRandom) {
      const sampled = await db
        .collection("musics")
        .aggregate([{ $sample: { size: limit } }])
        .toArray();
      return NextResponse.json(sampled);
    }

    const musics = await db.collection("musics").find({}).toArray();
    return NextResponse.json(musics);
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch musics" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validate dữ liệu đầu vào ở đây nếu cần
    const client = await clientPromise;
    const db = client.db("musicdb");
    const result = await db.collection("musics").insertOne(body);
    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json({ error: "Failed to add music" }, { status: 500 });
  }
}
