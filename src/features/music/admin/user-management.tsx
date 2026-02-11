"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsAdmin } from "@/hooks/use-permissions";
import { useRouter } from "next/navigation";
interface UserData {
  id: string;
  username: string;
  email?: string;
  displayName?: string;
  role: "user" | "admin";
  createdAt?: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const isAdmin = useIsAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.push("/music");
      return;
    }
    fetchUsers();
  }, [isAdmin, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/set-role");
      if (!res.ok) {
        throw new Error("Không thể lấy danh sách users");
      }
      const data = await res.json();
      setUsers(data.users || []);
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

      // Update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setUpdating(null);
    }
  };

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
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-600 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-400">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-200 shadow-sm dark:border-zinc-800">
        <div className="border-b border-zinc-200 bg-zinc-100 p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold">Quản lý Users</h2>

          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Tổng số users: {users.length}
          </p>
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <div className="flex items-center gap-3">
                {user.role === "admin" ? (
                  <ShieldCheck className="h-5 w-5 text-blue-500" />
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
                </div>
              </div>

              <div className="w-28 space-y-2">
                <Button
                  onClick={() =>
                    updateRole(
                      user.id,
                      user.role === "admin" ? "user" : "admin"
                    )
                  }
                  disabled={updating === user.id}
                  variant="outline"
                  size="sm"
                  className="w-full shadow-sm dark:border-zinc-800"
                >
                  {updating === user.id
                    ? "Đang cập nhật..."
                    : user.role === "admin"
                      ? "Gỡ Admin"
                      : "Thêm Admin"}
                </Button>

                <div
                  className={`rounded-full px-3 py-1 text-center text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {user.role === "admin" ? "Admin" : "User"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
