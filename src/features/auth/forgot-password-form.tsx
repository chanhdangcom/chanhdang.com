"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import AuthLightMode from "./auth-light-mode";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: "Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn.",
        });
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: data.error || "Có lỗi xảy ra. Vui lòng thử lại sau.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Lỗi kết nối. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-20 h-screen items-start justify-center md:flex">
      <AuthLightMode />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-30 mx-4 my-8 space-y-6 rounded-3xl border border-zinc-200 p-8 font-apple backdrop-blur-2xl md:mx-auto md:w-[30vw]"
      >
        <div className="space-y-4 text-center">
          <ChanhdangLogotype className="mx-auto h-6 w-fit" />

          <h1 className="bg-gradient-to-r from-zinc-900 to-zinc-700 bg-clip-text text-3xl font-bold text-transparent">
            Quên Mật Khẩu
          </h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                  message.type === "success"
                    ? "border-green-200 bg-green-50 text-green-600"
                    : "border-red-200 bg-red-50 text-red-600"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span>{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">
              Email
            </label>

            <div className="relative">
              <Input
                type="email"
                placeholder="Nhập email của bạn để nhận link đặt lại mật khẩu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl border"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800 px-4 py-3 text-white transition-all hover:from-zinc-800 hover:to-zinc-700"
            disabled={isSubmitting}
            loading={isSubmitting}
            loadingText="Đang gửi..."
          >
            {!isSubmitting && "Gửi Email Đặt Lại Mật Khẩu"}
          </Button>

          <div className="text-center">
            <Link
              href={`/${locale}/auth/login`}
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại đăng nhập
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
