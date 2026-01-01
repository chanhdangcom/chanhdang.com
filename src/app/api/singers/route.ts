import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { normalizeDocument } from "@/lib/mongodb-helpers";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("musicdb");
    const singers = await db.collection("singers").find({}).toArray();
    const normalized = singers.map((s) => {
      const normalizedDoc = normalizeDocument(s);
      // Normalize addedBy field if it exists (could be ObjectId)
      if (s.addedBy) {
        const addedBy = s.addedBy;
        if (addedBy instanceof ObjectId) {
          return { ...normalizedDoc, addedBy: addedBy.toString() };
        }
        // Handle case where addedBy might be in the normalized doc already
        if (normalizedDoc.addedBy instanceof ObjectId) {
          return { ...normalizedDoc, addedBy: normalizedDoc.addedBy.toString() };
        }
        return { ...normalizedDoc, addedBy: String(addedBy) };
      }
      return normalizedDoc;
    });
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
    // Check authentication and permissions
    const { getUserRole, getUserId } = await import("@/lib/auth-helpers");
    const role = await getUserRole(request);
    
    // Only admin can add singers freely
    // Users can create their own artist profile (we'll handle this separately)
    if (!role || role !== "admin") {
      return NextResponse.json(
        { error: "Chỉ admin mới có quyền thêm ca sĩ. Người dùng có thể tạo profile ca sĩ của chính mình." },
        { status: 403 }
      );
    }

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

    const userId = await getUserId(request);
    const result = await db.collection("singers").insertOne({
      ...body,
      musics: [],
      addedBy: userId || null,
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
