import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// PATCH /api/users/:id
export async function PATCH(
  request: Request,
  context: unknown
) {
  try {
    const params = (context as { params?: { id?: string } })?.params;
    const userId = params?.id;
    console.log("[users:PATCH] Incoming request", { userId });
    if (!userId) {
      console.warn("[users:PATCH] Missing user id in route params");
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    const payload = await request.json();
    console.log("[users:PATCH] Parsed payload", {
      hasPayload: Boolean(payload),
      includes: Object.keys(payload ?? {}),
    });
    const {
      username,
      displayName,
      bio,
      avatarUrl,
      userId: bodyUserId,
      lookupUsername: bodyLookupUsername,
    } = payload ?? {};

    // Build object update
    const update: Record<string, unknown> = {};
    if (typeof username === "string") update.username = username;
    if (typeof displayName === "string") update.displayName = displayName;
    if (typeof bio === "string") update.bio = bio;
    if (typeof avatarUrl === "string") update.avatarUrl = avatarUrl;
    update.updatedAt = new Date();

    console.log("[users:PATCH] Built update object", update);

    // Kiểm tra nếu không có gì để update
    if (Object.keys(update).length === 1 && update.updatedAt) {
      console.warn("[users:PATCH] No valid fields to update", { userId });
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    const users = db.collection("users");
    const filters: Array<Record<string, unknown>> = [];

    // Tạo danh sách filter tìm user
    if (typeof bodyLookupUsername === "string" && bodyLookupUsername.trim()) {
      filters.push({ username: bodyLookupUsername.trim() });
    }
    if (typeof bodyUserId === "string" && ObjectId.isValid(bodyUserId)) {
      filters.push({ _id: new ObjectId(bodyUserId) });
    }

    if (userId) {
      if (ObjectId.isValid(userId)) {
        filters.push({ _id: new ObjectId(userId) });
      } else {
        filters.push({ username: { $regex: new RegExp(`^${userId}$`, "i") } });
      }
    }

    console.log("[users:PATCH] Computed filters", filters);

    // Cập nhật user
    const result = await users.findOneAndUpdate(
      { $or: filters },
      { $set: update },
      { returnDocument: "after" }
    );

    if (!result?.value) {
      console.warn("[users:PATCH] User not found for filters", filters);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = result.value as Record<string, unknown>;
    const safeUser = { ...userDoc };
    delete (safeUser as Record<string, unknown> & { password?: unknown }).password;

    console.log("[users:PATCH] Update success", {
      updatedUserId: (safeUser as { _id?: unknown })?._id,
      updatedAt: update.updatedAt,
    });
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    console.error("[users:PATCH] ERROR", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}