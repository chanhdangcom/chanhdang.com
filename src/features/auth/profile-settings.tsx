"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useUser } from "@/hooks/use-user";
import { HeaderMusicPage } from "../music/header-music-page";

type CurrentUser = {
  id: string; // string version of MongoDB ObjectId
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
};

// Minimum shape of a MongoDB user document we expect from useUser()
type MongoUserDocish = {
  _id?: string | { toString?: () => string };
  id?: string;
  username?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  image?: string; // Google avatar field
};

export default function ProfileSettings() {
  const { user } = useUser();
  const { data: session } = useSession();

  const current = useMemo<CurrentUser | null>(() => {
    if (session?.user) {
      return {
        id: session.user.id || "",
        username: session.user.name || session.user.email || "",
        displayName: session.user.name || "",
        bio: "",
        avatarUrl: session.user.image || "",
      };
    }

    if (!user) return null;
    const u = user as MongoUserDocish;
    const id = typeof u.id === "string" ? u.id : String(u._id || "");
    if (!id || !u.username) return null;

    return {
      id,
      username: u.username,
      displayName: u.displayName || "",
      bio: u.bio || "",
      avatarUrl: u.avatarUrl || u.image || "",
    };
  }, [user, session]);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!current) return;
    setDisplayName(current.displayName || current.username || "");
    setBio(current.bio || "");
    setAvatarUrl(current.avatarUrl || "");
  }, [current]);

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
    if (!current?.id) {
      setMessage("Please sign in again (missing user id).");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const payload = {
        userId: current.id,
        lookupUsername: current.username,
        displayName: displayName.trim(),
        bio,
        avatarUrl: avatarUrl.trim(),
      };

      const res = await fetch(`/api/users/${encodeURIComponent(current.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Update failed");
      }

      setMessage("Profile updated successfully 🎉");
    } catch (err) {
      console.error(err);
      setMessage("Update failed.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container font-apple">
      <HeaderMusicPage />
      <div className="left-6 z-30 mx-4 space-y-4 rounded-3xl border border-zinc-300 dark:border-zinc-800 bg-gradient-to-tr from-transparent to-black/10 p-4 font-apple backdrop-blur-2xl dark:to-white/10 md:mx-72">
        <h3 className="mb-4 text-center text-3xl font-semibold">
          Update profile
        </h3>

        <div className="mb-4 space-y-4">
          <div className="mx-auto size-40 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="avatar"
                className="size-40 object-cover"
                onError={(e) => {
                  console.error("Avatar image failed to load:", avatarUrl);
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex size-40 items-center justify-center text-zinc-500">
                <span>Avatar</span>
              </div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          {session?.user?.image && !avatarUrl && (
            <p className="text-xs text-zinc-500">
              Avatar from Google: {session.user.image.substring(0, 50)}...
            </p>
          )}
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-sm text-zinc-500">
            Display name
          </label>
          <input
            className="w-full rounded-xl border border-zinc-300 dark:border-zinc-800 px-4 py-2 shadow-sm dark:bg-zinc-950"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display name"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm text-zinc-500">Bio</label>
          <textarea
            className="shadow-s w-full rounded-xl border border-zinc-300 dark:border-zinc-800 px-4 py-2 dark:bg-zinc-950"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Short bio"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition-opacity dark:bg-white dark:text-black ${
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
