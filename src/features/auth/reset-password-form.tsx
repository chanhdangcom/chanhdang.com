"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { HeaderMusicPage } from "../music/header-music-page";
import { Footer } from "@/app/[locale]/features/profile/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function ResetPasswordForm() {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "en";
  const token = searchParams.get("token");

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        setIsValidatingToken(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/auth/validate-reset-token?token=${token}`
        );
        const data = await res.json();
        setTokenValid(data.valid);
      } catch {
        setTokenValid(false);
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.password) {
      newErrors.password = "Please enter your password";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }

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
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage(
          "Password reset successful! Redirecting to sign in..."
        );
        setForm({ password: "", confirmPassword: "" });

        setTimeout(() => {
          router.push(`/${locale}/auth/login`);
        }, 2000);
      } else {
        setErrors({ general: data.error || "Something went wrong!" });
      }
    } catch {
      setErrors({ general: "Connection error. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidatingToken) {
    return (
      <div className="container">
        <HeaderMusicPage name="Reset Password" />
        <div className="z-30 mx-4 my-8 flex items-center justify-center rounded-3xl border border-zinc-200 p-8 font-apple backdrop-blur-2xl dark:border-zinc-800 md:mx-auto md:w-[30vw]">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-zinc-900 border-t-transparent" />
            <p className="text-zinc-600">Verifying...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="container">
        <HeaderMusicPage name="Reset Password" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="z-30 mx-4 my-8 space-y-6 rounded-3xl border border-red-200 bg-red-50 p-8 font-apple backdrop-blur-2xl dark:border-zinc-800 md:mx-auto md:w-[30vw]"
        >
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <h1 className="mb-2 text-2xl font-bold text-red-600">
              Invalid or expired link
            </h1>
            <p className="mb-4 text-sm text-red-600">
              The password reset link is invalid or has expired. Please request
              a new link.
            </p>
            <Link
              href={`/${locale}/auth/forgot-password`}
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Request new link
            </Link>
          </div>
        </motion.div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container">
      <HeaderMusicPage name="Reset Password" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-30 mx-4 my-8 space-y-6 rounded-3xl border border-zinc-200 p-8 font-apple backdrop-blur-2xl dark:border-zinc-800 md:mx-auto md:w-[30vw]"
      >
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-zinc-900 to-zinc-700 bg-clip-text text-3xl font-bold text-transparent">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-zinc-600">Enter your new password</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
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
            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">
                New password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className={`rounded-xl border border-zinc-300 pl-10 pr-10 dark:border-zinc-800 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
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
              <label className="text-sm font-medium text-zinc-700">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Enter password again"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`rounded-xl border border-zinc-300 pl-10 pr-10 dark:border-zinc-800 ${
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
              loadingText="Resetting..."
            >
              {!isSubmitting && "Reset Password"}
            </Button>

            {/* Back to Login Link */}
            <div className="text-center">
              <Link
                href={`/${locale}/auth/login`}
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </div>
        </form>
      </motion.div>

      <Footer />
    </div>
  );
}
