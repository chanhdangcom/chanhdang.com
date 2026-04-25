import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth-helpers";
import {
  ensureUserSocialFields,
  getRelationshipStatus,
  toPublicUser,
} from "@/lib/social-graph";

type UserPublicDocument = {
  _id: string;
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
    const { searchParams } = new URL(request.url);
    const friendCode = searchParams.get("friendCode")?.trim().toUpperCase();

    if (!friendCode) {
      return NextResponse.json(
        { error: "Thiếu mã kết bạn" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    const users = db.collection<UserPublicDocument>("users");
    const rawUser = await users.findOne({
      friendCode,
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
    console.error("[users:search] ERROR", error);
    return NextResponse.json(
      { error: "Failed to search user" },
      { status: 500 }
    );
  }
}
