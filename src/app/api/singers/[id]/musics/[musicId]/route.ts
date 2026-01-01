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
    const singer = await db.collection("singers").findOne({
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

    // Find the music in the singer's musics array
    const musics = Array.isArray(singer.musics) ? singer.musics : [];
    const musicIndex = musics.findIndex(
      (m: Record<string, unknown>) =>
        (m._id && String(m._id) === musicId) ||
        (m.id && String(m.id) === musicId)
    );

    if (musicIndex === -1) {
      return NextResponse.json({ error: "Music not found" }, { status: 404 });
    }

    // Check if user owns this music (for regular users)
    const existingMusic = musics[musicIndex] as Record<string, unknown>;
    if (
      role === "user" &&
      existingMusic.addedBy &&
      existingMusic.addedBy !== userId
    ) {
      return NextResponse.json(
        { error: "Bạn chỉ có thể sửa bài hát của chính mình" },
        { status: 403 }
      );
    }

    // Update the music
    const updatedMusic = {
      ...existingMusic,
      ...body,
      updatedAt: new Date(),
    };

    // Update in singer's musics array
    musics[musicIndex] = updatedMusic;
    await db.collection("singers").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          musics: musics,
          updatedAt: new Date(),
        },
      }
    );

    // Also update in musics collection if exists
    const musicInCollection = await db.collection("musics").findOne({
      _id: new ObjectId(musicId),
    });

    if (musicInCollection) {
      await db.collection("musics").updateOne(
        { _id: new ObjectId(musicId) },
        {
          $set: {
            ...body,
            updatedAt: new Date(),
          },
        }
      );
    }

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

    // Find the singer
    const singer = await db.collection("singers").findOne({
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

    // Find and remove the music from singer's musics array
    const musics = Array.isArray(singer.musics) ? singer.musics : [];
    const musicIndex = musics.findIndex(
      (m: Record<string, unknown>) =>
        (m._id && String(m._id) === musicId) ||
        (m.id && String(m.id) === musicId)
    );

    if (musicIndex === -1) {
      return NextResponse.json({ error: "Music not found" }, { status: 404 });
    }

    // Check if user owns this music (for regular users)
    const existingMusic = musics[musicIndex] as Record<string, unknown>;
    if (
      role === "user" &&
      existingMusic.addedBy &&
      existingMusic.addedBy !== userId
    ) {
      return NextResponse.json(
        { error: "Bạn chỉ có thể xóa bài hát của chính mình" },
        { status: 403 }
      );
    }

    // Remove from singer's musics array
    musics.splice(musicIndex, 1);
    await db.collection("singers").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          musics: musics,
          updatedAt: new Date(),
        },
      }
    );

    // Also delete from musics collection if exists
    if (ObjectId.isValid(musicId)) {
      await db.collection("musics").deleteOne({ _id: new ObjectId(musicId) });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting music:", error);
    return NextResponse.json(
      { error: "Failed to delete music" },
      { status: 500 }
    );
  }
}

