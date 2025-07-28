"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Footer } from "../profile/footer";
import { Header } from "../profile/header";
import { TableRanking } from "../music/table-ranking";
import { SingerList } from "../music/singer-list";
import { useUser } from "@/hooks/use-user";

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
    <>
      <Header />

      <div className="container md:flex md:justify-between">
        <div className="my-8 hidden w-[90vh]">
          <TableRanking />
          <SingerList />
        </div>

        <form className="mb-16 space-y-8 font-apple" onSubmit={handleSubmit}>
          <div className="my-8 text-center text-3xl font-bold">Đăng Nhập</div>

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
      </div>

      <div className="mb-8">
        <Footer />
      </div>
    </>
  );
}
