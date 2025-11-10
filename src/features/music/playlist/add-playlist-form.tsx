"use client";
import { useState, useEffect } from "react";

type MusicLite = {
  id: string;
  title: string;
};

export function AddPlaylistForm() {
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  const [singer, setSinger] = useState("");
  const [allMusics, setAllMusics] = useState<MusicLite[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/musics", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const mapped = Array.isArray(data)
            ? data
                .map((m: Record<string, unknown>) => ({
                  id:
                    typeof m._id === "string"
                      ? m._id
                      : ((
                          m._id as { toString?: () => string } | undefined
                        )?.toString?.() ?? String(m.id ?? "")),
                  title: String(m.title ?? ""),
                }))
                .filter((x: MusicLite) => x.id && x.title)
            : [];
          if (isMounted) setAllMusics(mapped);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const canSubmit = title.trim() && cover.trim();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          cover: cover.trim(),
          singer: singer.trim(),
          musicIds: selectedIds,
        }),
      });
      if (res.ok) {
        setMessage("Tạo playlist thành công");
        setTitle("");
        setCover("");
        setSinger("");
        setSelectedIds([]);
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data?.error || "Tạo playlist thất bại");
      }
    } catch {
      setMessage("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:ml-[270px]">
      <h1 className="mb-4 text-xl font-semibold text-black dark:text-white">
        Thêm Playlist
      </h1>

      <form onSubmit={onSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="block text-sm text-zinc-500">Tiêu đề</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-transparent p-2 outline-none dark:border-zinc-800"
            placeholder="Chill Mix, Top RAP..."
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-500">Ảnh cover (URL)</label>
          <input
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-transparent p-2 outline-none dark:border-zinc-800"
            placeholder="https://cdn.chanhdang.com/xxx.jpg"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-500">
            Ghi chú người biên tập (tuỳ chọn)
          </label>
          <input
            value={singer}
            onChange={(e) => setSinger(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-transparent p-2 outline-none dark:border-zinc-800"
            placeholder="Various, Editor note..."
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-500">
            Chọn bài hát (tuỳ chọn)
          </label>
          <div className="mt-2 max-h-64 overflow-auto rounded-lg border border-zinc-300 p-2 dark:border-zinc-800">
            {allMusics.length === 0 && (
              <div className="text-sm text-zinc-500">Chưa có bài hát</div>
            )}
            {allMusics.map((m) => {
              const checked = selectedIds.includes(m.id);
              return (
                <label
                  key={m.id}
                  className="flex cursor-pointer items-center gap-2 rounded-md p-1 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSelect(m.id)}
                  />
                  <span className="text-sm">{m.title}</span>
                </label>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="rounded-2xl bg-zinc-200 px-4 py-2 font-semibold text-blue-600 disabled:opacity-50 dark:bg-zinc-900 dark:text-blue-400"
        >
          {loading ? "Đang lưu..." : "Tạo Playlist"}
        </button>
      </form>

      {message && (
        <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          {message}
        </div>
      )}
    </div>
  );
}
