"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChanhdangLogotype } from "@/components/chanhdang-logotype";

interface FormErrors {
  username?: string;
  password?: string;
  general?: string;
}

export default function LoginForm() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
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

  // Load remember me data
  useEffect(() => {
    try {
      const remembered = localStorage.getItem("rememberedUsername");
      if (remembered) {
        setForm((prev) => ({ ...prev, username: remembered }));
        setRememberMe(true);
      }
    } catch {
      // Ignore errors
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    } else if (form.username.length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    if (!form.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }

    // Clear general error
    if (errors.general) {
      setErrors({ ...errors, general: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rememberMe }),
      });

      const data = await res.json();

      if (data.success) {
        // Save remember me
        if (rememberMe) {
          localStorage.setItem("rememberedUsername", form.username);
        } else {
          localStorage.removeItem("rememberedUsername");
        }

        setSuccessMessage("Đăng nhập thành công!");
        login(data.user);
        setForm({ username: "", password: "" });

        // Delay redirect for better UX
        setTimeout(() => {
          router.push(`/${locale}/music`);
        }, 1000);
      } else {
        setErrors({ general: data.error || "Có lỗi xảy ra!" });
      }
    } catch {
      setErrors({ general: "Lỗi kết nối. Vui lòng thử lại sau." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen items-center justify-center md:flex">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-30 mx-4 my-8 space-y-6 rounded-3xl border border-zinc-200 from-zinc-900 to-zinc-950 p-8 font-apple shadow-sm backdrop-blur-2xl dark:border-zinc-800 dark:bg-gradient-to-tl md:mx-auto md:w-[30vw]"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 text-center">
            <div className="mx-auto w-fit">
              <ChanhdangLogotype className="h-6" />
            </div>

            <h1 className="bg-gradient-to-r from-zinc-900 to-zinc-700 bg-clip-text font-apple text-3xl font-bold text-transparent dark:from-white dark:to-zinc-300">
              Đăng Nhập
            </h1>
          </div>

          <AnimatePresence>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400"
              >
                <AlertCircle className="h-4 w-4" />

                <span>{errors.general}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600 dark:border-green-900 dark:bg-green-950/50 dark:text-green-400"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Tên đăng nhập
              </label>

              <div className="relative">
                <Input
                  name="username"
                  placeholder="Nhập tên đăng nhập"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className={`rounded-xl border dark:border-zinc-900 ${errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  disabled={isSubmitting}
                />
              </div>

              <AnimatePresence>
                {errors.username && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-red-500"
                  >
                    {errors.username}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Mật khẩu
              </label>

              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className={`rounded-xl border pr-10 dark:border-zinc-900 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-red-500"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"
                  disabled={isSubmitting}
                />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <Link
                href={`/${locale}/auth/forgot-password`}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800 px-4 py-3 text-white transition-all hover:from-zinc-800 hover:to-zinc-700 dark:from-zinc-100 dark:to-zinc-200 dark:text-zinc-900 dark:hover:from-zinc-200 dark:hover:to-zinc-300"
              disabled={isSubmitting}
              loading={isSubmitting}
              loadingText="Đang đăng nhập..."
            >
              {!isSubmitting && "Đăng nhập"}
            </Button>

            {/* Register Link */}
            <div className="text-center">
              <Link
                href={`/${locale}/auth/register`}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                Chưa có tài khoản? Đăng ký ngay
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-zinc-50 px-4 text-zinc-500 dark:bg-black dark:text-zinc-400">
                Hoặc
              </span>
            </div>
          </div>

          {/* Google Login */}
          <Button
            type="button"
            onClick={() => login()}
            disabled={isLoading || isSubmitting}
            className="w-full rounded-xl border border-zinc-300 px-4 py-3 shadow-sm transition-all hover:bg-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/google-icon.png" alt="Google" className="h-5 w-5" />
            <span>{isLoading ? "Đang xử lý..." : "Tiếp tục với Google"}</span>
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
