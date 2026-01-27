"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChanhdangLogotype } from "@/components/chanhdang-logotype";

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
}

function calculatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push("Ít nhất 8 ký tự");

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push("Có chữ thường");

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("Có chữ hoa");

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push("Có số");

  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push("Có ký tự đặc biệt");

  return { score, feedback };
}

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const router = useRouter();

  const passwordStrength = calculatePasswordStrength(form.password);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Username validation
    if (!form.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    } else if (form.username.length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      newErrors.username =
        "Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới";
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (form.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    } else if (passwordStrength.score < 3) {
      newErrors.password =
        "Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn.";
    }

    // Confirm password validation
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage(
          "Đăng ký thành công! Đang chuyển đến trang đăng nhập..."
        );
        setForm({ username: "", email: "", password: "", confirmPassword: "" });

        setTimeout(() => {
          router.push(`/${locale}/auth/login`);
        }, 2000);
      } else {
        setErrors({ general: data.error || "Có lỗi xảy ra!" });
      }
    } catch {
      setErrors({ general: "Lỗi kết nối. Vui lòng thử lại sau." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStrengthColor = (score: number) => {
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score <= 3) return "bg-yellow-500";
    if (score <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = (score: number) => {
    if (score <= 1) return "Rất yếu";
    if (score <= 2) return "Yếu";
    if (score <= 3) return "Trung bình";
    if (score <= 4) return "Mạnh";
    return "Rất mạnh";
  };

  return (
    <div className="h-screen items-center justify-center md:flex">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-30 mx-4 my-8 space-y-6 rounded-3xl border border-zinc-200 from-zinc-950 to-zinc-900 p-8 font-apple shadow-sm backdrop-blur-2xl dark:border-zinc-800 dark:bg-gradient-to-br md:mx-auto md:w-[30vw]"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 text-center">
            <ChanhdangLogotype className="mx-auto h-6 w-fit" />

            <h1 className="bg-gradient-to-r from-zinc-900 to-zinc-700 bg-clip-text font-apple text-3xl font-bold text-transparent dark:from-white dark:to-zinc-300">
              Đăng Ký
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Tạo tài khoản mới để bắt đầu
            </p>
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

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Email
              </label>

              <div className="relative">
                <Input
                  name="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={`rounded-xl border dark:border-zinc-900 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  disabled={isSubmitting}
                />
              </div>

              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-red-500"
                  >
                    {errors.email}
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

              {/* Password Strength Indicator */}
              {form.password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full ${
                          level <= passwordStrength.score
                            ? getStrengthColor(passwordStrength.score)
                            : "bg-zinc-200 dark:bg-zinc-800"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-medium ${
                        passwordStrength.score <= 2
                          ? "text-red-500"
                          : passwordStrength.score <= 3
                            ? "text-yellow-500"
                            : "text-green-500"
                      }`}
                    >
                      {getStrengthText(passwordStrength.score)}
                    </span>
                    {passwordStrength.score >= 3 && (
                      <span className="flex items-center gap-1 text-green-500">
                        <Check className="h-3 w-3" />
                        Mật khẩu hợp lệ
                      </span>
                    )}
                  </div>
                </div>
              )}

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

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Xác nhận mật khẩu
              </label>

              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`rounded-xl border pr-10 dark:border-zinc-900${
                    errors.confirmPassword
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  disabled={isSubmitting}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {form.confirmPassword &&
                form.password === form.confirmPassword && (
                  <p className="flex items-center gap-1 text-xs text-green-500">
                    <Check className="h-3 w-3" />
                    Mật khẩu khớp
                  </p>
                )}
              <AnimatePresence>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-red-500"
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800 px-4 py-3 text-white transition-all hover:from-zinc-800 hover:to-zinc-700 dark:from-zinc-100 dark:to-zinc-200 dark:text-zinc-900 dark:hover:from-zinc-200 dark:hover:to-zinc-300"
              disabled={isSubmitting}
              loading={isSubmitting}
              loadingText="Đang đăng ký..."
            >
              {!isSubmitting && "Đăng Ký"}
            </Button>

            {/* Login Link */}
            <div className="text-center">
              <Link
                href={`/${locale}/auth/login`}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                Đã có tài khoản? Đăng nhập ngay
              </Link>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
