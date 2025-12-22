import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { normalizeDocument } from "@/lib/mongodb-helpers";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("musicdb");
    const singers = await db.collection("singers").find({}).toArray();
    const normalized = singers.map((s) => normalizeDocument(s));
    return NextResponse.json(normalized);
  } catch (error) {
    console.error("Error fetching singers:", error);
    return NextResponse.json(
      { error: "Failed to fetch singers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.singer || !body.cover) {
      return NextResponse.json(
        { error: "Missing singer or cover" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");

    const existingSinger = await db.collection("singers").findOne({
      singer: body.singer,
    });

    if (existingSinger) {
      return NextResponse.json({ error: "Singer already exists" }, { status: 400 });
    }

    const result = await db.collection("singers").insertOne({
      ...body,
      musics: [],
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("Error adding singer:", error);
    return NextResponse.json(
      { error: "Failed to add singer" },
      { status: 500 }
    );
  }
}
