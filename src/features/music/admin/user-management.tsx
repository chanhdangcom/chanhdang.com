/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Mail, ShieldCheck, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsAdmin } from "@/hooks/use-permissions";
import { useUser } from "@/hooks/use-user";
import { usePremium } from "@/hooks/use-premium";
import { buildUserAuthHeaders } from "@/lib/client-auth";
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

type UserProfileDetail = Record<string, unknown>;

const prioritizedFields = [
  "id",
  "_id",
  "username",
  "displayName",
  "email",
  "friendCode",
  "role",
  "isPremium",
  "isPremiumCreator",
  "avatarUrl",
  "image",
  "bio",
  "location",
  "favoriteGenres",
  "favoriteArtists",
  "libraryVisibility",
  "createdAt",
  "firstLoginAt",
  "lastLoginAt",
  "updatedAt",
  "friends",
  "incomingFriendRequests",
  "outgoingFriendRequests",
];

function formatFieldLabel(key: string) {
  if (key === "_id") return "Mongo ID";

  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (value) => value.toUpperCase());
}

function isLikelyUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function isLikelyDate(value: string) {
  return !Number.isNaN(new Date(value).getTime()) && /[t:-]/i.test(value);
}

function renderFieldValue(
  key: string,
  value: unknown,
  formatDate: (value?: string) => string
) {
  if (value === null || value === undefined || value === "") {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">Chưa có</p>;
  }

  if (typeof value === "boolean") {
    return (
      <span
        className={cn(
          "inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold",
          value
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
        )}
      >
        {value ? "Có" : "Không"}
      </span>
    );
  }

  if (typeof value === "string") {
    if (isLikelyUrl(value)) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="break-all text-sm font-medium text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
        >
          {value}
        </a>
      );
    }

    const displayValue =
      key.toLowerCase().includes("date") || key.endsWith("At")
        ? formatDate(value)
        : isLikelyDate(value)
          ? formatDate(value)
          : value;

    return (
      <p className="break-words text-sm font-medium leading-6">
        {displayValue}
      </p>
    );
  }

  if (typeof value === "number") {
    return <p className="text-sm font-medium">{value}</p>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <p className="text-sm text-zinc-500 dark:text-zinc-400">[]</p>;
    }

    const allPrimitive = value.every(
      (item) =>
        item === null ||
        item === undefined ||
        ["string", "number", "boolean"].includes(typeof item)
    );

    if (allPrimitive) {
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <span
              key={`${key}-${index}`}
              className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {String(item)}
            </span>
          ))}
        </div>
      );
    }
  }

  return (
    <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-2xl bg-zinc-100/90 p-3 text-xs leading-5 dark:bg-zinc-900">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function getStringField(detail: UserProfileDetail | null, ...keys: string[]) {
  for (const key of keys) {
    const value = detail?.[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

export function UserManagement() {
  const params = useParams();
  const locale = (params?.locale as string) || "vi";
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userDetail, setUserDetail] = useState<UserProfileDetail | null>(null);
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

  const sortedDetailEntries = useMemo(() => {
    if (!userDetail) return [];

    return Object.entries(userDetail).sort(([keyA], [keyB]) => {
      const priorityA = prioritizedFields.indexOf(keyA);
      const priorityB = prioritizedFields.indexOf(keyB);
      const normalizedPriorityA =
        priorityA === -1 ? prioritizedFields.length : priorityA;
      const normalizedPriorityB =
        priorityB === -1 ? prioritizedFields.length : priorityB;

      if (normalizedPriorityA !== normalizedPriorityB) {
        return normalizedPriorityA - normalizedPriorityB;
      }

      return keyA.localeCompare(keyB, "vi", { sensitivity: "base" });
    });
  }, [userDetail]);

  const detailAvatar = getStringField(userDetail, "avatarUrl", "image");
  const detailFriendCode = getStringField(userDetail, "friendCode");
  const detailEmail = getStringField(userDetail, "email");
  const detailLibraryVisibility = getStringField(
    userDetail,
    "libraryVisibility"
  );
  const detailCreatedAt = getStringField(userDetail, "createdAt");
  const detailUpdatedAt = getStringField(userDetail, "updatedAt");
  const detailBio = getStringField(userDetail, "bio");

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

  const openUserDetails = async (user: UserData) => {
    try {
      setSelectedUser(user);
      setUserDetail(null);
      setDetailError(null);
      setDetailLoading(true);
      setDetailOpen(true);

      const response = await fetch(
        `/api/users/${encodeURIComponent(user.id)}`,
        {
          headers: buildUserAuthHeaders(currentUser?.id),
        }
      );
      const data = (await response.json()) as {
        success?: boolean;
        user?: UserProfileDetail;
        error?: string;
      };

      if (!response.ok || !data?.user) {
        throw new Error(data?.error || "Không thể tải chi tiết tài khoản");
      }

      setUserDetail(data.user);
    } catch (err) {
      setDetailError(
        err instanceof Error ? err.message : "Không thể tải chi tiết tài khoản"
      );
    } finally {
      setDetailLoading(false);
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

                  <div
                    onClick={() => void openUserDetails(user)}
                    className="mr-4 w-full cursor-pointer text-end text-blue-500 hover:underline"
                  >
                    Xem chi tiết
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Drawer
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) {
            setSelectedUser(null);
            setUserDetail(null);
            setDetailError(null);
          }
        }}
      >
        <DrawerContent className="mx-auto max-h-[88vh] w-full max-w-5xl rounded-t-[28px] border-zinc-200 bg-zinc-50/95 shadow-2xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
          <DrawerHeader className="border-b border-zinc-200/80 dark:border-zinc-800/80">
            <DrawerTitle>
              {selectedUser?.displayName ||
                selectedUser?.username ||
                "Chi tiết tài khoản"}
            </DrawerTitle>

            <DrawerDescription className="text-zinc-500 dark:text-zinc-400">
              {selectedUser?.email ||
                selectedUser?.username ||
                "Thông tin profile đầy đủ"}
            </DrawerDescription>
          </DrawerHeader>

          <div className="overflow-y-auto p-4">
            {detailLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-300" />
              </div>
            ) : detailError ? (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-400">
                {detailError}
              </div>
            ) : (
              <>
                <div className="relative">
                  <div className="relative w-full justify-between gap-8 md:flex">
                    <div className="w-full items-center justify-center gap-4 md:flex">
                      {detailAvatar ? (
                        <img
                          src={detailAvatar}
                          alt={
                            selectedUser?.displayName ||
                            selectedUser?.username ||
                            "User avatar"
                          }
                          className="mx-auto size-40 rounded-full object-cover md:mx-0"
                        />
                      ) : (
                        <User className="h-7 w-7 text-zinc-400" />
                      )}

                      <div className="space-y-2 pt-1 text-center md:text-left">
                        <div>
                          <h3 className="text-xl font-semibold text-zinc-950 dark:text-white">
                            {selectedUser?.displayName ||
                              selectedUser?.username}
                          </h3>

                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            @{selectedUser?.username}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={cn(
                              "w-full rounded-full px-3 py-1 text-xs font-semibold shadow-sm",
                              selectedUser?.role === "admin"
                                ? "bg-blue-500 text-white"
                                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                            )}
                          >
                            {selectedUser?.role === "admin" ? "Admin" : "User"}
                          </span>

                          <span
                            className={cn(
                              "w-full rounded-full px-3 py-1 text-xs font-semibold shadow-sm",
                              selectedUser?.isPremium
                                ? "bg-rose-500 text-white"
                                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                            )}
                          >
                            Premium
                          </span>

                          <span
                            className={cn(
                              "w-full rounded-full px-3 py-1 text-xs font-semibold shadow-sm",
                              selectedUser?.isPremiumCreator
                                ? "bg-amber-500 text-white"
                                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                            )}
                          >
                            Creator{" "}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 md:mt-0 md:w-full">
                      <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/90 p-3 dark:border-zinc-800 dark:bg-zinc-950/70">
                        <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          <Mail className="h-3.5 w-3.5" />
                          Email
                        </div>

                        <p className="break-all text-sm font-medium text-zinc-900 dark:text-white">
                          {detailEmail || "Chưa có"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/90 p-3 dark:border-zinc-800 dark:bg-zinc-950/70">
                        <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          <Sparkles className="h-3.5 w-3.5" />
                          Friend Code
                        </div>

                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                          {detailFriendCode || "Chưa có"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/90 p-3 dark:border-zinc-800 dark:bg-zinc-950/70">
                        <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          <CalendarClock className="h-3.5 w-3.5" />
                          Tạo tài khoản
                        </div>

                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                          {formatDate(detailCreatedAt)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/90 p-3 dark:border-zinc-800 dark:bg-zinc-950/70">
                        <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          <CalendarClock className="h-3.5 w-3.5" />
                          Cập nhật gần nhất
                        </div>

                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                          {formatDate(detailUpdatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {(detailLibraryVisibility || detailBio) && (
                  <div className="relative mt-4 rounded-3xl border bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="rounded-2xl">
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Bio
                      </p>

                      <p className="mt-1 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
                        {detailBio || "Chưa có"}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-5">
                  <div className="grid gap-3 pb-6 md:grid-cols-2 xl:grid-cols-3">
                    {sortedDetailEntries.map(([key, value]) => (
                      <div
                        key={key}
                        className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-900/80"
                      >
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                          {formatFieldLabel(key)}
                        </p>
                        {renderFieldValue(key, value, formatDate)}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
