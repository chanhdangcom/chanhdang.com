"use client";

import { useState, useEffect } from "react";
import { ISingerItem } from "./type/singer";
// import { IMusic } from "@/app/[locale]/features/profile /types/music";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Plus, Music } from "lucide-react";

type IProp = {
  singerId?: string;
};

export function AddMusicToSinger({ singerId }: IProp) {
  const [singers, setSingers] = useState<ISingerItem[]>([]);
  const [selectedSingerId, setSelectedSingerId] = useState(singerId || "");
  // const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    audio: "",
    cover: "",
    youtube: "",
    content: "",
  });

  useEffect(() => {
    fetchSingers();
    if (singerId) {
      setSelectedSingerId(singerId);
    }
  }, [singerId]);

  const fetchSingers = async () => {
    try {
      const response = await fetch("/api/singers");
      const data = await response.json();
      setSingers(data);
    } catch (error) {
      console.error("Error fetching singers:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSingerId) {
      alert("Vui lòng chọn ca sĩ");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/singers/${selectedSingerId}/musics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // const result = await response.json();
        alert("Thêm nhạc thành công!");
        setFormData({
          title: "",
          audio: "",
          cover: "",
          youtube: "",
          content: "",
        });
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add music");
      }
    } catch (error) {
      console.error("Error adding music:", error);
      alert("Failed to add music");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music size={20} />
          Thêm Nhạc vào Ca sĩ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="singer" className="text-sm font-medium">
              Chọn Ca sĩ
            </label>
            <select
              id="singer"
              value={selectedSingerId}
              onChange={(e) => setSelectedSingerId(e.target.value)}
              disabled={!!singerId}
              className="border-input focus-visible:ring-ring w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Chọn ca sĩ</option>
              {singers.map((singer) => (
                <option
                  key={singer._id || singer.id}
                  value={singer._id || singer.id}
                >
                  {singer.singer}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="text-sm font-medium">
              Tên Bài Hát
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Nhập tên bài hát"
              required
            />
          </div>

          <div>
            <label htmlFor="audio" className="text-sm font-medium">
              URL File Nhạc
            </label>
            <Input
              id="audio"
              value={formData.audio}
              onChange={(e) =>
                setFormData({ ...formData, audio: e.target.value })
              }
              placeholder="https://example.com/music.mp3"
              required
            />
          </div>

          <div>
            <label htmlFor="cover" className="text-sm font-medium">
              URL Ảnh Bìa
            </label>
            <Input
              id="cover"
              value={formData.cover}
              onChange={(e) =>
                setFormData({ ...formData, cover: e.target.value })
              }
              placeholder="https://example.com/cover.jpg"
              required
            />
          </div>

          <div>
            <label htmlFor="youtube" className="text-sm font-medium">
              URL YouTube (tùy chọn)
            </label>
            <Input
              id="youtube"
              value={formData.youtube}
              onChange={(e) =>
                setFormData({ ...formData, youtube: e.target.value })
              }
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div>
            <label htmlFor="content" className="text-sm font-medium">
              Lời Bài Hát (tùy chọn)
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Nhập lời bài hát..."
              className="border-input placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting || !selectedSingerId}
            className="flex w-full items-center gap-2"
          >
            <Plus size={16} />
            {submitting ? "Đang thêm..." : "Thêm Nhạc"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
