/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useUser } from "@/hooks/use-user";
import { buildUserAuthHeaders } from "@/lib/client-auth";
import { HeaderMusicPage } from "../music/header-music-page";
import { MenuBar } from "../music/menu-bar";

import { BorderPro } from "../music/component/border-pro";
import { useImageHoverColor } from "@/hooks/use-image-hover-color";
import { Check, Copy } from "@phosphor-icons/react/dist/ssr";

type CurrentUser = {
  id: string; // string version of MongoDB ObjectId
  username: string;
  email?: string;
  friendCode?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  favoriteGenres?: string;
  favoriteArtists?: string;
};

type ResolvedCurrentUser = CurrentUser;

// Minimum shape of a MongoDB user document we expect from useUser()
type MongoUserDocish = {
  _id?: string | { toString?: () => string };
  id?: string;
  username?: string;
  email?: string;
  friendCode?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  favoriteGenres?: string;
  favoriteArtists?: string;
  image?: string; // Google avatar field
};

export default function ProfileSettings() {
  const { user } = useUser();
  const { data: session } = useSession();
  type SessionUserShape = {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    friendCode?: string | null;
  };
  const sessionUser = session?.user as SessionUserShape | undefined;

  const current = useMemo<CurrentUser | null>(() => {
    const u = (user as MongoUserDocish | null) ?? null;
    const id =
      typeof u?.id === "string"
        ? u.id
        : typeof u?._id === "string"
          ? u._id
          : String(u?._id || sessionUser?.id || "");
    const username =
      u?.username || sessionUser?.name || sessionUser?.email || "";

    if (!id || !username) return null;

    return {
      id,
      username,
      email: u?.email || sessionUser?.email || "",
      friendCode: u?.friendCode || sessionUser?.friendCode || "",
      displayName: u?.displayName || sessionUser?.name || "",
      bio: u?.bio || "",
      avatarUrl: u?.avatarUrl || u?.image || sessionUser?.image || "",
      location: u?.location || "",
      favoriteGenres: u?.favoriteGenres || "",
      favoriteArtists: u?.favoriteArtists || "",
    };
  }, [sessionUser, user]);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [location, setLocation] = useState("");
  const [favoriteGenres, setFavoriteGenres] = useState("");
  const [favoriteArtists, setFavoriteArtists] = useState("");
  const [resolvedFriendCode, setResolvedFriendCode] = useState("");
  const [isFriendCodeCopied, setIsFriendCodeCopied] = useState(false);
  const [resolvedCurrentUser, setResolvedCurrentUser] =
    useState<ResolvedCurrentUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const source = resolvedCurrentUser ?? current;
    if (!source) return;

    setDisplayName(source.displayName || source.username || "");
    setBio(source.bio || "");
    setAvatarUrl(source.avatarUrl || "");
    setLocation(source.location || "");
    setFavoriteGenres(source.favoriteGenres || "");
    setFavoriteArtists(source.favoriteArtists || "");
    setResolvedFriendCode(source.friendCode || "");
  }, [current, resolvedCurrentUser]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!current?.id) return;

      try {
        const response = await fetch("/api/users/me", {
          headers: buildUserAuthHeaders(current.id),
        });
        const data = (await response.json()) as {
          user?: ResolvedCurrentUser;
        };

        if (response.ok && data.user) {
          setResolvedCurrentUser(data.user);
          setResolvedFriendCode(data.user.friendCode || "");
        }
      } catch (error) {
        console.error("Failed to resolve current user:", error);
      }
    };

    void fetchCurrentUser();
  }, [current?.id]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setMessage("");
      const qs = new URLSearchParams({
        fileName: file.name,
        contentType: file.type,
      });
      const res = await fetch(`/api/upload-avatar?${qs.toString()}`);
      if (!res.ok) throw new Error("Failed to get upload URL");
      const { presignedUrl, publicUrl } = (await res.json()) as {
        presignedUrl: string;
        publicUrl: string;
      };
      const putRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Failed to upload avatar");
      setAvatarUrl(publicUrl);
      setMessage("Avatar uploaded successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to upload image.");
    }
  };

  const handleSave = async () => {
    const activeUser = resolvedCurrentUser ?? current;
    if (!activeUser?.id) {
      setMessage("Please sign in again (missing user id).");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const payload = {
        userId: activeUser.id,
        lookupUsername: activeUser.username,
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim(),
        location: location.trim(),
        favoriteGenres: favoriteGenres.trim(),
        favoriteArtists: favoriteArtists.trim(),
      };

      const res = await fetch(
        `/api/users/${encodeURIComponent(activeUser.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Update failed");
      }

      setResolvedCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              displayName: displayName.trim(),
              bio: bio.trim(),
              avatarUrl: avatarUrl.trim(),
              location: location.trim(),
              favoriteGenres: favoriteGenres.trim(),
              favoriteArtists: favoriteArtists.trim(),
            }
          : prev
      );
      setMessage("Profile updated successfully 🎉");
    } catch (err) {
      console.error(err);
      setMessage("Update failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyFriendCode = async () => {
    if (!resolvedFriendCode) {
      setMessage("Friend code is not available yet.");
      return;
    }

    try {
      await navigator.clipboard.writeText(resolvedFriendCode);
      setIsFriendCodeCopied(true);
      setMessage("Friend code copied.");
      window.setTimeout(() => {
        setIsFriendCodeCopied(false);
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage("Could not copy friend code.");
    }
  };

  const bg = useImageHoverColor(avatarUrl, { alpha: 0.5 });

  return (
    <div className="font-apple">
      <MenuBar />

      <div className="md:hidden">
        <HeaderMusicPage />
      </div>

      <div className="relative z-30 mx-4 mt-4 space-y-4 rounded-3xl border px-4 py-8 font-apple shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:ml-[270px]">
        <div
          className="absolute left-0 top-0 -z-10 h-44 w-full rounded-t-3xl"
          style={{
            background: bg,
          }}
        >
          <div className="absolute -bottom-7 right-2 z-10 flex items-center gap-1">
            <div className="text-xs font-medium text-zinc-400">
              {resolvedFriendCode}
            </div>

            <button
              type="button"
              onClick={handleCopyFriendCode}
              className="rounded-full p-1 text-xs transition hover:bg-black/5 dark:hover:bg-white/10"
            >
              {isFriendCodeCopied ? (
                <>
                  <Check className="size-4 text-green-500" weight="bold" />
                </>
              ) : (
                <>
                  <Copy className="size-4" weight="bold" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="pointer-events-none mb-4 space-y-4">
          <div className="mx-auto size-40 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            {avatarUrl ? (
              <BorderPro roundedSize="rounded-full">
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="size-40 object-cover"
                  onError={(e) => {
                    console.error("Avatar image failed to load:", avatarUrl);
                    e.currentTarget.style.display = "none";
                  }}
                />
              </BorderPro>
            ) : (
              <div className="flex size-40 items-center justify-center text-zinc-500">
                <span>Avatar</span>
              </div>
            )}
          </div>

          <input type="file" accept="image/*" onChange={handleAvatarChange} />

          {sessionUser?.image && !avatarUrl && (
            <p className="text-xs text-zinc-500">
              Avatar from Google: {sessionUser.image.substring(0, 50)}...
            </p>
          )}
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-sm text-zinc-500">Username</label>
          <input
            className="w-full rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            value={current?.username || ""}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-sm text-zinc-500">Email</label>
          <input
            className="w-full rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            value={current?.email || ""}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-sm text-zinc-500">
            Display name
          </label>

          <input
            className="w-full rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display name"
          />
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-sm text-zinc-500">Location</label>
          <input
            className="w-full rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ho Chi Minh City, Vietnam"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm text-zinc-500">
            Favorite genres
          </label>
          <input
            className="w-full rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            value={favoriteGenres}
            onChange={(e) => setFavoriteGenres(e.target.value)}
            placeholder="Pop, Lofi, Indie"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm text-zinc-500">
            Favorite artists
          </label>
          <textarea
            className="w-full rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            value={favoriteArtists}
            onChange={(e) => setFavoriteArtists(e.target.value)}
            rows={3}
            placeholder="Sơn Tùng M-TP, Taylor Swift, Da LAB"
          />
        </div>

        <div className="mb-2">
          <label className="mb-1 block text-sm text-zinc-500">Bio</label>

          <textarea
            className="shadow-s w-full rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Short bio"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition-opacity dark:bg-white dark:text-black ${
            isSaving ? "opacity-50" : ""
          }`}
        >
          {isSaving ? "Saving..." : "Save changes"}
        </button>

        {message && <div className="mt-3 text-sm text-zinc-500">{message}</div>}
      </div>
    </div>
  );
}
