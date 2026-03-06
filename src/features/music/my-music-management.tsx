"use client";

import { useState, useEffect, useCallback } from "react";
import { ISingerItem } from "./type/singer";
import { useUser } from "@/hooks/use-user";
import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { MotionHeaderMusic } from "./component/motion-header-music";
import { HeaderMusicPage } from "./header-music-page";
import { MenuBar } from "./menu-bar";
import { useAudio } from "@/components/music-provider";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { Play } from "@phosphor-icons/react/dist/ssr";

type IMusicWithStatus = IMusic & {
  _id?: string;
  status?: "pending" | "approved" | "rejected";
};

function StatusBadge({
  status,
}: {
  status?: "pending" | "approved" | "rejected";
}) {
  if (!status) return null;
  const config = {
    pending: {
      label: "Chờ duyệt",
      className:
        "rounded-full bg-amber-200 px-2 py-0.5 text-xs dark:bg-amber-800/50",
    },
    approved: {
      label: "Đã duyệt",
      className:
        "rounded-full bg-emerald-200 px-2 py-0.5 text-xs dark:bg-emerald-800/50",
    },
    rejected: {
      label: "Bị từ chối",
      className:
        "rounded-full bg-rose-200 px-2 py-0.5 text-xs dark:bg-rose-800/50",
    },
  };
  const c = config[status] ?? config.pending;
  return <span className={c.className}>{c.label}</span>;
}

export function MyMusicManagement() {
  const { user } = useUser();
  const { role } = usePermissions();
  const isRegularUser = role === "user";

  const [userArtistProfile, setUserArtistProfile] =
    useState<ISingerItem | null>(null);
  const [musics, setMusics] = useState<IMusicWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [message, setMessage] = useState("");
  const { handlePlayAudio } = useAudio();

  const fetchUserArtistProfile = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    setIsLoadingProfile(true);
    try {
      // Lấy profile ca sĩ và danh sách bài đã gửi (pending/approved/rejected)
      const [profileRes, musicsRes] = await Promise.all([
        fetch("/api/singers/my-profile"),
        fetch("/api/musics?addedBy=me", { cache: "no-store" }),
      ]);

      if (profileRes.ok) {
        const data = await profileRes.json();
        if (data.success && data.singer) {
          setUserArtistProfile(data.singer);
        } else {
          setUserArtistProfile(null);
        }
      } else {
        setUserArtistProfile(null);
      }

      if (musicsRes.ok) {
        const musicsData = await musicsRes.json();
        const list = Array.isArray(musicsData) ? musicsData : [];
        setMusics(list);
      } else {
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

  const handleDeleteMusic = async (musicId: string) => {
    const rawSingerId =
      userArtistProfile?._id ||
      userArtistProfile?.id ||
      (musics[0] as { singerId?: unknown })?.singerId;
    const singerId = rawSingerId ? String(rawSingerId) : null;
    if (!singerId) {
      setMessage("Không tìm thấy profile ca sĩ!");
      return;
    }

    if (!confirm("Bạn có chắc muốn xóa bài hát này?")) return;

    setIsLoading(true);
    setMessage("");

    try {
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

  if (!userArtistProfile && musics.length === 0) {
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

      <MenuBar />

      <div className="mx-4 md:ml-[270px] md:mr-4">
        <div className="rounded-3xl border p-4 font-apple shadow-sm dark:border-zinc-800">
          {userArtistProfile && (
            <div className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-300">
              <div className="mb-1 font-semibold">Thông tin ca sĩ của bạn:</div>

              <div>
                <strong>Tên ca sĩ:</strong> {userArtistProfile.singer}
              </div>

              <div className="mt-2">
                <strong>Tổng số bài hát:</strong> {musics.length}
              </div>
            </div>
          )}

          <div className="mb-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            <div className="mb-1 font-semibold"> Trạng thái bài hát:</div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs dark:bg-amber-800/50">
                Chờ duyệt
              </span>

              <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-xs dark:bg-emerald-800/50">
                Đã duyệt
              </span>

              <span className="rounded-full bg-rose-200 px-2 py-0.5 text-xs dark:bg-rose-800/50">
                Bị từ chối (chỉ bạn nghe được)
              </span>
            </div>
          </div>

          {message && (
            <div
              className={`mb-4 rounded-lg p-3 text-sm ${
                message.includes("thành công")
                  ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                  : "bg-rose-50 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300"
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

                return (
                  <div
                    key={musicId}
                    className="rounded-xl border p-4 shadow-sm dark:border-zinc-800"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">
                            {music.title}
                          </h3>
                          <StatusBadge status={music.status} />
                        </div>
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
                          onClick={() =>
                            handlePlayAudio({
                              ...music,
                              id: music.id || musicId,
                            } as IMusic)
                          }
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 rounded-xl shadow-sm"
                        >
                          <Play size={16} weight="fill" />
                          Nghe
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
