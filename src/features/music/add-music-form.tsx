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
    const res = await fetch("/api/musics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
    } else {
      setMessage("Có lỗi xảy ra!");
    }
  };

  return (
    <div>
      <div>
        <HeaderMusicPage />
      </div>

      <div className="container flex md:justify-between">
        <div className="my-8 hidden w-[90vh] md:block">
          <TableRanking />
          <SingerList />
        </div>

        <form className="mb-16 space-y-8 font-apple" onSubmit={handleSubmit}>
          <div className="my-8 text-center text-3xl font-bold">
            Thêm bài hát mới
          </div>

          <div className="mx-auto flex w-full flex-col space-y-4">
            <div className="flex justify-between gap-4">
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
                className="dark:bg-zinc-95 rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
              />
            </div>

            <input
              name="cover"
              placeholder="Link ảnh cover"
              value={form.cover}
              onChange={handleChange}
              required
              className="dark:bg-zinc-95 rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
            />

            <input
              name="audio"
              placeholder="Link audio"
              value={form.audio}
              onChange={handleChange}
              required
              className="dark:bg-zinc-95 rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
            />

            <input
              name="youtube"
              placeholder="Link Youtube"
              value={form.youtube}
              onChange={handleChange}
              className="dark:bg-zinc-95 rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
            />

            <input
              name="type"
              placeholder="Thể loại"
              value={form.type}
              onChange={handleChange}
              className="dark:bg-zinc-95 rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
            />

            <textarea
              name="content"
              placeholder="Nội dung"
              value={form.content}
              onChange={handleChange}
              className="dark:bg-zinc-95 rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
            />

            <div className="space-y-2">
              <button
                type="submit"
                className="w-full rounded-xl bg-zinc-900 px-4 py-2 font-semibold text-white"
              >
                Thêm bài hát
              </button>

              <div className="flex justify-between gap-2">
                <div className="w-full rounded-xl bg-blue-700 px-8 py-2 text-center font-semibold text-white">
                  Sửa
                </div>

                <div className="w-full rounded-xl bg-red-700 px-8 py-2 text-center font-semibold text-white">
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
