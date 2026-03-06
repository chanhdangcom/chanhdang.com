"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useIsAdmin } from "@/hooks/use-permissions";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { MenuBar } from "../menu-bar";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/components/music-provider";

type MusicWithMeta = IMusic & {
  addedBy?: string | null;
};

export function MusicApproval() {
  const isAdmin = useIsAdmin();
  const router = useRouter();
  const [musics, setMusics] = useState<MusicWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { handlePlayAudio } = useAudio();

  useEffect(() => {
    if (!isAdmin) {
      router.push("/music");
      return;
    }
    void fetchPendingMusics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const fetchPendingMusics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/musics?status=pending", {
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error("Không thể tải danh sách bài chờ duyệt");
      }
      const data = (await res.json()) as MusicWithMeta[];
      setMusics(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    music: MusicWithMeta,
    status: "approved" | "rejected"
  ) => {
    if (status === "rejected") {
      const confirmed = window.confirm(
        `Bạn chắc chắn muốn từ chối bài "${music.title}"?`
      );
      if (!confirmed) return;
    }

    try {
      setUpdatingId(music.id);
      const res = await fetch(`/api/musics/${music.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Không thể cập nhật trạng thái bài hát");
      }
      setMusics((prev) => prev.filter((item) => item.id !== music.id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi cập nhật"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="mx-4 py-8 md:ml-[270px]">
      <MenuBar />

      <div className="w-full max-w-4xl space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Duyệt bài hát mới
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Các bài hát do user thêm sẽ hiển thị ở đây để admin duyệt trước khi
            xuất hiện công khai trên hệ thống.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
            Đang tải danh sách bài chờ duyệt...
          </div>
        ) : musics.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
            Hiện không có bài hát nào đang chờ duyệt.
          </div>
        ) : (
          <div className="space-y-3">
            {musics.map((music) => (
              <div
                key={music.id}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-base font-semibold text-black dark:text-white">
                      {music.title}
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      {music.singer}
                    </div>
                    {music.addedBy && (
                      <div className="mt-1 text-xs text-zinc-500">
                        Thêm bởi user:{" "}
                        <span className="font-mono">{music.addedBy}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 flex gap-2 md:mt-0">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={updatingId === music.id}
                      onClick={() => handlePlayAudio(music)}
                      className="rounded-full border border-zinc-300 px-4 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
                    >
                      Nghe thử
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={updatingId === music.id}
                      onClick={() => updateStatus(music, "rejected")}
                      className="rounded-full border border-rose-500 px-4 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400"
                    >
                      Từ chối
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      disabled={updatingId === music.id}
                      onClick={() => updateStatus(music, "approved")}
                      className="rounded-full bg-emerald-500 px-4 py-1 text-xs font-semibold text-white hover:bg-emerald-600"
                    >
                      {updatingId === music.id
                        ? "Đang cập nhật..."
                        : "Duyệt đăng"}
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Chủ đề: {music.topic || "—"} · Thể loại: {music.type || "—"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
