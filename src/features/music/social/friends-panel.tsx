/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { buildUserAuthHeaders } from "@/lib/client-auth";
import { Ping } from "@/components/ping";
import { FriendCodeSearch } from "./friend-code-search";
import { BorderPro } from "../component/border-pro";

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
  const [isHover, setIsHover] = useState(false);
  const totalRequests = incoming.length + outgoing.length;
  const previewFriends = friends.slice(0, 3);
  const collapsedWidth = 64;
  const collapsedHeight = 232;
  const expandedWidth = 384;
  const expandedHeight = 560;

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
    <div className="relative mx-4">
      <motion.div
        initial={false}
        animate={{
          width: isHover ? expandedWidth : collapsedWidth,
          height: isHover ? expandedHeight : collapsedHeight,
          boxShadow: isHover
            ? "0 20px 40px rgba(0, 0, 0, 0.18)"
            : "0 4px 14px rgba(0, 0, 0, 0.08)",
          borderRadius: isHover ? 28 : 32,
        }}
        transition={{
          width: {
            type: "spring",
            stiffness: 240,
            damping: 24,
          },
          height: {
            type: "spring",
            stiffness: 210,
            damping: 26,
          },
          boxShadow: {
            duration: 0.24,
          },
          borderRadius: {
            duration: 0.24,
          },
        }}
        style={{ transformOrigin: "bottom right" }}
        className="fixed bottom-1/2 right-2 z-50 translate-y-1/2 overflow-hidden border border-zinc-200 bg-white/80 p-2 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className="relative flex h-full items-end justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {isHover ? (
              <motion.div
                key="expanded"
                initial={{
                  opacity: 0,
                  scale: 0.92,
                  clipPath: "inset(78% 0% 0% 76% round 28px)",
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  clipPath: "inset(0% 0% 0% 0% round 28px)",
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                  clipPath: "inset(72% 0% 0% 70% round 28px)",
                }}
                transition={{
                  duration: 0.34,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformOrigin: "bottom right" }}
                className="absolute inset-0 min-w-0 p-4"
                aria-hidden={!isHover}
              >
                <div className="h-full space-y-4 overflow-y-auto">
                  <div className="flex items-center justify-between gap-3">
                    <div className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                      {totalRequests} requests
                    </div>

                    <div>
                      <FriendCodeSearch />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 text-sm font-medium text-zinc-500">
                      Incoming requests
                    </div>

                    {isLoading ? (
                      <div className="text-sm text-zinc-500">
                        Loading requests...
                      </div>
                    ) : incoming.length === 0 ? (
                      <div className="text-sm text-zinc-500">
                        No incoming requests yet.
                      </div>
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
                                  handleRequestAction(
                                    "/api/friends/accept",
                                    requestUser.id
                                  )
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
                                  handleRequestAction(
                                    "/api/friends/reject",
                                    requestUser.id
                                  )
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
                      <div className="text-sm text-zinc-500">
                        No pending requests.
                      </div>
                    ) : (
                      <div className="space-y-3 bg-white dark:bg-zinc-950">
                        {outgoing.map((requestUser) => (
                          <UserRow key={requestUser.id} user={requestUser} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-2 text-sm font-semibold text-zinc-500">
                      Friends
                    </div>

                    {isLoading ? (
                      <div className="text-sm text-zinc-500">
                        Loading friends...
                      </div>
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

                  {message ? (
                    <div className="text-sm text-rose-500">{message}</div>
                  ) : null}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 8 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "bottom right" }}
                className="flex h-full w-14 shrink-0 flex-col items-center justify-center"
              >
                {isLoading ? (
                  <div className="text-center text-[11px] text-zinc-500">
                    Loading...
                  </div>
                ) : previewFriends.length === 0 ? (
                  <div className="text-center text-[11px] leading-tight text-zinc-500">
                    No friends
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="flex flex-col items-center justify-center">
                      {previewFriends.map((friend) => (
                        <div
                          key={friend.id}
                          className="flex size-12 items-center justify-center overflow-hidden rounded-full"
                          title={friend.displayName || friend.username}
                        >
                          {friend.avatarUrl ? (
                            <>
                              <BorderPro roundedSize="rounded-full">
                                <img
                                  src={friend.avatarUrl}
                                  alt={friend.displayName || friend.username}
                                  className="size-full object-cover"
                                />
                              </BorderPro>
                            </>
                          ) : (
                            <span>
                              {(friend.displayName || friend.username)
                                .slice(0, 1)
                                .toUpperCase()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="scale-90">
                      <FriendCodeSearch />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
