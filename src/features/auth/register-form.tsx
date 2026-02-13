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
      newErrors.username = "Please enter your username";
    } else if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      newErrors.username =
        "Username can only contain letters, numbers and underscore";
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Please enter your password";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (passwordStrength.score < 3) {
      newErrors.password = "Password too weak. Please use a stronger password.";
    }

    // Confirm password validation
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
        setSuccessMessage("Registration successful! Redirecting to sign in...");
        setForm({ username: "", email: "", password: "", confirmPassword: "" });

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

  const getStrengthColor = (score: number) => {
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score <= 3) return "bg-yellow-500";
    if (score <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = (score: number) => {
    if (score <= 1) return "Very weak";
    if (score <= 2) return "Weak";
    if (score <= 3) return "Fair";
    if (score <= 4) return "Strong";
    return "Very strong";
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
              Sign Up
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Create an account to get started
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
                Username
              </label>

              <div className="relative">
                <Input
                  name="username"
                  placeholder="Enter your username"
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
                Email
              </label>

              <div className="relative">
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
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
                Password
              </label>

              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
                        Password valid
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
                Confirm password
              </label>

              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Enter password again"
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
                    Passwords match
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
              loadingText="Signing up..."
            >
              {!isSubmitting && "Sign Up"}
            </Button>

            {/* Login Link */}
            <div className="text-center">
              <Link
                href={`/${locale}/auth/login`}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
