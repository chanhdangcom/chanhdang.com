"use client";
import { useState } from "react";

export default function RegisterForm() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Đăng ký thành công!");
      setForm({ username: "", password: "" });
    } else {
      setMessage(data.error || "Có lỗi xảy ra!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xs space-y-4">
      <h2 className="text-xl font-bold">Đăng ký</h2>
      <input
        name="username"
        placeholder="Tên đăng nhập"
        value={form.username}
        onChange={handleChange}
        required
        className="w-full border px-2 py-1"
      />
      <input
        name="password"
        type="password"
        placeholder="Mật khẩu"
        value={form.password}
        onChange={handleChange}
        required
        className="w-full border px-2 py-1"
      />
      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Đăng ký
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
