"use client";
import { useState } from "react";
import { Footer } from "../profile/footer";
import { TableRanking } from "./table-ranking";
import { SingerList } from "./singer-list";
import { HeaderMusicPage } from "./header-music-page";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    let audioUrl = form.audio;
    let coverUrl = form.cover;

    // Nếu có file mp3, upload lên R2 trước
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload-music", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (uploadData.url) {
        audioUrl = uploadData.url;
      } else {
        setMessage("Upload mp3 thất bại!");
        return;
      }
    }

    // Nếu có file ảnh, upload lên R2 trước
    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      const uploadRes = await fetch("/api/upload-music", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (uploadData.url) {
        coverUrl = uploadData.url;
      } else {
        setMessage("Upload ảnh thất bại!");
        return;
      }
    }

    // Gửi thông tin bài hát (audio là link vừa upload hoặc nhập tay)
    const res = await fetch("/api/musics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, audio: audioUrl, cover: coverUrl }),
    });
    const data = await res.json();
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
      setMessage("Có lỗi xảy ra!");
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
                className="rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
              />

              <input
                name="singer"
                placeholder="Ca sĩ"
                value={form.singer}
                onChange={handleChange}
                required
                className="rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
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
                className="rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="rounded-xl border bg-zinc-100 px-4 py-2 shadow-sm dark:border-zinc-900 dark:bg-zinc-900"
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
                className="rounded-xl border bg-zinc-100 px-4 py-2 shadow-sm dark:border-zinc-900 dark:bg-zinc-900"
              />
            )}

            <input
              type="file"
              accept=".mp3"
              onChange={handleFileChange}
              className="rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
            />

            <input
              name="youtube"
              placeholder="Link Youtube"
              value={form.youtube}
              onChange={handleChange}
              className="rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
            />

            <input
              name="type"
              placeholder="Thể loại"
              value={form.type}
              onChange={handleChange}
              className="rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
            />

            <textarea
              name="content"
              placeholder="Nội dung"
              value={form.content}
              onChange={handleChange}
              className="rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
            />

            <div className="space-y-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-zinc-900 px-4 py-2 font-semibold text-white"
              >
                Thêm bài hát
              </button>

              <div className="flex justify-between gap-2">
                <div className="w-full rounded-xl border border-blue-600 px-8 py-2 text-center font-semibold">
                  Sửa
                </div>

                <div className="w-full rounded-xl border border-red-600 px-8 py-2 text-center font-semibold">
                  Xóa
                </div>
              </div>
            </div>
            {message && <p>{message}</p>}
          </div>
        </form>
      </div>

      <div className="mb-8">
        <Footer />
      </div>
    </div>
  );
}
