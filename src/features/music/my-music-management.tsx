"use client";

import { useState, useEffect, useCallback } from "react";
import { ISingerItem } from "./type/singer";
import { useUser } from "@/hooks/use-user";
import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { MotionHeaderMusic } from "./component/motion-header-music";
import { HeaderMusicPage } from "./header-music-page";
import { Footer } from "@/app/[locale]/features/profile/footer";

type IMusic = {
  _id?: string;
  id?: string;
  title: string;
  singer: string;
  cover: string;
  audio: string;
  youtube?: string;
  content?: string;
  type?: string;
  srt?: string;
  beat?: string;
  createdAt?: Date | string;
};

export function MyMusicManagement() {
  const { user } = useUser();
  const { role } = usePermissions();
  const isRegularUser = role === "user";

  const [userArtistProfile, setUserArtistProfile] =
    useState<ISingerItem | null>(null);
  const [musics, setMusics] = useState<IMusic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [editingMusicId, setEditingMusicId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const [editForm, setEditForm] = useState({
    title: "",
    cover: "",
    audio: "",
    youtube: "",
    content: "",
    type: "",
    srt: "",
    beat: "",
  });

  const fetchUserArtistProfile = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    setIsLoadingProfile(true);
    try {
      // Use dedicated API endpoint to get user's profile
      const response = await fetch("/api/singers/my-profile");

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.singer) {
          setUserArtistProfile(data.singer);
          // Fetch musics from the profile
          if (data.singer._id || data.singer.id) {
            const musicsRes = await fetch(
              `/api/singers/${data.singer._id || data.singer.id}/musics`
            );
            const musicsData = await musicsRes.json();
            setMusics(musicsData || []);
          }
        } else {
          setUserArtistProfile(null);
          setMusics([]);
        }
      } else {
        // Profile not found - user hasn't created one yet
        setUserArtistProfile(null);
        setMusics([]);
      }
    } catch (error) {
      console.error("Error fetching user artist profile:", error);
      setUserArtistProfile(null);
      setMusics([]);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isRegularUser && user?.id) {
      fetchUserArtistProfile();
    }
  }, [isRegularUser, user?.id, fetchUserArtistProfile]);

  const handleEdit = (music: IMusic) => {
    setEditingMusicId(music._id || music.id || null);
    setEditForm({
      title: music.title || "",
      cover: music.cover || "",
      audio: music.audio || "",
      youtube: music.youtube || "",
      content: music.content || "",
      type: music.type || "",
      srt: music.srt || "",
      beat: music.beat || "",
    });
    setMessage("");
  };

  const handleCancelEdit = () => {
    setEditingMusicId(null);
    setEditForm({
      title: "",
      cover: "",
      audio: "",
      youtube: "",
      content: "",
      type: "",
      srt: "",
      beat: "",
    });
    setMessage("");
  };

  const handleUpdateMusic = async () => {
    if (!editingMusicId || !userArtistProfile) return;

    setIsLoading(true);
    setMessage("");

    try {
      const singerId = userArtistProfile._id || userArtistProfile.id;
      if (!singerId) {
        setMessage("Không tìm thấy profile ca sĩ!");
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `/api/singers/${singerId}/musics/${editingMusicId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Cập nhật bài hát thành công!");
        setEditingMusicId(null);
        // Refresh musics list
        await fetchUserArtistProfile();
      } else {
        setMessage(data.error || "Có lỗi xảy ra khi cập nhật!");
      }
    } catch (error) {
      console.error("Error updating music:", error);
      setMessage("Có lỗi xảy ra khi cập nhật!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMusic = async (musicId: string) => {
    if (!userArtistProfile) return;

    if (!confirm("Bạn có chắc muốn xóa bài hát này?")) return;

    setIsLoading(true);
    setMessage("");

    try {
      const singerId = userArtistProfile._id || userArtistProfile.id;
      if (!singerId) {
        setMessage("Không tìm thấy profile ca sĩ!");
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `/api/singers/${singerId}/musics/${musicId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Xóa bài hát thành công!");
        // Refresh musics list
        await fetchUserArtistProfile();
      } else {
        setMessage(data.error || "Có lỗi xảy ra khi xóa!");
      }
    } catch (error) {
      console.error("Error deleting music:", error);
      setMessage("Có lỗi xảy ra khi xóa!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isRegularUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Không có quyền truy cập</h1>
          <p className="mt-2 text-zinc-600">
            Chỉ users thường mới có thể quản lý nhạc của mình
          </p>
        </div>
      </div>
    );
  }

  if (isLoadingProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  if (!userArtistProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Chưa có profile ca sĩ</h1>
          <p className="mt-2 text-zinc-600">
            Vui lòng thêm bài hát đầu tiên để tạo profile ca sĩ tự động
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <MotionHeaderMusic name="Quản Lý Nhạc Của Tôi" />
      <div className="md:ml-6">
        <HeaderMusicPage name="Quản Lý Nhạc Của Tôi" />
      </div>

      <div className="mx-4 md:mx-72">
        <div className="rounded-3xl border border-zinc-300 bg-gradient-to-tr from-transparent to-black/10 p-4 font-apple backdrop-blur-2xl dark:border-zinc-700 dark:to-white/10">
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-300">
            <div className="mb-1 font-semibold">
              🎵 Thông tin ca sĩ của bạn:
            </div>
            <div>
              <strong>Tên ca sĩ:</strong> {userArtistProfile.singer}
            </div>
            <div className="mt-2">
              <strong>Tổng số bài hát:</strong> {musics.length}
            </div>
          </div>

          {message && (
            <div
              className={`mb-4 rounded-lg p-3 text-sm ${
                message.includes("thành công")
                  ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                  : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
              }`}
            >
              {message}
            </div>
          )}

          {musics.length === 0 ? (
            <div className="py-8 text-center text-zinc-500">
              Bạn chưa có bài hát nào. Hãy thêm bài hát đầu tiên!
            </div>
          ) : (
            <div className="space-y-4">
              {musics.map((music) => {
                const musicId = music._id || music.id || "";
                const isEditing = editingMusicId === musicId;

                return (
                  <div
                    key={musicId}
                    className="rounded-xl border border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Tên bài hát"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                          className="w-full rounded-xl border px-4 py-2 dark:border-zinc-900 dark:bg-zinc-950"
                        />
                        <input
                          type="text"
                          placeholder="Link ảnh cover"
                          value={editForm.cover}
                          onChange={(e) =>
                            setEditForm({ ...editForm, cover: e.target.value })
                          }
                          className="w-full rounded-xl border px-4 py-2 dark:border-zinc-900 dark:bg-zinc-950"
                        />
                        <input
                          type="text"
                          placeholder="Link audio"
                          value={editForm.audio}
                          onChange={(e) =>
                            setEditForm({ ...editForm, audio: e.target.value })
                          }
                          className="w-full rounded-xl border px-4 py-2 dark:border-zinc-900 dark:bg-zinc-950"
                        />
                        <input
                          type="text"
                          placeholder="Link Youtube (tùy chọn)"
                          value={editForm.youtube}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              youtube: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border px-4 py-2 dark:border-zinc-900 dark:bg-zinc-950"
                        />
                        <input
                          type="text"
                          placeholder="Thể loại (tùy chọn)"
                          value={editForm.type}
                          onChange={(e) =>
                            setEditForm({ ...editForm, type: e.target.value })
                          }
                          className="w-full rounded-xl border px-4 py-2 dark:border-zinc-900 dark:bg-zinc-950"
                        />
                        <textarea
                          placeholder="Nội dung (tùy chọn)"
                          value={editForm.content}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              content: e.target.value,
                            })
                          }
                          className="w-full rounded-xl border px-4 py-2 dark:border-zinc-900 dark:bg-zinc-950"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={handleUpdateMusic}
                            disabled={isLoading}
                            className="flex-1"
                          >
                            {isLoading ? "Đang lưu..." : "Lưu"}
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            variant="outline"
                            disabled={isLoading}
                            className="flex-1"
                          >
                            Hủy
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">
                            {music.title}
                          </h3>
                          {music.type && (
                            <p className="text-sm text-zinc-500">
                              Thể loại: {music.type}
                            </p>
                          )}
                          {music.youtube && (
                            <a
                              href={music.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                            >
                              Xem trên YouTube
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEdit(music)}
                            variant="outline"
                            size="sm"
                            disabled={isLoading}
                          >
                            Sửa
                          </Button>
                          <Button
                            onClick={() => handleDeleteMusic(musicId)}
                            variant="destructive"
                            size="sm"
                            disabled={isLoading}
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Footer />
      </div>
    </div>
  );
}
