import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { normalizeDocument } from "@/lib/mongodb-helpers";

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

    const musics = isRandom
      ? await db
          .collection("musics")
          .aggregate([{ $sample: { size: limit } }])
          .toArray()
      : await db.collection("musics").find({}).toArray();

    const normalized = musics.map((m) => normalizeDocument(m));
    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Error fetching musics:", error);
    return NextResponse.json(
      { error: "Failed to fetch musics" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication and permissions
    const { getUserRole, getUserId } = await import("@/lib/auth-helpers");
    const role = await getUserRole(request);
    
    if (!role || (role !== "user" && role !== "admin")) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để thêm bài hát" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("musicdb");
    
    // Add userId to track who added the music
    const userId = await getUserId(request);
    const musicData = {
      ...body,
      addedBy: userId || null,
      createdAt: new Date(),
    };
    
    const result = await db.collection("musics").insertOne(musicData);
    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("Error adding music:", error);
    return NextResponse.json(
      { error: "Failed to add music" },
      { status: 500 }
    );
  }
}
