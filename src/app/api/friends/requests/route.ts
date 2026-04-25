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
  incomingFriendRequests?: string[];
  outgoingFriendRequests?: string[];
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

    const incomingIds = normalizeStringArray(currentUser.incomingFriendRequests)
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));
    const outgoingIds = normalizeStringArray(currentUser.outgoingFriendRequests)
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));

    const [rawIncomingUsers, rawOutgoingUsers] = await Promise.all([
      incomingIds.length
        ? users.find({ _id: { $in: incomingIds } }).toArray()
        : Promise.resolve([]),
      outgoingIds.length
        ? users.find({ _id: { $in: outgoingIds } }).toArray()
        : Promise.resolve([]),
    ]);

    const [incomingUsersRaw, outgoingUsersRaw] = await Promise.all([
      Promise.all(rawIncomingUsers.map((user) => ensureUserSocialFields(db, user))),
      Promise.all(rawOutgoingUsers.map((user) => ensureUserSocialFields(db, user))),
    ]);
    const incomingUsers = incomingUsersRaw.filter(
      (user): user is NonNullable<typeof user> => Boolean(user)
    );
    const outgoingUsers = outgoingUsersRaw.filter(
      (user): user is NonNullable<typeof user> => Boolean(user)
    );

    return NextResponse.json({
      success: true,
      incoming: incomingUsers.map((user) => ({
        ...toPublicUser(user),
        relationshipStatus: getRelationshipStatus(currentUser, user),
      })),
      outgoing: outgoingUsers.map((user) => ({
        ...toPublicUser(user),
        relationshipStatus: getRelationshipStatus(currentUser, user),
      })),
    });
  } catch (error) {
    console.error("[friends:requests] ERROR", error);
    return NextResponse.json(
      { error: "Failed to fetch friend requests" },
      { status: 500 }
    );
  }
}
