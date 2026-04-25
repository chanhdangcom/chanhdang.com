import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/lib/auth-helpers";
import {
  ensureUserSocialFields,
  getRelationshipStatus,
  toPublicUser,
} from "@/lib/social-graph";

type UserSocialDocument = {
  _id: ObjectId;
  username?: string;
  displayName?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  image?: string;
  friendCode?: string;
  incomingFriendRequests?: string[];
  outgoingFriendRequests?: string[];
  friends?: string[];
};

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetUserId } = (await request.json()) as { targetUserId?: string };
    if (!targetUserId || !ObjectId.isValid(targetUserId)) {
      return NextResponse.json(
        { error: "Invalid target user" },
        { status: 400 }
      );
    }

    const currentUserId = currentUser._id.toString();
    if (currentUserId === targetUserId) {
      return NextResponse.json(
        { error: "Bạn không thể tự kết bạn với chính mình" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    const users = db.collection<UserSocialDocument>("users");
    const rawTargetUser = await users.findOne({
      _id: new ObjectId(targetUserId),
    });

    if (!rawTargetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const targetUser = await ensureUserSocialFields(db, rawTargetUser);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const relationshipStatus = getRelationshipStatus(currentUser, targetUser);

    if (relationshipStatus === "friends") {
      return NextResponse.json(
        { error: "Hai user đã là bạn bè" },
        { status: 400 }
      );
    }

    if (relationshipStatus === "outgoing") {
      return NextResponse.json(
        { error: "Lời mời kết bạn đã được gửi trước đó" },
        { status: 400 }
      );
    }

    if (relationshipStatus === "incoming") {
      return NextResponse.json(
        { error: "User này đã gửi lời mời cho bạn" },
        { status: 400 }
      );
    }

    await Promise.all([
      users.updateOne(
        { _id: new ObjectId(currentUserId) },
        {
          $addToSet: { outgoingFriendRequests: targetUserId },
          $set: { updatedAt: new Date() },
        }
      ),
      users.updateOne(
        { _id: new ObjectId(targetUserId) },
        {
          $addToSet: { incomingFriendRequests: currentUserId },
          $set: { updatedAt: new Date() },
        }
      ),
    ]);

    return NextResponse.json({
      success: true,
      user: {
        ...toPublicUser(targetUser),
        relationshipStatus: "outgoing",
      },
    });
  } catch (error) {
    console.error("[friends:request] ERROR", error);
    return NextResponse.json(
      { error: "Failed to send friend request" },
      { status: 500 }
    );
  }
}
