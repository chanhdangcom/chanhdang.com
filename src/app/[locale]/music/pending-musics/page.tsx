"use client";

import { useIsAdmin } from "@/hooks/use-permissions";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { MusicApproval } from "@/features/music/admin/music-approval";

export default function PendingMusicsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "vi";
  const { isAdmin, isLoading } = useIsAdmin();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAdmin) {
      router.push(`/${locale}/music`);
    }
  }, [isAdmin, isLoading, locale, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 font-apple md:ml-[270px]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-300" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-4 py-8 font-apple md:ml-[270px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Không có quyền truy cập</h1>
          <p className="mt-2 text-zinc-600">
            Chỉ admin mới có thể truy cập trang này
          </p>
        </div>
      </div>
    );
  }

  return <MusicApproval />;
}
