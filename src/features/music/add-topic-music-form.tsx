"use client";

import { useEffect, useState } from "react";
import { useIsAdmin } from "@/hooks/use-permissions";
import { useRouter } from "next/navigation";

interface Music {
  id?: string;
  _id?: string | { toString: () => string };
  title: string;
  singer: string;
}

type TopicItem = {
  id: string;
  title: string;
  cover: string;
  musicIds: string[];
};

export function AddTopicMusicForm() {
  const isAdmin = useIsAdmin();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");

  const [musics, setMusics] = useState<Music[]>([]);
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSynchronized, setIsSynchronized] = useState(true);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);

  const normalizeId = (value: unknown) => {
    if (typeof value === "string") return value;
    if (
      value &&
      typeof (value as { toString?: () => string }).toString === "function"
    ) {
      return (value as { toString: () => string }).toString();
    }
    return "";
  };

  const resetForm = () => {
    setTitle("");
    setCover("");
    setSelectedIds([]);
    setEditingTopicId(null);
  };

  const fetchMusics = async () => {
    const res = await fetch("/api/musics");
    const data = await res.json();
    const normalized = Array.isArray(data)
      ? data.map((m: Music & { _id?: unknown }) => {
          let idValue = "";
          if (m.id && typeof m.id === "string") {
            idValue = m.id;
          } else if (m._id) {
            if (typeof m._id === "string") {
              idValue = m._id;
            } else if (typeof m._id === "object" && m._id !== null) {
              const idObj = m._id as Record<string, unknown>;
              if (typeof idObj.toString === "function") {
                idValue = idObj.toString();
              } else if ("$oid" in idObj) {
                idValue = String(idObj.$oid);
              } else if ("_str" in idObj) {
                idValue = String(idObj._str);
              }
            }
          }
          return { ...m, id: idValue };
        })
      : [];
    setMusics(normalized);
    setIsSynchronized(true);
  };

  const fetchTopics = async () => {
    const res = await fetch("/api/topics");
    if (!res.ok) return;
    const data = await res.json();
    const mapped = Array.isArray(data)
      ? data.map((item: Record<string, unknown>) => {
          const rawMusicIds = Array.isArray(item.musicIds)
            ? item.musicIds
            : Array.isArray(item.musics)
              ? item.musics
              : [];
          const musicIds = rawMusicIds
            .map((entry) => {
              if (typeof entry === "string") return entry;
              if (entry && typeof entry === "object") {
                const record = entry as Record<string, unknown>;
                return normalizeId(record.id) || normalizeId(record._id);
              }
              return "";
            })
            .filter(Boolean);
          return {
            id: normalizeId(item.id) || normalizeId(item._id),
            title: String(item.title ?? ""),
            cover: String(item.cover ?? ""),
            musicIds,
          };
        })
      : [];
    setTopics(mapped.filter((topic: TopicItem) => topic.id));
  };

  useEffect(() => {
    if (!isAdmin) {
      router.push("/music");
      return;
    }

    (async () => {
      try {
        await Promise.all([fetchMusics(), fetchTopics()]);
      } catch (err) {
        console.error("Error fetching data:", err);
        setMessage("❌ Không lấy được dữ liệu");
        setIsSynchronized(false);
      }
    })();
  }, [isAdmin, router]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAdmin) {
    return (
      <div style={{ padding: 20, maxWidth: 500 }}>
        <h2>Không có quyền truy cập</h2>
        <p>Chỉ admin mới có quyền quản lý topic.</p>
      </div>
    );
  }

  const toggleMusic = (id: string) => {
    setSelectedIds((prev) => {
      const newIds = prev.includes(id)
        ? prev.filter((mid) => mid !== id)
        : [...prev, id];
      return newIds;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!isSynchronized) {
      setMessage("❌ Danh sách bài hát chưa được đồng bộ");
      setLoading(false);
      return;
    }

    if (selectedIds.length === 0) {
      setMessage("⚠️ Vui lòng chọn ít nhất một bài hát");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        title,
        cover,
        musicIds: selectedIds,
      };
      const endpoint = editingTopicId ? `/api/topics/${editingTopicId}` : "/api/topics";
      const method = editingTopicId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Error");
      } else {
        setMessage(editingTopicId ? "✅ Cập nhật topic thành công" : "✅ Tạo topic thành công");
        resetForm();
        await fetchTopics();
      }
    } catch (err) {
      console.error("Submit error:", err);
      setMessage("❌ Không kết nối được server");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTopic = (topic: TopicItem) => {
    setEditingTopicId(topic.id);
    setTitle(topic.title);
    setCover(topic.cover);
    setSelectedIds(topic.musicIds);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm("Bạn có chắc muốn xóa topic này?")) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/topics/${topicId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(data.error || "❌ Xóa topic thất bại");
      } else {
        setMessage("✅ Xóa topic thành công");
        if (editingTopicId === topicId) {
          resetForm();
        }
        await fetchTopics();
      }
    } catch (err) {
      console.error("Delete topic error:", err);
      setMessage("❌ Không kết nối được server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500 }}>
      <h2>{editingTopicId ? "Sửa Topic" : "Tạo Topic"}</h2>

      {!isSynchronized && (
        <p style={{ color: "orange", marginBottom: 12 }}>
          Đồng bộ chưa xong...
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%" }}
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Cover URL</label>
          <input
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            style={{ width: "100%" }}
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <strong>Chọn bài hát</strong>

          {musics.length === 0 && <p>Chưa có bài hát</p>}

          <ul style={{ listStyle: "none", padding: 0 }}>
            {musics.map((m) => {
              const musicId = m.id || "";
              return (
                <li key={musicId}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(musicId)}
                      onChange={() => toggleMusic(musicId)}
                    />{" "}
                    {m.title} – {m.singer}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        <button type="submit" disabled={loading || !isSynchronized}>
          {loading
            ? "Đang lưu..."
            : editingTopicId
              ? "Lưu thay đổi"
              : "Create Topic"}
        </button>
        {editingTopicId && (
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: 8 }}
          >
            Hủy chỉnh sửa
          </button>
        )}
      </form>

      {message && <p style={{ marginTop: 12 }}>{message}</p>}

      <div style={{ marginTop: 20 }}>
        <h3>Danh sách topic</h3>
        {topics.length === 0 ? (
          <p>Chưa có topic</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {topics.map((topic) => (
              <li
                key={topic.id}
                style={{
                  marginBottom: 8,
                  border: "1px solid #d4d4d8",
                  borderRadius: 10,
                  padding: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{topic.title}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    {topic.musicIds.length} bài hát
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => handleEditTopic(topic)}
                    style={{ color: "#2563eb" }}
                  >
                    Sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTopic(topic.id)}
                    style={{ color: "#e11d48" }}
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
