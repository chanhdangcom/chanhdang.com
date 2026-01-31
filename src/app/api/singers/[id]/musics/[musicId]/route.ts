import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { normalizeMusic } from "@/lib/mongodb-helpers";
import { getUserRole, getUserId } from "@/lib/auth-helpers";

/**
 * PUT /api/singers/[id]/musics/[musicId]
 * Update a music in singer's musics array
 */
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string; musicId: string }> }
) {
  try {
    const { id, musicId } = await context.params;
    const role = await getUserRole(request);
    const userId = await getUserId(request);

    if (!role || (role !== "user" && role !== "admin")) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để sửa bài hát" },
        { status: 401 }
      );
    }

    if (!ObjectId.isValid(id) || !ObjectId.isValid(musicId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("musicdb");

    // Find the singer
    const singerCollection = db.collection<{
      _id: ObjectId;
      addedBy?: string | ObjectId;
      singer?: string;
      musicIds?: ObjectId[];
    }>("singers");

    const singer = await singerCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!singer) {
      return NextResponse.json({ error: "Singer not found" }, { status: 404 });
    }

    // Check if user owns this singer profile (for regular users)
    if (role === "user" && singer.addedBy && singer.addedBy !== userId) {
      return NextResponse.json(
        { error: "Bạn chỉ có thể sửa bài hát trong profile ca sĩ của chính mình" },
        { status: 403 }
      );
    }

    const musicInCollection = await db.collection("musics").findOne({
      _id: new ObjectId(musicId),
    });

    if (!musicInCollection) {
      return NextResponse.json({ error: "Music not found" }, { status: 404 });
    }

    const singerName = String(singer.singer ?? "").trim().toLowerCase();
    const musicSingerName = String(musicInCollection.singer ?? "")
      .trim()
      .toLowerCase();
    const belongsToSinger =
      (musicInCollection.singerId &&
        String(musicInCollection.singerId) === String(singer._id)) ||
      (singerName && singerName === musicSingerName);

    if (!belongsToSinger) {
      return NextResponse.json(
        { error: "Music does not belong to this singer" },
        { status: 400 }
      );
    }

    if (
      role === "user" &&
      musicInCollection.addedBy &&
      musicInCollection.addedBy !== userId
    ) {
      return NextResponse.json(
        { error: "Bạn chỉ có thể sửa bài hát của chính mình" },
        { status: 403 }
      );
    }

    const updatedMusic = {
      ...musicInCollection,
      ...body,
      singer: singer.singer,
      singerId: singer._id,
      updatedAt: new Date(),
    };

    await db.collection("musics").updateOne(
      { _id: new ObjectId(musicId) },
      {
        $set: {
          ...body,
          singer: singer.singer,
          singerId: singer._id,
          updatedAt: new Date(),
        },
      }
    );

    await singerCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $addToSet: { musicIds: new ObjectId(musicId) },
        $set: { updatedAt: new Date() },
      }
    );

    return NextResponse.json({
      success: true,
      music: normalizeMusic(updatedMusic),
    });
  } catch (error) {
    console.error("Error updating music:", error);
    return NextResponse.json(
      { error: "Failed to update music" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/singers/[id]/musics/[musicId]
 * Delete a music from singer's musics array
 */
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string; musicId: string }> }
) {
  try {
    const { id, musicId } = await context.params;
    const role = await getUserRole(request);
    const userId = await getUserId(request);

    if (!role || (role !== "user" && role !== "admin")) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để xóa bài hát" },
        { status: 401 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("musicdb");

    const singerCollection = db.collection<{
      _id: ObjectId;
      addedBy?: string | ObjectId;
      singer?: string;
      musicIds?: ObjectId[];
    }>("singers");

    // Find the singer
    const singer = await singerCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!singer) {
      return NextResponse.json({ error: "Singer not found" }, { status: 404 });
    }

    // Check if user owns this singer profile (for regular users)
    if (role === "user" && singer.addedBy && singer.addedBy !== userId) {
      return NextResponse.json(
        { error: "Bạn chỉ có thể xóa bài hát trong profile ca sĩ của chính mình" },
        { status: 403 }
      );
    }

    const musicInCollection = await db.collection("musics").findOne({
      _id: new ObjectId(musicId),
    });

    if (!musicInCollection) {
      return NextResponse.json({ error: "Music not found" }, { status: 404 });
    }

    const singerName = String(singer.singer ?? "").trim().toLowerCase();
    const musicSingerName = String(musicInCollection.singer ?? "")
      .trim()
      .toLowerCase();
    const belongsToSinger =
      (musicInCollection.singerId &&
        String(musicInCollection.singerId) === String(singer._id)) ||
      (singerName && singerName === musicSingerName);

    if (!belongsToSinger) {
      return NextResponse.json(
        { error: "Music does not belong to this singer" },
        { status: 400 }
      );
    }

    if (
      role === "user" &&
      musicInCollection.addedBy &&
      musicInCollection.addedBy !== userId
    ) {
      return NextResponse.json(
        { error: "Bạn chỉ có thể xóa bài hát của chính mình" },
        { status: 403 }
      );
    }

    await db.collection("musics").deleteOne({ _id: new ObjectId(musicId) });
    await singerCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $pull: { musicIds: new ObjectId(musicId) },
        $set: { updatedAt: new Date() },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting music:", error);
    return NextResponse.json(
      { error: "Failed to delete music" },
      { status: 500 }
    );
  }
}

