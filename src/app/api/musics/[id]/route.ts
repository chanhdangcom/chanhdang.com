import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getUserRole } from "@/lib/auth-helpers";
import { normalizeDocument } from "@/lib/mongodb-helpers";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    const music = await db.collection("musics").findOne({ _id: new ObjectId(id) });

    if (!music) {
      return NextResponse.json({ error: "Music not found" }, { status: 404 });
    }

    return NextResponse.json(normalizeDocument(music));
  } catch (error) {
    console.error("Error fetching music:", error);
    return NextResponse.json(
      { error: "Failed to fetch music" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const role = await getUserRole(request);
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Chỉ admin mới có quyền sửa bài hát" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("musicdb");
    const music = await db.collection("musics").findOne({ _id: new ObjectId(id) });

    if (!music) {
      return NextResponse.json({ error: "Music not found" }, { status: 404 });
    }

    const { _id, id: bodyId, createdAt, ...updatePayload } =
      body as Record<string, unknown>;

    await db.collection("musics").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updatePayload,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating music:", error);
    return NextResponse.json(
      { error: "Failed to update music" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const role = await getUserRole(request);
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Chỉ admin mới có quyền xóa bài hát" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    const music = await db.collection("musics").findOne({ _id: new ObjectId(id) });

    if (!music) {
      return NextResponse.json({ error: "Music not found" }, { status: 404 });
    }

    await db.collection("musics").deleteOne({ _id: new ObjectId(id) });
    await db
      .collection("singers")
      .updateMany({}, { $pull: { musicIds: new ObjectId(id) } });
    await db
      .collection("playlists")
      .updateMany({}, { $pull: { musicIds: new ObjectId(id) } });
    await db
      .collection("topics")
      .updateMany({}, { $pull: { musicIds: new ObjectId(id) } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting music:", error);
    return NextResponse.json(
      { error: "Failed to delete music" },
      { status: 500 }
    );
  }
}
