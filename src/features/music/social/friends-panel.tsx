"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { buildUserAuthHeaders } from "@/lib/client-auth";
import { Ping } from "@/components/ping";

type FriendUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  friendCode: string;
  relationshipStatus: "incoming" | "outgoing" | "friends" | "none" | "self";
};

type FriendRequestsResponse = {
  incoming: FriendUser[];
  outgoing: FriendUser[];
};

type FriendsResponse = {
  friends: FriendUser[];
};

function UserRow({
  user,
  action,
  secondaryAction,
}: {
  user: FriendUser;
  action?: ReactNode;
  secondaryAction?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border p-2 dark:border-zinc-800">
      <div className="flex items-center gap-1">
        <div className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="size-12 object-cover"
            />
          ) : (
            <span className="text-xs text-zinc-500">Avatar</span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-1 truncate p-1 font-medium">
            <Ping />
            {user.displayName || user.username}
          </div>

          <div className="truncate p-1 text-sm text-zinc-500">
            @{user.username}
          </div>

          <div className="p-1 text-xs text-zinc-400">{user.friendCode}</div>
        </div>
      </div>

      {action || secondaryAction ? (
        <div className="flex flex-wrap gap-2">
          {action}

          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}

export function FriendsPanel() {
  const { user } = useUser();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [incoming, setIncoming] = useState<FriendUser[]>([]);
  const [outgoing, setOutgoing] = useState<FriendUser[]>([]);
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  const loadSocialData = useCallback(async () => {
    if (!user?.id) {
      setIncoming([]);
      setOutgoing([]);
      setFriends([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const [requestsResponse, friendsResponse] = await Promise.all([
        fetch("/api/friends/requests", {
          headers: buildUserAuthHeaders(user.id),
        }),
        fetch("/api/friends", {
          headers: buildUserAuthHeaders(user.id),
        }),
      ]);

      const requestsData =
        (await requestsResponse.json()) as Partial<FriendRequestsResponse> & {
          error?: string;
        };
      const friendsData =
        (await friendsResponse.json()) as Partial<FriendsResponse> & {
          error?: string;
        };

      if (!requestsResponse.ok) {
        throw new Error(requestsData.error || "Failed to load friend requests");
      }
      if (!friendsResponse.ok) {
        throw new Error(friendsData.error || "Failed to load friends");
      }

      setIncoming(requestsData.incoming ?? []);
      setOutgoing(requestsData.outgoing ?? []);
      setFriends(friendsData.friends ?? []);
    } catch (error) {
      console.error("Error loading social graph:", error);
      setMessage("Could not load friends right now.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void loadSocialData();
  }, [loadSocialData]);

  const handleRequestAction = async (
    endpoint: "/api/friends/accept" | "/api/friends/reject",
    requesterUserId: string
  ) => {
    if (!user?.id) return;

    setActiveUserId(requesterUserId);
    setMessage("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: buildUserAuthHeaders(user.id, {
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ requesterUserId }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to update friend request");
      }

      await loadSocialData();
    } catch (error) {
      console.error("Error handling friend request:", error);
      setMessage("Could not update friend request.");
    } finally {
      setActiveUserId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-sm font-medium text-zinc-500">
          Incoming requests
        </div>

        {isLoading ? (
          <div className="text-sm text-zinc-500">Loading requests...</div>
        ) : incoming.length === 0 ? (
          <div className="text-sm text-zinc-500">No incoming requests yet.</div>
        ) : (
          <div className="space-y-3 rounded-2xl bg-white dark:bg-zinc-950">
            {incoming.map((requestUser) => (
              <UserRow
                key={requestUser.id}
                user={requestUser}
                action={
                  <button
                    type="button"
                    disabled={activeUserId === requestUser.id}
                    onClick={() =>
                      handleRequestAction("/api/friends/accept", requestUser.id)
                    }
                    className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
                  >
                    Accept
                  </button>
                }
                secondaryAction={
                  <button
                    type="button"
                    disabled={activeUserId === requestUser.id}
                    onClick={() =>
                      handleRequestAction("/api/friends/reject", requestUser.id)
                    }
                    className="rounded-xl border px-4 py-2 text-sm font-medium dark:border-zinc-800"
                  >
                    Reject
                  </button>
                }
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-2 text-sm font-semibold text-zinc-500">
          Pending requests
        </div>

        {isLoading ? (
          <div className="text-sm text-zinc-500">
            Loading pending requests...
          </div>
        ) : outgoing.length === 0 ? (
          <div className="text-sm text-zinc-500">No pending requests.</div>
        ) : (
          <div className="space-y-3 bg-white dark:bg-zinc-950">
            {outgoing.map((requestUser) => (
              <UserRow key={requestUser.id} user={requestUser} />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-2 text-sm font-semibold text-zinc-500">Friends</div>

        {isLoading ? (
          <div className="text-sm text-zinc-500">Loading friends...</div>
        ) : friends.length === 0 ? (
          <div className="text-sm text-zinc-500">
            You have not connected with anyone yet.
          </div>
        ) : (
          <div className="space-y-3 rounded-2xl bg-white dark:bg-zinc-950">
            {friends.map((friend) => (
              <UserRow
                key={friend.id}
                user={friend}
                action={
                  <Link
                    href={`/${locale}/music/friends/${friend.id}/library`}
                    className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
                  >
                    View library
                  </Link>
                }
              />
            ))}
          </div>
        )}
      </div>

      {message ? <div className="text-sm text-rose-500">{message}</div> : null}
    </div>
  );
}
