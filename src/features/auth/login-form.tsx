"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { useUser } from "@/hooks/use-user";
import { HeaderMusicPage } from "../music/header-music-page";
import { Footer } from "@/app/[locale]/features/profile/footer";
export default function LoginForm() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const router = useRouter();
  const { login, user, isLoading } = useUser();

  // Nếu đã đăng nhập (Google), chuyển về trang chủ locale
  useEffect(() => {
    if (user) {
      router.replace(`/${locale}/music`);
    }
  }, [user, locale, router]);

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
      // Lưu user vào session thông qua hook useUser
      login(data.user);
      setForm({ username: "", password: "" });
      router.push(`/${locale}/music`);
    } else {
      setMessage(data.error || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="container">
      <HeaderMusicPage name="Login" />

      <div className="z-30 mx-4 my-8 space-y-6 rounded-3xl border border-zinc-200 p-8 font-apple backdrop-blur-2xl dark:border-zinc-900 md:mx-auto md:w-[30vw]">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="text-center text-3xl font-bold">Đăng Nhập</div>

          <div className="mx-auto flex flex-col space-y-4 md:w-full">
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

            <div className="text-sm text-blue-600 hover:underline">
              Đăng ký tại đây
            </div>

            {message && <p>{message}</p>}
          </div>

          <div className="">
            <div className="relative my-4 py-3">
              <div className="h-px w-full bg-zinc-200 dark:bg-zinc-900" />

              <div className="absolute left-1/2 top-0 -translate-x-1/2 bg-zinc-50 px-4 dark:bg-black">
                Hoặc
              </div>
            </div>

            <button
              type="button"
              onClick={() => login()}
              disabled={isLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-3 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              <img
                src="/img/google-icon.png"
                alt="Google"
                className="h-6 w-6"
              />

              <span>{isLoading ? "Đang xử lý..." : "Tiếp tục với Google"}</span>
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
