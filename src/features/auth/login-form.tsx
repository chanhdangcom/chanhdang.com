"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Footer } from "../profile/footer";
import { useUser } from "@/hooks/use-user";
import { HeaderMusicPage } from "../music/header-music-page";
export default function LoginForm() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { login } = useUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Đăng nhập thành công!");
      // Sử dụng hook useUser để login
      login(data.user);
      setForm({ username: "", password: "" });
      router.push("/music");
    } else {
      setMessage(data.error || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="container">
      <HeaderMusicPage name="Login" />

      <form
        className="left-6 z-30 mx-4 my-8 space-y-4 rounded-3xl border border-zinc-300 bg-gradient-to-tr from-transparent to-black/10 p-4 font-apple backdrop-blur-2xl dark:border-zinc-700 dark:to-white/10 md:mx-0"
        onSubmit={handleSubmit}
      >
        <div className="text-center text-3xl font-bold">Đăng Nhập</div>

        <div className="mx-auto flex flex-col space-y-4 md:w-96">
          <input
            name="username"
            placeholder="Tên đăng nhập"
            value={form.username}
            onChange={handleChange}
            required
            className="dark:bg-zinc-95 rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
          />

          <input
            name="password"
            type="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            required
            className="dark:bg-zinc-95 rounded-xl border px-4 py-2 shadow-sm dark:border-zinc-900 dark:bg-zinc-950"
          />

          <button
            type="submit"
            className="rounded-xl bg-zinc-900 px-4 py-2 text-white"
          >
            Đăng nhập
          </button>

          <div className="text-center text-sm text-blue-600 hover:underline">
            Đăng ký tại đây
          </div>

          {message && <p>{message}</p>}
        </div>
      </form>

      <Footer />
    </div>
  );
}
