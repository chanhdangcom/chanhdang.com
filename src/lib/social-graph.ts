import { Db, ObjectId } from "mongodb";

export type LibraryVisibility = "friends";

export type RelationshipStatus =
  | "self"
  | "none"
  | "incoming"
  | "outgoing"
  | "friends";

type SocialUserShape = {
  _id?: ObjectId | string;
  username?: string;
  displayName?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  image?: string;
  friendCode?: string;
  friends?: unknown;
  incomingFriendRequests?: unknown;
  outgoingFriendRequests?: unknown;
  libraryVisibility?: unknown;
};

export const DEFAULT_LIBRARY_VISIBILITY: LibraryVisibility = "friends";
const FRIEND_CODE_LENGTH = 8;
const FRIEND_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function normalizeId(value: ObjectId | string | null | undefined) {
  if (!value) return "";
  return typeof value === "string" ? value : value.toString();
}

export function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

function generateFriendCodeCandidate() {
  return Array.from({ length: FRIEND_CODE_LENGTH }, () => {
    const index = Math.floor(Math.random() * FRIEND_CODE_ALPHABET.length);
    return FRIEND_CODE_ALPHABET[index];
  }).join("");
}

export async function createUniqueFriendCode(db: Db) {
  for (let attempts = 0; attempts < 20; attempts += 1) {
    const friendCode = generateFriendCodeCandidate();
    const existingUser = await db.collection("users").findOne(
      { friendCode },
      { projection: { _id: 1 } }
    );

    if (!existingUser) {
      return friendCode;
    }
  }

  throw new Error("Unable to generate unique friend code");
}

export async function ensureUserSocialFields<T extends SocialUserShape>(
  db: Db,
  user: T | null
) {
  if (!user?._id) return user;

  const updates: Record<string, unknown> = {};
  if (typeof user.friendCode !== "string" || !user.friendCode.trim()) {
    updates.friendCode = await createUniqueFriendCode(db);
  }
  if (!Array.isArray(user.friends)) {
    updates.friends = [];
  }
  if (!Array.isArray(user.incomingFriendRequests)) {
    updates.incomingFriendRequests = [];
  }
  if (!Array.isArray(user.outgoingFriendRequests)) {
    updates.outgoingFriendRequests = [];
  }
  if (user.libraryVisibility !== DEFAULT_LIBRARY_VISIBILITY) {
    updates.libraryVisibility = DEFAULT_LIBRARY_VISIBILITY;
  }

  if (Object.keys(updates).length > 0) {
    await db.collection("users").updateOne(
      { _id: new ObjectId(normalizeId(user._id)) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      }
    );
  }

  return {
    ...user,
    friendCode: String(updates.friendCode ?? user.friendCode ?? ""),
    friends: normalizeStringArray(updates.friends ?? user.friends),
    incomingFriendRequests: normalizeStringArray(
      updates.incomingFriendRequests ?? user.incomingFriendRequests
    ),
    outgoingFriendRequests: normalizeStringArray(
      updates.outgoingFriendRequests ?? user.outgoingFriendRequests
    ),
    libraryVisibility: String(
      updates.libraryVisibility ?? user.libraryVisibility ?? DEFAULT_LIBRARY_VISIBILITY
    ) as LibraryVisibility,
  };
}

export function areUsersFriends(
  owner: Pick<SocialUserShape, "_id" | "friends"> | null,
  requester: Pick<SocialUserShape, "_id" | "friends"> | null
) {
  if (!owner?._id || !requester?._id) return false;

  const ownerId = normalizeId(owner._id);
  const requesterId = normalizeId(requester._id);
  const ownerFriends = normalizeStringArray(owner.friends);
  const requesterFriends = normalizeStringArray(requester.friends);

  return (
    ownerFriends.includes(requesterId) || requesterFriends.includes(ownerId)
  );
}

export function getRelationshipStatus(
  currentUser:
    | Pick<
        SocialUserShape,
        "_id" | "friends" | "incomingFriendRequests" | "outgoingFriendRequests"
      >
    | null,
  targetUser:
    | Pick<
        SocialUserShape,
        "_id" | "friends" | "incomingFriendRequests" | "outgoingFriendRequests"
      >
    | null
): RelationshipStatus {
  if (!currentUser?._id || !targetUser?._id) return "none";

  const currentUserId = normalizeId(currentUser._id);
  const targetUserId = normalizeId(targetUser._id);

  if (currentUserId === targetUserId) return "self";
  if (areUsersFriends(currentUser, targetUser)) return "friends";

  const currentIncoming = normalizeStringArray(currentUser.incomingFriendRequests);
  const currentOutgoing = normalizeStringArray(currentUser.outgoingFriendRequests);
  const targetIncoming = normalizeStringArray(targetUser.incomingFriendRequests);
  const targetOutgoing = normalizeStringArray(targetUser.outgoingFriendRequests);

  if (
    currentIncoming.includes(targetUserId) ||
    targetOutgoing.includes(currentUserId)
  ) {
    return "incoming";
  }

  if (
    currentOutgoing.includes(targetUserId) ||
    targetIncoming.includes(currentUserId)
  ) {
    return "outgoing";
  }

  return "none";
}

export function toPublicUser(
  user: Pick<
    SocialUserShape,
    | "_id"
    | "username"
    | "displayName"
    | "name"
    | "email"
    | "avatarUrl"
    | "image"
    | "friendCode"
  >
) {
  const pickFirstNonEmpty = (...values: Array<string | null | undefined>) =>
    values.find((value) => typeof value === "string" && value.trim())?.trim() ||
    "";

  const emailHandle =
    typeof user.email === "string" && user.email.includes("@")
      ? user.email.split("@")[0]
      : "";
  const normalizedUsername =
    pickFirstNonEmpty(user.username, emailHandle, user.displayName, user.name) ||
    "user";
  const normalizedDisplayName =
    pickFirstNonEmpty(user.displayName, user.name, normalizedUsername) || "User";

  return {
    id: normalizeId(user._id),
    username: normalizedUsername || "user",
    displayName: normalizedDisplayName || normalizedUsername || "User",
    avatarUrl: String(user.avatarUrl ?? user.image ?? ""),
    friendCode: String(user.friendCode ?? ""),
  };
}
