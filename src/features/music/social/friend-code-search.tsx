"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useUser } from "@/hooks/use-user";
import { buildUserAuthHeaders } from "@/lib/client-auth";
import { MagnifyingGlass, UserPlus, X } from "@phosphor-icons/react/dist/ssr";
import { Ping } from "@/components/ping";

type RelationshipStatus = "self" | "none" | "incoming" | "outgoing" | "friends";

type FriendLookupUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  friendCode: string;
  relationshipStatus: RelationshipStatus;
};

const getRelationshipLabel = (status: RelationshipStatus) => {
  switch (status) {
    case "self":
      return "This is your profile";
    case "incoming":
      return "This user sent you a friend request";
    case "outgoing":
      return "Friend request sent";
    case "friends":
      return "You are already friends";
    default:
      return "Ready to connect";
  }
};

export function FriendCodeSearch() {
  const { user } = useUser();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [isOpen, setIsOpen] = useState(false);
  const [friendCode, setFriendCode] = useState("");
  const [result, setResult] = useState<FriendLookupUser | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const normalizedFriendCode = useMemo(
    () => friendCode.trim().toUpperCase(),
    [friendCode]
  );

  const searchUser = async () => {
    if (!normalizedFriendCode) {
      setError("Please enter a friend code.");
      setResult(null);
      return;
    }

    setIsSearching(true);
    setError("");

    try {
      const response = await fetch(
        `/api/users/search?friendCode=${encodeURIComponent(normalizedFriendCode)}`,
        {
          headers: buildUserAuthHeaders(user?.id),
        }
      );
      const data = (await response.json()) as {
        user?: FriendLookupUser;
        error?: string;
      };

      if (!response.ok || !data.user) {
        setResult(null);
        setError(data.error || "User not found.");
        return;
      }

      setResult(data.user);
    } catch (searchError) {
      console.error("Error searching by friend code:", searchError);
      setError("Could not search friend code right now.");
    } finally {
      setIsSearching(false);
    }
  };

  const updateRelationship = async (
    endpoint:
      | "/api/friends/request"
      | "/api/friends/accept"
      | "/api/friends/reject",
    body: Record<string, string>,
    nextStatus: RelationshipStatus
  ) => {
    if (!user?.id || !result) {
      setError("Please sign in to use friend code search.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: buildUserAuthHeaders(user.id, {
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(body),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error || "Could not update friend request.");
        return;
      }

      setResult({
        ...result,
        relationshipStatus: nextStatus,
      });
    } catch (requestError) {
      console.error("Error updating friendship:", requestError);
      setError("Could not update friend request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setError("");
        }}
        className="z-50 flex size-12 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm transition hover:scale-105 dark:border-zinc-800 dark:bg-zinc-800"
        aria-label="Add friend by code"
        title="Add friend by code"
      >
        <UserPlus size={20} weight="bold" className="text-rose-500" />
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-100 p-5 shadow-xl backdrop-blur-xl dark:bg-zinc-950">
            <div className="flex items-start justify-between gap-4">
              <div className="text-lg font-semibold">Find friends by code</div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-zinc-500"
              >
                <X size={15} weight="bold" />
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <input
                className="w-full rounded-3xl border px-2 py-2 shadow-sm focus:outline-none dark:border-zinc-800 dark:bg-zinc-900"
                placeholder="AB12CD34"
                value={friendCode}
                onChange={(event) =>
                  setFriendCode(event.target.value.toUpperCase())
                }
                autoFocus
              />

              <button
                type="button"
                onClick={searchUser}
                disabled={isSearching}
                className="rounded-full bg-black p-4 text-sm font-semibold text-white dark:bg-white dark:text-black"
              >
                {isSearching ? (
                  "Searching..."
                ) : (
                  <MagnifyingGlass size={20} weight="bold" />
                )}
              </button>
            </div>

            {error ? (
              <div className="mt-3 text-sm text-rose-500">{error}</div>
            ) : null}

            {result ? (
              <div className="mt-4 rounded-3xl border bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="flex size-14 items-center justify-center overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    {result.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={result.avatarUrl}
                        alt={result.displayName}
                        className="size-14 object-cover"
                      />
                    ) : (
                      <span className="text-xs text-zinc-500">Avatar</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">
                      {result.displayName || result.username}
                    </div>
                    <div className="truncate text-sm text-zinc-500">
                      @{result.username}
                    </div>
                    <div className="text-xs text-zinc-400">
                      Friend code: {result.friendCode}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-zinc-500">
                  <Ping />
                  {getRelationshipLabel(result.relationshipStatus)}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {result.relationshipStatus === "none" ? (
                    <button
                      type="button"
                      disabled={isSubmitting || !user?.id}
                      onClick={() =>
                        updateRelationship(
                          "/api/friends/request",
                          { targetUserId: result.id },
                          "outgoing"
                        )
                      }
                      className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
                    >
                      Send request
                    </button>
                  ) : null}

                  {result.relationshipStatus === "incoming" ? (
                    <>
                      <button
                        type="button"
                        disabled={isSubmitting || !user?.id}
                        onClick={() =>
                          updateRelationship(
                            "/api/friends/accept",
                            { requesterUserId: result.id },
                            "friends"
                          )
                        }
                        className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
                      >
                        Accept
                      </button>

                      <button
                        type="button"
                        disabled={isSubmitting || !user?.id}
                        onClick={() =>
                          updateRelationship(
                            "/api/friends/reject",
                            { requesterUserId: result.id },
                            "none"
                          )
                        }
                        className="rounded-xl border px-4 py-2 text-sm font-medium dark:border-zinc-800"
                      >
                        Reject
                      </button>
                    </>
                  ) : null}

                  {result.relationshipStatus === "friends" ? (
                    <Link
                      href={`/${locale}/music/friends/${result.id}/library`}
                      className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
                      onClick={() => setIsOpen(false)}
                    >
                      View library
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
