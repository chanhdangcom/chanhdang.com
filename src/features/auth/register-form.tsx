"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
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
  else feedback.push("At least 8 characters");

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push("Lowercase letter");

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("Uppercase letter");

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push("Number");

  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push("Special character");

  return { score, feedback };
}

export default function RegisterForm() {
  const t = useTranslations("auth.register");
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
  const getStrengthText = (score: number) => {
    if (score <= 1) return t("strengthVeryWeak");
    if (score <= 2) return t("strengthWeak");
    if (score <= 3) return t("strengthFair");
    if (score <= 4) return t("strengthStrong");
    return t("strengthVeryStrong");
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.username.trim()) {
      newErrors.username = t("errorUsernameRequired");
    } else if (form.username.length < 3) {
      newErrors.username = t("errorUsernameMin");
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      newErrors.username = t("errorUsernameInvalid");
    }

    if (!form.email.trim()) {
      newErrors.email = t("errorEmailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t("errorEmailInvalid");
    }

    if (!form.password) {
      newErrors.password = t("errorPasswordRequired");
    } else if (form.password.length < 8) {
      newErrors.password = t("errorPasswordMin");
    } else if (passwordStrength.score < 3) {
      newErrors.password = t("errorPasswordWeak");
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = t("errorConfirmRequired");
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = t("errorConfirmMatch");
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
        setSuccessMessage(t("success"));
        setForm({ username: "", email: "", password: "", confirmPassword: "" });

        setTimeout(() => {
          router.push(`/${locale}/auth/login`);
        }, 2000);
      } else {
        setErrors({ general: data.error || t("errorGeneric") });
      }
    } catch {
      setErrors({ general: t("errorConnection") });
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

  return (
    <div className="h-screen items-center justify-center md:flex">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-30 mx-4 my-8 space-y-6 rounded-3xl border border-zinc-200 from-zinc-950 to-zinc-900 p-8 font-apple shadow-sm backdrop-blur-2xl dark:border-zinc-800 md:mx-auto md:w-[30vw]"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 text-center">
            <ChanhdangLogotype className="mx-auto h-6 w-fit" />

            <h1 className="bg-gradient-to-r from-zinc-900 to-zinc-700 bg-clip-text font-apple text-3xl font-bold text-transparent">
              {t("title")}
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              {t("subtitle")}
            </p>
          </div>

          <AnimatePresence>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
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
                className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-700">
                {t("username")}
              </label>

              <div className="relative">
                <Input
                  name="username"
                  placeholder={t("usernamePlaceholder")}
                  value={form.username}
                  onChange={handleChange}
                  required
                  className={`rounded-xl border border-zinc-300 dark:border-zinc-800 ${errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}`}
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
              <label className="text-sm font-semibold text-zinc-700">
                {t("email")}
              </label>

              <div className="relative">
                <Input
                  name="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={`rounded-xl border border-zinc-300 dark:border-zinc-800 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
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
              <label className="text-sm font-semibold text-zinc-700">
                {t("password")}
              </label>

              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("passwordPlaceholder")}
                  value={form.password}
                  onChange={handleChange}
                  required
                  className={`rounded-xl border border-zinc-300 pr-10 dark:border-zinc-800 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
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
                            : "bg-zinc-200"
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
                        {t("passwordValid")}
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
              <label className="text-sm font-semibold text-zinc-700">
                {t("confirmPassword")}
              </label>

              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("confirmPlaceholderAlt")}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`rounded-xl border border-zinc-300 pr-10 dark:border-zinc-800 ${
                    errors.confirmPassword
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                  disabled={isSubmitting}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
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
                    {t("passwordsMatch")}
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
              className="w-full rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800 px-4 py-3 text-white transition-all hover:from-zinc-800 hover:to-zinc-700"
              disabled={isSubmitting}
              loading={isSubmitting}
              loadingText={t("signingUp")}
            >
              {!isSubmitting && t("submit")}
            </Button>

            {/* Login Link */}
            <div className="text-center">
              <Link
                href={`/${locale}/auth/login`}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                {t("hasAccount")}
              </Link>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
