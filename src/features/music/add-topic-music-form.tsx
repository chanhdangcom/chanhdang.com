"use client";

import { useEffect, useState } from "react";

interface Music {
  id?: string;
  _id?: string | { toString: () => string };
  title: string;
  singer: string;
}

export function AddTopicMusicForm() {
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");

  const [musics, setMusics] = useState<Music[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSynchronized, setIsSynchronized] = useState(false);

  // 🔹 Lấy danh sách bài hát và kiểm tra đồng bộ
  useEffect(() => {
    fetch("/api/musics")
      .then((res) => res.json())
      .then((data) => {
        console.log("Raw data from API:", data);
        console.log("First music item:", data[0]);

        // Normalize: convert _id to id (string) nếu cần
        const normalized = Array.isArray(data)
          ? data.map((m: Music & { _id?: unknown }) => {
              // Xử lý _id từ MongoDB ObjectId
              let idValue = "";

              // Kiểm tra m.id trước
              if (m.id && typeof m.id === "string") {
                idValue = m.id;
              }
              // Kiểm tra m._id
              else if (m._id) {
                const idType = typeof m._id;
                console.log("Processing _id:", {
                  _id: m._id,
                  type: idType,
                  title: m.title,
                });

                if (idType === "string") {
                  idValue = m._id as string;
                }
                // ObjectId object có method toString()
                else if (idType === "object" && m._id !== null) {
                  const idObj = m._id as Record<string, unknown>;
                  // Thử toString() nếu có
                  if (typeof idObj.toString === "function") {
                    idValue = idObj.toString();
                  }
                  // MongoDB extended JSON format { $oid: "..." }
                  else if ("$oid" in idObj) {
                    idValue = String(idObj.$oid);
                  }
                  // ObjectId có thể có các property khác
                  else if ("_str" in idObj) {
                    idValue = String(idObj._str);
                  } else {
                    // Fallback: stringify và parse lại
                    const str = JSON.stringify(m._id);
                    console.warn("Unknown _id format, stringified:", str);
                    idValue = str;
                  }
                }
              }

              if (!idValue) {
                console.error("Could not extract ID from music:", m);
              }

              const normalizedItem = {
                ...m,
                id: idValue,
              };

              console.log("Normalized music:", {
                original_id: m._id,
                normalized_id: idValue,
                title: m.title,
                final_item: normalizedItem,
              });

              return normalizedItem;
            })
          : [];
        console.log("Normalized musics count:", normalized.length);
        console.log(
          "Sample normalized IDs:",
          normalized.slice(0, 3).map((m) => m.id)
        );
        setMusics(normalized);
        setIsSynchronized(true);
      })
      .catch((err) => {
        console.error("Error fetching musics:", err);
        setMessage("❌ Không lấy được danh sách bài hát");
        setIsSynchronized(false);
      });
  }, []);

  // 🔹 Check / uncheck bài hát
  const toggleMusic = (id: string) => {
    console.log("Toggling music ID:", id);
    setSelectedIds((prev) => {
      const newIds = prev.includes(id)
        ? prev.filter((mid) => mid !== id)
        : [...prev, id];
      console.log("Selected IDs after toggle:", newIds);
      return newIds;
    });
  };

  // 🔹 Submit form
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
      console.log("=== SUBMITTING FORM ===");
      console.log("selectedIds:", selectedIds);
      console.log("selectedIds length:", selectedIds.length);
      console.log(
        "selectedIds types:",
        selectedIds.map((id) => ({ id, type: typeof id }))
      );

      const payload = {
        title,
        cover,
        musicIds: selectedIds,
      };
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!res.ok) {
        setMessage(data.error || "Error");
      } else {
        setMessage(
          `✅ Tạo topic thành công (${data.musicsCount || 0} bài hát)`
        );
        setTitle("");
        setCover("");
        setSelectedIds([]);
      }
    } catch (err) {
      console.error("Submit error:", err);
      setMessage("❌ Không kết nối được server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500 }}>
      <h2>Tạo Topic</h2>

      {!isSynchronized && (
        <p style={{ color: "orange", marginBottom: 12 }}>
          Đồng bộ chưa xong...
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div style={{ marginBottom: 12 }}>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%" }}
            required
          />
        </div>

        {/* Cover */}
        <div style={{ marginBottom: 12 }}>
          <label>Cover URL</label>
          <input
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            style={{ width: "100%" }}
            required
          />
        </div>

        {/* Music list */}
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
          {loading ? "Đang tạo..." : "Create Topic"}
        </button>
      </form>

      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
}
