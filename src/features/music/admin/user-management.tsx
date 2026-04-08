"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsAdmin } from "@/hooks/use-permissions";
import { useUser } from "@/hooks/use-user";
import { usePremium } from "@/hooks/use-premium";
import { useParams, useRouter } from "next/navigation";
import { MenuBar } from "../menu-bar";
import { cn } from "@/utils/cn";
interface UserData {
  id: string;
  username: string;
  email?: string;
  displayName?: string;
  role: "user" | "admin";
  isPremium?: boolean;
  isPremiumCreator?: boolean;
  createdAt?: string;
  firstLoginAt?: string;
  lastLoginAt?: string;
}

export function UserManagement() {
  const params = useParams();
  const locale = (params?.locale as string) || "vi";
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [emailQuery, setEmailQuery] = useState("");
  const [dateField, setDateField] = useState<"createdAt" | "firstLoginAt">(
    "createdAt"
  );
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState<
    | "createdAt-desc"
    | "createdAt-asc"
    | "firstLoginAt-desc"
    | "firstLoginAt-asc"
    | "email-asc"
    | "email-desc"
  >("createdAt-desc");
  const { isAdmin, isLoading: isAuthLoading } = useIsAdmin();
  const { user: currentUser } = useUser();
  const { refresh } = usePremium();
  const router = useRouter();

  const formatDate = (value?: string) => {
    if (!value) return "Chưa có";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Chưa có";
    return date.toLocaleString("vi-VN");
  };

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAdmin) {
      router.push(`/${locale}/music`);
      return;
    }
    fetchUsers();
  }, [isAdmin, isAuthLoading, locale, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/set-role");
      if (!res.ok) {
        throw new Error("Không thể lấy danh sách users");
      }
      const data = await res.json();
      setUsers(data.users || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId: string, newRole: "user" | "admin") => {
    try {
      setUpdating(userId);
      const res = await fetch("/api/admin/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Không thể cập nhật role");
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const query = emailQuery.trim().toLowerCase();
    const fromDate = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const toDate = dateTo ? new Date(`${dateTo}T23:59:59.999`) : null;

    const nextUsers = users.filter((user) => {
      const email = (user.email || "").toLowerCase();
      if (query && !email.includes(query)) {
        return false;
      }

      const rawDate = user[dateField];
      if (fromDate || toDate) {
        if (!rawDate) {
          return false;
        }
        const userDate = new Date(rawDate);
        if (Number.isNaN(userDate.getTime())) {
          return false;
        }
        if (fromDate && userDate < fromDate) {
          return false;
        }
        if (toDate && userDate > toDate) {
          return false;
        }
      }

      return true;
    });

    nextUsers.sort((a, b) => {
      if (sortBy === "email-asc" || sortBy === "email-desc") {
        const compare =
          (a.email || a.username || "").localeCompare(
            b.email || b.username || "",
            "vi",
            { sensitivity: "base" }
          ) ||
          a.username.localeCompare(b.username, "vi", { sensitivity: "base" });
        return sortBy === "email-asc" ? compare : -compare;
      }

      const [field, direction] = sortBy.split("-") as [
        "createdAt" | "firstLoginAt",
        "asc" | "desc",
      ];
      const aValue = a[field] ? new Date(a[field] as string).getTime() : 0;
      const bValue = b[field] ? new Date(b[field] as string).getTime() : 0;
      const compare = aValue - bValue;
      return direction === "asc" ? compare : -compare;
    });

    return nextUsers;
  }, [dateField, dateFrom, dateTo, emailQuery, sortBy, users]);

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-300" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-300" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-600 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-400">
          {error}
        </div>
      )}

      <MenuBar />

      <div className="overflow-hidden rounded-xl border border-zinc-200 shadow-sm dark:border-zinc-800">
        <div className="border-b border-zinc-200 bg-zinc-100 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold">Management Users</h2>

          <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {filteredUsers.length} / {users.length} users
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <input
              value={emailQuery}
              onChange={(event) => setEmailQuery(event.target.value)}
              placeholder="Search by email"
              className="rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition placeholder:text-black focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950"
            />

            <select
              value={dateField}
              onChange={(event) =>
                setDateField(event.target.value as "createdAt" | "firstLoginAt")
              }
              className="rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950"
            >
              <option value="createdAt">Filter by registration date</option>

              <option value="firstLoginAt">Filter by first login date</option>
            </select>

            <input
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
              className="rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950"
            />

            <input
              type="date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
              className="rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950"
            />

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value as
                    | "createdAt-desc"
                    | "createdAt-asc"
                    | "firstLoginAt-desc"
                    | "firstLoginAt-asc"
                    | "email-asc"
                    | "email-desc"
                )
              }
              className="rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 transition focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950"
            >
              <option value="createdAt-desc">Newest registration</option>

              <option value="createdAt-asc">Oldest registration</option>

              <option value="firstLoginAt-desc">Newest first login</option>

              <option value="firstLoginAt-asc">Oldest first login</option>

              <option value="email-asc">Email A-Z</option>

              <option value="email-desc">Email Z-A</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {filteredUsers.length === 0 ? (
            <div className="p-6 text-sm text-zinc-500 dark:text-zinc-400">
              Không có user nào khớp với bộ lọc hiện tại.
            </div>
          ) : null}

          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
            >
              <div className="flex items-center gap-3">
                {user.role === "admin" ? (
                  <ShieldCheck className="h-5 w-5 text-rose-500 dark:text-blue-500" />
                ) : (
                  <User className="h-5 w-5 text-zinc-400" />
                )}
                <div>
                  <div className="font-medium">
                    {user.displayName || user.username}
                  </div>

                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {user.email || user.username}
                  </div>

                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                    Đăng ký: {formatDate(user.createdAt)}
                  </div>

                  <div className="text-xs text-zinc-500 dark:text-zinc-500">
                    Đăng nhập đầu tiên: {formatDate(user.firstLoginAt)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-xs sm:w-64">
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() =>
                      updateRole(
                        user.id,
                        user.role === "admin" ? "user" : "admin"
                      )
                    }
                    disabled={updating === user.id}
                    variant={user.role === "admin" ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "rounded-full shadow-sm dark:border-zinc-800",
                      user.role === "admin"
                        ? "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                        : "bg-zinc-100 text-black hover:bg-zinc-200 dark:bg-white dark:hover:bg-zinc-200"
                    )}
                  >
                    {updating === user.id ? "..." : "Admin"}
                  </Button>

                  <Button
                    onClick={async () => {
                      try {
                        setUpdating(user.id);
                        const res = await fetch(
                          `/api/users/${encodeURIComponent(user.id)}`,
                          {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              userId: user.id,
                              isPremium: !user.isPremium,
                            }),
                          }
                        );
                        const data = await res.json();
                        if (!res.ok || !data?.success) {
                          throw new Error(
                            data?.error || "Không thể cập nhật premium"
                          );
                        }
                        setUsers((prev) =>
                          prev.map((u) =>
                            u.id === user.id
                              ? { ...u, isPremium: !user.isPremium }
                              : u
                          )
                        );
                        if (currentUser?.id === user.id) {
                          refresh();
                        }
                      } catch (err) {
                        setError(
                          err instanceof Error ? err.message : "Có lỗi xảy ra"
                        );
                      } finally {
                        setUpdating(null);
                      }
                    }}
                    disabled={updating === user.id}
                    variant={user.isPremium ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "rounded-full shadow-sm dark:border-zinc-800",
                      user.isPremium
                        ? "bg-rose-500 text-white hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700"
                        : "bg-zinc-100 text-black hover:bg-zinc-200 dark:bg-white dark:hover:bg-zinc-200"
                    )}
                  >
                    {updating === user.id ? "..." : "Premium"}
                  </Button>

                  <Button
                    onClick={async () => {
                      try {
                        setUpdating(user.id);
                        const res = await fetch(
                          `/api/users/${encodeURIComponent(user.id)}`,
                          {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              userId: user.id,
                              isPremiumCreator: !user.isPremiumCreator,
                              ...(!user.isPremiumCreator
                                ? { isPremium: true }
                                : {}),
                            }),
                          }
                        );
                        const data = await res.json();
                        if (!res.ok || !data?.success) {
                          throw new Error(
                            data?.error || "Không thể cập nhật Creator"
                          );
                        }
                        setUsers((prev) =>
                          prev.map((u) =>
                            u.id === user.id
                              ? {
                                  ...u,
                                  isPremiumCreator: !user.isPremiumCreator,
                                  ...(!user.isPremiumCreator
                                    ? { isPremium: true }
                                    : {}),
                                }
                              : u
                          )
                        );
                        if (currentUser?.id === user.id) {
                          refresh();
                        }
                      } catch (err) {
                        setError(
                          err instanceof Error ? err.message : "Có lỗi xảy ra"
                        );
                      } finally {
                        setUpdating(null);
                      }
                    }}
                    disabled={updating === user.id}
                    variant={user.isPremiumCreator ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "rounded-full shadow-sm dark:border-zinc-800",
                      user.isPremiumCreator
                        ? "bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
                        : "bg-zinc-100 text-black hover:bg-zinc-200 dark:bg-white dark:hover:bg-zinc-200"
                    )}
                  >
                    {updating === user.id ? "..." : "Creator"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
