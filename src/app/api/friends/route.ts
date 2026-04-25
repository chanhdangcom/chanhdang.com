import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/lib/auth-helpers";
import {
  ensureUserSocialFields,
  getRelationshipStatus,
  normalizeStringArray,
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
};

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    const users = db.collection<UserSocialDocument>("users");

    const friendIds = normalizeStringArray(currentUser.friends)
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));

    const rawFriends = friendIds.length
      ? await users.find({ _id: { $in: friendIds } }).toArray()
      : [];
    const friendsRaw = await Promise.all(
      rawFriends.map((user) => ensureUserSocialFields(db, user))
    );
    const friends = friendsRaw.filter(
      (user): user is NonNullable<typeof user> => Boolean(user)
    );

    return NextResponse.json({
      success: true,
      friends: friends.map((user) => ({
        ...toPublicUser(user),
        relationshipStatus: getRelationshipStatus(currentUser, user),
      })),
    });
  } catch (error) {
    console.error("[friends] ERROR", error);
    return NextResponse.json(
      { error: "Failed to fetch friends" },
      { status: 500 }
    );
  }
}
