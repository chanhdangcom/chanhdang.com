"use client";

import { SingerManagement } from "@/features/music/singer-management";
import { AddMusicToSinger } from "@/features/music/add-music-to-singer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Users } from "lucide-react";

export default function MusicAdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Quản lý Music System</h1>
        <p className="mt-2 text-zinc-600">
          Quản lý ca sĩ và thêm nhạc vào hệ thống
        </p>
      </div>

      <Tabs defaultValue="singers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="singers" className="flex items-center gap-2">
            <Users size={16} />
            Quản lý Ca sĩ
          </TabsTrigger>
          <TabsTrigger value="music" className="flex items-center gap-2">
            <Music size={16} />
            Thêm Nhạc
          </TabsTrigger>
        </TabsList>

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
