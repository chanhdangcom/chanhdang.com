"use client";

import { SingerManagement } from "@/features/music/singer-management";
import { AddMusicToSinger } from "@/features/music/add-music-to-singer";
import { UserManagement } from "@/features/music/admin/user-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Users, ShieldCheck } from "lucide-react";
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
      <div className="container mx-auto px-4 py-8">
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="mt-2 text-zinc-600">
          Quản lý hệ thống, ca sĩ, nhạc và users
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <ShieldCheck size={16} />
            Quản lý Users
          </TabsTrigger>
          <TabsTrigger value="singers" className="flex items-center gap-2">
            <Users size={16} />
            Quản lý Ca sĩ
          </TabsTrigger>
          <TabsTrigger value="music" className="flex items-center gap-2">
            <Music size={16} />
            Thêm Nhạc
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="singers" className="mt-6">
          <SingerManagement />
        </TabsContent>

        <TabsContent value="music" className="mt-6">
          <AddMusicToSinger />
        </TabsContent>
      </Tabs>
    </div>
  );
}
