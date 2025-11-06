"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/use-user";
import { HeaderMusicPage } from "../music/header-music-page";

type ExtendedUser = {
  id: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
};

export default function ProfileSettings() {
  const { user, login } = useUser();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string>("");

  // Prefill từ user
  useEffect(() => {
    if (user) {
      const u = user as unknown as ExtendedUser;
      setDisplayName(u.displayName || u.username || "");
      setBio(u.bio || "");
      setAvatarUrl(u.avatarUrl || "");
    }
  }, [user]);

  // Upload avatar lên Cloudflare R2 (hoặc S3)
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
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
      setMessage("Ảnh đại diện đã tải lên thành công!");
    } catch (err) {
      console.error(err);
      setMessage("Không thể tải ảnh lên.");
    }
  };

  // Cập nhật hồ sơ user
  const handleSave = async () => {
    if (!user?.id) {
      setMessage("Bạn cần đăng nhập lại (thiếu user id).");
      return;
    }
    setIsSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(user.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, bio, avatarUrl }),
      });

      const text = await res.text();
      console.log("📦 Raw response:", text);

      type ApiUser = {
        _id?: string;
        id?: string;
        username?: string;
        displayName?: string;
        bio?: string;
        avatarUrl?: string;
      };
      type UpdateResponse = {
        success?: boolean;
        user?: ApiUser;
        error?: string;
      };

      const data: UpdateResponse = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Cập nhật thất bại");
      }
      if (!data.user) throw new Error("Không nhận được dữ liệu người dùng");

      const updated = data.user;

      // Cập nhật lại thông tin trong hook useUser()
      login({
        id: updated._id || updated.id || user.id,
        username: updated.username || user.username,
      });

      // Đồng bộ localStorage (giữ các field mới)
      const raw = localStorage.getItem("user");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...parsed,
              displayName: updated.displayName,
              bio: updated.bio,
              avatarUrl: updated.avatarUrl,
            })
          );
        } catch {}
      }

      setMessage("Cập nhật hồ sơ thành công 🎉");
    } catch (err) {
      console.error(err);
      setMessage("Cập nhật thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container font-apple">
      <HeaderMusicPage />
      <div className="left-6 z-30 mx-4 space-y-4 rounded-3xl border border-zinc-300 bg-gradient-to-tr from-transparent to-black/10 p-4 font-apple backdrop-blur-2xl dark:border-zinc-700 dark:to-white/10 md:mx-72">
        <h3 className="mb-4 text-center text-3xl font-semibold">
          Cập nhật hồ sơ
        </h3>

        <div className="mb-4 space-y-4">
          <div className="mx-auto size-40 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            {avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="avatar"
                className="size-40 object-cover"
              />
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-sm text-zinc-500">
            Tên hiển thị
          </label>
          <input
            className="w-full rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Tên hiển thị"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm text-zinc-500">Giới thiệu</label>
          <textarea
            className="shadow-s w-full rounded-xl border px-4 py-2 dark:border-zinc-900 dark:bg-zinc-950"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Giới thiệu ngắn"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition-opacity dark:bg-white dark:text-black ${
            isSaving ? "opacity-50" : ""
          }`}
        >
          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>

        {message && <div className="mt-3 text-sm text-zinc-500">{message}</div>}
      </div>
    </div>
  );
}
