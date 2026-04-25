import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/lib/auth-helpers";
import {
  ensureUserSocialFields,
  getRelationshipStatus,
  toPublicUser,
} from "@/lib/social-graph";

type UserPublicDocument = {
  _id: ObjectId;
  username?: string;
  displayName?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  image?: string;
  friendCode?: string;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const userIdFromPath = pathParts[pathParts.length - 1];

    if (!ObjectId.isValid(userIdFromPath)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    const users = db.collection<UserPublicDocument>("users");
    const rawUser = await users.findOne({
      _id: new ObjectId(userIdFromPath),
    });

    if (!rawUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const targetUser = await ensureUserSocialFields(db, rawUser);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const currentUser = await getCurrentUser(request);

    return NextResponse.json({
      success: true,
      user: {
        ...toPublicUser(targetUser),
        relationshipStatus: getRelationshipStatus(currentUser, targetUser),
      },
    });
  } catch (error) {
    console.error("[users:GET] ERROR", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PATCH /api/users/:id
export async function PATCH(request: Request) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const userIdFromPath = pathParts[pathParts.length - 1];

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
      location,
      favoriteGenres,
      favoriteArtists,
      isPremium,
      isPremiumCreator,
      userId: bodyUserId,
      lookupUsername: bodyLookupUsername,
    } = payload ?? {};

    // Build object update
    const update: Record<string, unknown> = {};
    if (typeof username === "string") update.username = username;
    if (typeof displayName === "string") update.displayName = displayName;
    if (typeof bio === "string") update.bio = bio;
    if (typeof avatarUrl === "string") update.avatarUrl = avatarUrl;
    if (typeof location === "string") update.location = location;
    if (typeof favoriteGenres === "string")
      update.favoriteGenres = favoriteGenres;
    if (typeof favoriteArtists === "string")
      update.favoriteArtists = favoriteArtists;
    if (typeof isPremium === "boolean") update.isPremium = isPremium;
    if (typeof isPremiumCreator === "boolean")
      update.isPremiumCreator = isPremiumCreator;
    update.updatedAt = new Date();

    console.log("[users:PATCH] Built update object", update);

    // Kiểm tra nếu không có gì để update
    if (Object.keys(update).length === 1 && update.updatedAt) {
      console.warn("[users:PATCH] No valid fields to update", {
        userId: userIdFromPath,
      });
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    const users = db.collection("users");

    // Đơn giản hoá filter: ưu tiên _id từ body.userId (admin UI luôn gửi),
    // sau đó tới id trên URL, cuối cùng mới fallback theo username.
    let filter: Record<string, unknown> | null = null;
    if (typeof bodyUserId === "string" && ObjectId.isValid(bodyUserId)) {
      filter = { _id: new ObjectId(bodyUserId) };
    } else if (userIdFromPath && ObjectId.isValid(userIdFromPath)) {
      filter = { _id: new ObjectId(userIdFromPath) };
    } else if (typeof bodyLookupUsername === "string" && bodyLookupUsername.trim()) {
      filter = { username: bodyLookupUsername.trim() };
    } else if (userIdFromPath) {
      filter = {
        username: { $regex: new RegExp(`^${userIdFromPath}$`, "i") },
      };
    }

    if (!filter) {
      console.warn("[users:PATCH] No valid filter built", {
        userIdFromPath,
        bodyUserId,
        bodyLookupUsername,
      });
      return NextResponse.json(
        { error: "No valid identifier to update user" },
        { status: 400 }
      );
    }

    console.log("[users:PATCH] Computed filter", filter);

    // Cập nhật user
    const result = await users.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );

    if (!result?.value) {
      console.warn("[users:PATCH] User not found for filter", filter);
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