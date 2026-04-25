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
  friends?: string[];
  incomingFriendRequests?: string[];
  outgoingFriendRequests?: string[];
};

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requesterUserId } = (await request.json()) as {
      requesterUserId?: string;
    };
    if (!requesterUserId || !ObjectId.isValid(requesterUserId)) {
      return NextResponse.json(
        { error: "Invalid requester user" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    const users = db.collection<UserSocialDocument>("users");
    const rawRequesterUser = await users.findOne({
      _id: new ObjectId(requesterUserId),
    });

    if (!rawRequesterUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const requesterUser = await ensureUserSocialFields(db, rawRequesterUser);
    if (!requesterUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const relationshipStatus = getRelationshipStatus(currentUser, requesterUser);

    if (relationshipStatus !== "incoming") {
      return NextResponse.json(
        { error: "Không có lời mời kết bạn hợp lệ" },
        { status: 400 }
      );
    }

    const currentUserId = currentUser._id.toString();

    await Promise.all([
      users.updateOne(
        { _id: new ObjectId(currentUserId) },
        {
          $pull: { incomingFriendRequests: requesterUserId },
          $addToSet: { friends: requesterUserId },
          $set: { updatedAt: new Date() },
        }
      ),
      users.updateOne(
        { _id: new ObjectId(requesterUserId) },
        {
          $pull: { outgoingFriendRequests: currentUserId },
          $addToSet: { friends: currentUserId },
          $set: { updatedAt: new Date() },
        }
      ),
    ]);

    return NextResponse.json({
      success: true,
      user: {
        ...toPublicUser(requesterUser),
        relationshipStatus: "friends",
      },
    });
  } catch (error) {
    console.error("[friends:accept] ERROR", error);
    return NextResponse.json(
      { error: "Failed to accept friend request" },
      { status: 500 }
    );
  }
}
