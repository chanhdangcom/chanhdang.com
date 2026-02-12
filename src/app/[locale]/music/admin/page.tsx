"use client";

import { UserManagement } from "@/features/music/admin/user-management";
import { useIsAdmin } from "@/hooks/use-permissions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MusicAdminPage() {
  const isAdmin = useIsAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.push("/music");
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return (
      <div className="mx-4 py-8 md:ml-[270px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Không có quyền truy cập</h1>
          <p className="mt-2 text-zinc-600">
            Chỉ admin mới có thể truy cập trang này
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 py-8 md:ml-[270px]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>

      <UserManagement />
    </div>
  );
}
