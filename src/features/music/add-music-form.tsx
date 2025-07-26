"use client";
import { useState } from "react";
import { Footer } from "../profile/footer";
import { TableRanking } from "./table-ranking";
import { SingerList } from "./singer-list";
import { HeaderMusicPage } from "./header-music-page";
import { Button } from "@/components/ui/button";

export default function AddMusicForm() {
  const [form, setForm] = useState({
    title: "",
    singer: "",
    cover: "",
    audio: "",
    youtube: "",
    content: "",
    type: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      let audioUrl = form.audio;
      let coverUrl = form.cover;

      // Nếu có file mp3, upload lên R2 trước
      if (file) {
        // 1. Lấy presigned URL
        const presignedRes = await fetch(
          `/api/upload-music?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`
        );
        const { presignedUrl, publicUrl } = await presignedRes.json();

        // 2. Upload trực tiếp lên R2
        const uploadRes = await fetch(presignedUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (uploadRes.ok) {
          audioUrl = publicUrl;
        } else {
          setMessage("Upload mp3 thất bại!");
          setIsLoading(false);
          return;
        }
      }

      // Nếu có file ảnh, upload lên R2 trước
      if (imageFile) {
        const presignedRes = await fetch(
          `/api/upload-music?fileName=${encodeURIComponent(imageFile.name)}&contentType=${encodeURIComponent(imageFile.type)}`
        );
        const { presignedUrl, publicUrl } = await presignedRes.json();

        const uploadRes = await fetch(presignedUrl, {
          method: "PUT",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        });

        if (uploadRes.ok) {
          coverUrl = publicUrl;
        } else {
          setMessage("Upload ảnh thất bại!");
          setIsLoading(false);
          return;
        }
      }

      // Gửi thông tin bài hát (audio là link vừa upload hoặc nhập tay)
      const bodyData = { ...form, audio: audioUrl, cover: coverUrl };
      console.log("Gửi lên API /api/musics:", bodyData);

      const res = await fetch("/api/musics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const data = await res.json();
      console.log("Kết quả trả về từ /api/musics:", data);

      if (data.success) {
        setMessage("Thêm bài hát thành công!");
        setForm({
          title: "",
          singer: "",
          cover: "",
          audio: "",
          youtube: "",
          content: "",
          type: "",
        });
        setFile(null);
        setImageFile(null);
      } else {
        setMessage("Có lỗi xảy ra! " + (data.error || ""));
      }
    } catch {
      setMessage("Có lỗi xảy ra khi thêm bài hát!");
    } finally {
      setIsLoading(false);
    }
  };

  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div>
      <div>
        <HeaderMusicPage />
      </div>

      <div className="container md:flex md:justify-between">
        <div className="my-8 hidden w-[90vh] md:block">
          <TableRanking />
          <SingerList />
        </div>

        <form className="mb-16 space-y-8 font-apple" onSubmit={handleSubmit}>
          <div className="my-8 text-center text-3xl font-bold">
            Thêm bài hát mới
          </div>

          <div className="mx-auto flex w-full flex-col space-y-4">
            <div className="mx-auto flex w-full flex-col justify-between gap-4 md:flex-row">
              <input
                name="title"
                placeholder="Tên bài hát"
                value={form.title}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
              />

              <input
                name="singer"
                placeholder="Ca sĩ"
                value={form.singer}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
              />
            </div>

            {imageFile ? (
              <div className="font-semibold text-green-600">
                Đã chọn file ảnh: {imageFile.name}
              </div>
            ) : (
              <input
                name="cover"
                placeholder="Link ảnh cover hoặc chọn file bên dưới"
                value={form.cover}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isLoading}
              className="rounded-xl border bg-zinc-100 px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-900"
            />

            {/* Nếu đã chọn file mp3 thì ẩn input nhập link audio */}
            {file ? (
              <div className="font-semibold text-green-600">
                Đã chọn file mp3: {file.name}
              </div>
            ) : (
              <input
                name="audio"
                placeholder="Link audio (.mp3) hoặc chọn file bên dưới"
                value={form.audio}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="rounded-xl border bg-zinc-100 px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-900"
              />
            )}

            <input
              type="file"
              accept=".mp3"
              onChange={handleFileChange}
              disabled={isLoading}
              className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
            />

            <input
              name="youtube"
              placeholder="Link Youtube"
              value={form.youtube}
              onChange={handleChange}
              disabled={isLoading}
              className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
            />

            <input
              name="type"
              placeholder="Thể loại"
              value={form.type}
              onChange={handleChange}
              disabled={isLoading}
              className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
            />

            <textarea
              name="content"
              placeholder="Nội dung"
              value={form.content}
              onChange={handleChange}
              disabled={isLoading}
              className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
            />

            <div className="space-y-2">
              <Button
                type="submit"
                variant="liquid"
                size="lg"
                loading={isLoading}
                loadingText="Đang thêm bài hát..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-800"
              >
                Thêm bài hát
              </Button>

              <div className="flex justify-between gap-2">
                <div className="w-full rounded-xl border border-blue-600 px-8 py-2 text-center font-semibold">
                  Sửa
                </div>

                <div className="w-full rounded-xl border border-red-600 px-8 py-2 text-center font-semibold">
                  Xóa
                </div>
              </div>
            </div>
            {message && <p className="text-center font-semibold">{message}</p>}
          </div>
        </form>
      </div>

      <div className="mb-8">
        <Footer />
      </div>
    </div>
  );
}
