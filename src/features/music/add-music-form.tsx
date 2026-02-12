"use client";
import { useState, useEffect, useCallback } from "react";
import { HeaderMusicPage } from "./header-music-page";
import { Button } from "@/components/ui/button";
import { MotionHeaderMusic } from "./component/motion-header-music";
import { ISingerItem } from "./type/singer";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { useUser } from "@/hooks/use-user";
import { usePermissions } from "@/hooks/use-permissions";

export default function AddMusicForm() {
  const { user } = useUser();
  const { role } = usePermissions();
  const isAdmin = role === "admin";
  const isRegularUser = role === "user";

  const [form, setForm] = useState({
    title: "",
    singer: "",
    cover: "",
    audio: "",
    youtube: "",
    content: "",
    type: "",
    topic: "",
    srt: "",
    beat: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Singer selection states (only for admin)
  const [singers, setSingers] = useState<ISingerItem[]>([]);
  const [selectedSingerId, setSelectedSingerId] = useState("");
  const [useExistingSinger, setUseExistingSinger] = useState(false);

  // User's artist profile state
  const [userArtistProfile, setUserArtistProfile] =
    useState<ISingerItem | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [userMusics, setUserMusics] = useState<IMusic[]>([]);
  const [adminMusics, setAdminMusics] = useState<IMusic[]>([]);
  const [selectedMusicId, setSelectedMusicId] = useState<string>("");
  const [hasManualTopic, setHasManualTopic] = useState(false);
  const [isSuggestingTopic, setIsSuggestingTopic] = useState(false);
  const resetFormState = useCallback(() => {
    setForm({
      title: "",
      singer: "",
      cover: "",
      audio: "",
      youtube: "",
      content: "",
      type: "",
      topic: "",
      srt: "",
      beat: "",
    });
    setFile(null);
    setImageFile(null);
    setSrtFile(null);
    setBeatFile(null);
    setSelectedSingerId("");
    setUseExistingSinger(false);
    setSelectedMusicId("");
    setHasManualTopic(false);
    setIsSuggestingTopic(false);
  }, []);

  const fetchPresignedUrl = useCallback(async (file: File) => {
    const presignedRes = await fetch(
      `/api/upload-music?fileName=${encodeURIComponent(
        file.name
      )}&contentType=${encodeURIComponent(
        file.type || "application/octet-stream"
      )}`
    );
    if (!presignedRes.ok) {
      const errorData = await presignedRes.json().catch(() => ({}));
      throw new Error(errorData.error || "Unknown error");
    }
    const presignedData = await presignedRes.json();
    if (presignedData.error) {
      throw new Error(presignedData.error);
    }
    return presignedData as { presignedUrl: string; publicUrl: string };
  }, []);

  const uploadFileToR2 = useCallback(
    async (file: File, errorPrefix: string) => {
      const { presignedUrl, publicUrl } = await fetchPresignedUrl(file);
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        throw new Error(`${errorPrefix} ${errorText}`);
      }
      return publicUrl;
    },
    [fetchPresignedUrl]
  );

  const fetchUserArtistProfile = useCallback(async () => {
    if (!user?.id) return;

    setIsLoadingProfile(true);
    try {
      // Get all singers and find the one created by this user
      const response = await fetch("/api/singers");
      const singers = await response.json();

      // Normalize user ID for comparison
      const userId = user.id;
      const userIdString = String(userId).trim();

      const userProfile = singers.find((singer: ISingerItem) => {
        if (!singer.addedBy) return false;
        const addedByValue = singer.addedBy;
        const addedByString = String(addedByValue).trim();

        return (
          addedByString === userIdString ||
          addedByValue === userId ||
          addedByValue === userIdString ||
          addedByString.toLowerCase() === userIdString.toLowerCase()
        );
      });

      if (userProfile) {
        setUserArtistProfile(userProfile);
        // Fetch musics from the profile
        if (userProfile._id || userProfile.id) {
          const musicsRes = await fetch(
            `/api/singers/${userProfile._id || userProfile.id}/musics`
          );
          const musicsData = await musicsRes.json();
          setUserMusics(musicsData || []);
        }
      } else {
        // User doesn't have a profile yet, will create automatically on submit
        setUserArtistProfile(null);
        setUserMusics([]);
      }
    } catch (error) {
      console.error("Error fetching user artist profile:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [user?.id]);

  const fetchAdminMusics = useCallback(async () => {
    try {
      const response = await fetch("/api/musics");
      if (!response.ok) return;
      const musicsData = await response.json();
      setAdminMusics(Array.isArray(musicsData) ? musicsData : []);
    } catch (error) {
      console.error("Error fetching admin musics:", error);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "topic") {
      setHasManualTopic(value.trim().length > 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    // For regular users: ensure they have an artist profile
    let finalUserArtistProfile = userArtistProfile;
    if (isRegularUser && !userArtistProfile) {
      // Try to create artist profile automatically
      try {
        const profileRes = await fetch("/api/singers/create-artist-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            singer: user?.displayName || user?.username || "Unknown Artist",
            cover: user?.avatarUrl || form.cover || "",
          }),
        });

        const profileData = await profileRes.json();
        if (profileData.success && profileData.singer) {
          // Use the profile object directly from API response (new or existing)
          finalUserArtistProfile = profileData.singer;
          // Also update state for UI
          setUserArtistProfile(profileData.singer);
          // If it's an existing profile, silently continue (no error message)
        } else {
          setMessage(
            profileData.error || "Lỗi khi tạo profile ca sĩ. Vui lòng thử lại!"
          );
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error creating artist profile:", error);
        setMessage("Lỗi khi tạo profile ca sĩ. Vui lòng thử lại!");
        setIsLoading(false);
        return;
      }
    }

    // Admin validation: nếu chọn ca sĩ có sẵn thì phải chọn một ca sĩ
    if (isAdmin && useExistingSinger && !selectedSingerId) {
      setMessage("Vui lòng chọn một ca sĩ từ danh sách!");
      setIsLoading(false);
      return;
    }

    // Admin validation: nếu không chọn ca sĩ có sẵn thì phải nhập tên ca sĩ
    if (isAdmin && !useExistingSinger && !form.singer) {
      setMessage("Vui lòng nhập tên ca sĩ!");
      setIsLoading(false);
      return;
    }

    // Validation: require topic and type
    if (!form.topic.trim()) {
      setMessage("Vui lòng nhập chủ đề!");
      setIsLoading(false);
      return;
    }

    if (!form.type.trim()) {
      setMessage("Vui lòng chọn thể loại!");
      setIsLoading(false);
      return;
    }

    try {
      let audioUrl = form.audio;
      let coverUrl = form.cover;
      let srtUrl = form.srt;
      let beatUrl = form.beat;

      if (file) {
        audioUrl = await uploadFileToR2(file, "Upload mp3 thất bại!");
      }

      if (imageFile) {
        coverUrl = await uploadFileToR2(imageFile, "Upload ảnh thất bại!");
      }

      if (srtFile) {
        srtUrl = await uploadFileToR2(srtFile, "Upload file SRT thất bại!");
      }

      if (beatFile) {
        beatUrl = await uploadFileToR2(beatFile, "Upload file beat thất bại!");
      }

      // For regular users: use their artist profile
      let targetSingerId: string | null = null;

      if (isRegularUser) {
        if (!finalUserArtistProfile) {
          setMessage("Không tìm thấy profile ca sĩ của bạn. Vui lòng thử lại!");
          setIsLoading(false);
          return;
        }
        targetSingerId =
          finalUserArtistProfile._id || finalUserArtistProfile.id || null;
        if (!targetSingerId) {
          setMessage("Lỗi: Không tìm thấy ID profile ca sĩ!");
          setIsLoading(false);
          return;
        }
      } else if (isAdmin) {
        // Admin validation
        if (
          useExistingSinger &&
          (!selectedSingerId || selectedSingerId.trim() === "")
        ) {
          setMessage("Vui lòng chọn ca sĩ từ danh sách!");
          setIsLoading(false);
          return;
        }

        if (!useExistingSinger && !form.singer.trim()) {
          setMessage("Vui lòng nhập tên ca sĩ hoặc chọn ca sĩ có sẵn!");
          setIsLoading(false);
          return;
        }

        if (useExistingSinger && selectedSingerId) {
          targetSingerId = selectedSingerId;
        }
      }

      // Gửi thông tin bài hát
      const bodyData = {
        ...form,
        audio: audioUrl,
        cover: coverUrl,
        srt: srtUrl,
        beat: beatUrl,
        // For regular users, set singer name from their profile
        singer:
          isRegularUser && finalUserArtistProfile
            ? finalUserArtistProfile.singer
            : form.singer,
      };

      let res, data;

      // Regular users: always add to their artist profile
      // Admin: add to selected singer or to general musics collection
      if (targetSingerId) {
        // Thêm vào singer profile
        console.log(
          "Gửi lên API /api/singers/" + targetSingerId + "/musics:",
          bodyData
        );

        res = await fetch(`/api/singers/${targetSingerId}/musics`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        });
        data = await res.json();
        console.log("Kết quả trả về từ /api/singers/[id]/musics:", data);

        // Kiểm tra nếu response không thành công
        if (!res.ok) {
          setMessage("Có lỗi xảy ra! " + (data.error || "Unknown error"));
          setIsLoading(false);
          return;
        }
      } else {
        // Admin: Thêm vào collection musics chung (khi không chọn ca sĩ)
        console.log("Gửi lên API /api/musics:", bodyData);
        res = await fetch("/api/musics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        });
        data = await res.json();
        console.log("Kết quả trả về từ /api/musics:", data);

        // Kiểm tra nếu response không thành công
        if (!res.ok) {
          setMessage("Có lỗi xảy ra! " + (data.error || "Unknown error"));
          setIsLoading(false);
          return;
        }
      }

      if (data.success) {
        setMessage("Thêm bài hát thành công!");
        resetFormState();
        // Refresh user musics if regular user
        if (isRegularUser && userArtistProfile) {
          await fetchUserArtistProfile();
        }
      } else {
        setMessage("Có lỗi xảy ra! " + (data.error || ""));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi thêm bài hát!";
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [srtFile, setSrtFile] = useState<File | null>(null);
  const [beatFile, setBeatFile] = useState<File | null>(null);

  const fetchSingers = async () => {
    try {
      const response = await fetch("/api/singers");
      const data = await response.json();
      setSingers(data);
    } catch (error) {
      console.error("Error fetching singers:", error);
    }
  };

  // Fetch singers on component mount (only for admin)
  useEffect(() => {
    if (isAdmin) {
      fetchSingers();
      fetchAdminMusics();
    }
  }, [isAdmin, fetchAdminMusics]);

  // Fetch user's artist profile (only for regular users)
  useEffect(() => {
    if (isRegularUser && user?.id) {
      fetchUserArtistProfile();
    }
  }, [isRegularUser, user?.id, fetchUserArtistProfile]);

  // Auto-suggest topic from song title
  useEffect(() => {
    const title = form.title.trim();
    if (!title || hasManualTopic) return;

    const timeout = setTimeout(async () => {
      setIsSuggestingTopic(true);
      try {
        const response = await fetch("/api/topic-suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title }),
        });
        const data = await response.json();
        if (response.ok && data.topic) {
          setForm((prev) => ({ ...prev, topic: data.topic }));
        }
      } catch (error) {
        console.error("Error suggesting topic:", error);
      } finally {
        setIsSuggestingTopic(false);
      }
    }, 700);

    return () => clearTimeout(timeout);
  }, [form.title, hasManualTopic]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSrtFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSrtFile(e.target.files[0]);
    }
  };

  const handleBeatFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBeatFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Handle edit music
  const handleEditMusic = async () => {
    if (!selectedMusicId) {
      setMessage("Vui lòng chọn bài hát cần sửa!");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Upload files if needed
      let audioUrl = form.audio;
      let coverUrl = form.cover;
      let srtUrl = form.srt;
      let beatUrl = form.beat;

      if (file) {
        audioUrl = await uploadFileToR2(file, "Upload mp3 thất bại!");
      }

      if (imageFile) {
        coverUrl = await uploadFileToR2(imageFile, "Upload ảnh thất bại!");
      }

      if (srtFile) {
        srtUrl = await uploadFileToR2(srtFile, "Upload file SRT thất bại!");
      }

      if (beatFile) {
        beatUrl = await uploadFileToR2(beatFile, "Upload file beat thất bại!");
      }

      const selectedSinger = singers.find(
        (singer) => String(singer._id || singer.id) === selectedSingerId
      );
      const adminSingerName =
        isAdmin && useExistingSinger
          ? (selectedSinger?.singer ?? form.singer)
          : form.singer;

      let response: Response;
      if (isAdmin) {
        response = await fetch(`/api/musics/${selectedMusicId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            singer: adminSingerName,
            audio: audioUrl,
            cover: coverUrl,
            srt: srtUrl,
            beat: beatUrl,
          }),
        });
      } else {
        const singerId = userArtistProfile?._id || userArtistProfile?.id;
        if (!singerId) {
          setMessage("Không tìm thấy profile ca sĩ!");
          setIsLoading(false);
          return;
        }
        response = await fetch(
          `/api/singers/${singerId}/musics/${selectedMusicId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...form,
              audio: audioUrl,
              cover: coverUrl,
              srt: srtUrl,
              beat: beatUrl,
            }),
          }
        );
      }

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Sửa bài hát thành công!");
        resetFormState();
        if (isAdmin) {
          await fetchAdminMusics();
        } else {
          await fetchUserArtistProfile();
        }
      } else {
        setMessage(data.error || "Có lỗi xảy ra khi sửa!");
      }
    } catch (error) {
      console.error("Error editing music:", error);
      setMessage("Có lỗi xảy ra khi sửa!");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete music
  const handleDeleteMusic = async () => {
    if (!selectedMusicId) {
      setMessage("Vui lòng chọn bài hát cần xóa!");
      return;
    }

    if (!confirm("Bạn có chắc muốn xóa bài hát này?")) return;

    setIsLoading(true);
    setMessage("");

    try {
      let response: Response;
      if (isAdmin) {
        response = await fetch(`/api/musics/${selectedMusicId}`, {
          method: "DELETE",
        });
      } else {
        const singerId = userArtistProfile?._id || userArtistProfile?.id;
        if (!singerId) {
          setMessage("Không tìm thấy profile ca sĩ!");
          setIsLoading(false);
          return;
        }
        response = await fetch(
          `/api/singers/${singerId}/musics/${selectedMusicId}`,
          {
            method: "DELETE",
          }
        );
      }

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Xóa bài hát thành công!");
        setSelectedMusicId("");
        if (isAdmin) {
          await fetchAdminMusics();
        } else {
          await fetchUserArtistProfile();
        }
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

  const handleSelectMusicToManage = (musicId: string) => {
    setSelectedMusicId(musicId);
    if (!musicId) return;

    const sourceMusics = isAdmin ? adminMusics : userMusics;
    const selectedMusic = sourceMusics.find(
      (music) => (music._id || music.id || "") === musicId
    );

    if (!selectedMusic) return;

    const selectedTopic = String(
      (selectedMusic as { topic?: unknown }).topic ?? ""
    );
    const selectedSingerName = String(
      (selectedMusic as { singer?: unknown }).singer ?? ""
    ).trim();
    const selectedSingerIdFromMusic = String(
      (selectedMusic as { singerId?: unknown }).singerId ?? ""
    );
    const matchedSinger = singers.find((singer) => {
      const singerId = String(singer._id || singer.id || "");
      if (selectedSingerIdFromMusic && singerId === selectedSingerIdFromMusic) {
        return true;
      }
      return (
        singer.singer.trim().toLowerCase() === selectedSingerName.toLowerCase()
      );
    });

    setForm((prev) => ({
      ...prev,
      title: selectedMusic.title || "",
      singer: selectedSingerName,
      cover: selectedMusic.cover || "",
      audio: selectedMusic.audio || "",
      youtube: selectedMusic.youtube || "",
      content: selectedMusic.content || "",
      type: selectedMusic.type || "",
      topic: selectedTopic,
      srt: selectedMusic.srt || "",
      beat: selectedMusic.beat || "",
    }));
    setHasManualTopic(Boolean(selectedTopic));
    setFile(null);
    setImageFile(null);
    setSrtFile(null);
    setBeatFile(null);
    if (isAdmin && matchedSinger) {
      setUseExistingSinger(true);
      setSelectedSingerId(String(matchedSinger._id || matchedSinger.id || ""));
    } else if (isAdmin) {
      setUseExistingSinger(false);
      setSelectedSingerId("");
    }
  };

  return (
    <div>
      <MotionHeaderMusic name="New Music" />

      <div className="md:ml-6">
        <HeaderMusicPage name="New Music" />
      </div>

      <div className="">
        <form
          className="left-6 z-30 mx-4 space-y-4 rounded-3xl border border-zinc-300 bg-gradient-to-tr from-transparent to-black/10 p-4 font-apple backdrop-blur-2xl dark:border-zinc-700 dark:to-white/10 md:mx-72"
          onSubmit={handleSubmit}
        >
          <div className="text-center text-2xl font-bold">Thêm bài hát mới</div>

          {/* Info about singer selection */}
          {isAdmin && (
            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              <div className="mb-1 font-semibold">Cách thêm nhạc (Admin):</div>

              <div className="space-y-1">
                <div>
                  • <strong>Chọn ca sĩ có sẵn:</strong> Nhạc sẽ được thêm vào
                  danh sách của ca sĩ đó
                </div>

                <div>
                  • <strong>Nhập ca sĩ mới:</strong> Nhạc sẽ được thêm vào
                  collection musics chung
                </div>
              </div>
            </div>
          )}

          {isRegularUser && (
            <div className="rounded-lg border border-green-400/30 bg-green-50 p-3 text-sm text-green-800 dark:border-green-300/30 dark:bg-green-900/20 dark:text-green-300">
              <div className="mb-1 font-bold">Thông tin ca sĩ của bạn:</div>

              {isLoadingProfile ? (
                <div>Đang tải thông tin...</div>
              ) : userArtistProfile ? (
                <div className="space-y-1">
                  <div>
                    <strong>Tên ca sĩ:</strong> {userArtistProfile.singer}
                  </div>

                  {userArtistProfile.cover && (
                    <div className="mt-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={userArtistProfile.cover}
                        alt={userArtistProfile.singer}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  Profile ca sĩ sẽ được tạo tự động khi bạn thêm bài hát đầu
                  tiên với thông tin:{" "}
                  <strong>{user?.displayName || user?.username}</strong>
                </div>
              )}
            </div>
          )}

          {isAdmin && adminMusics.length > 0 && (
            <div className="rounded-lg border border-blue-400/30 bg-blue-50 p-3 dark:border-blue-300/30 dark:bg-blue-900/20">
              <label className="mb-2 block text-sm font-semibold text-blue-700 dark:text-blue-300">
                Chọn bài hát cần sửa / xóa (toàn hệ thống)
              </label>
              <select
                value={selectedMusicId}
                onChange={(e) => handleSelectMusicToManage(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
              >
                <option value="">-- Chọn bài hát --</option>
                {adminMusics.map((music) => {
                  const id = music._id || music.id || "";
                  return (
                    <option key={id} value={id}>
                      {music.title}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <div className="mx-auto flex w-full flex-col space-y-4">
            <div className="mx-auto flex w-full flex-col justify-between gap-4">
              <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                Tên bài hát
              </label>

              <input
                name="title"
                placeholder="Tên bài hát"
                value={form.title}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
              />

              {/* Singer selection - Only for Admin */}
              {isAdmin && (
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                    Ca sĩ
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="useExistingSinger"
                      checked={useExistingSinger}
                      onChange={(e) => setUseExistingSinger(e.target.checked)}
                      disabled={isLoading}
                      className="rounded"
                    />

                    <label
                      htmlFor="useExistingSinger"
                      className="text-sm font-medium"
                    >
                      Chọn ca sĩ có sẵn
                    </label>
                  </div>

                  {useExistingSinger ? (
                    <select
                      value={selectedSingerId}
                      onChange={(e) => {
                        const nextSingerId = e.target.value;
                        setSelectedSingerId(nextSingerId);
                        const nextSinger = singers.find(
                          (singer) =>
                            String(singer._id || singer.id) === nextSingerId
                        );
                        if (nextSinger) {
                          setForm((prev) => ({
                            ...prev,
                            singer: nextSinger.singer,
                          }));
                        }
                      }}
                      disabled={isLoading}
                      required={useExistingSinger}
                      className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
                    >
                      <option value="">Chọn ca sĩ</option>

                      {singers.map((singer) => (
                        <option
                          key={singer._id || singer.id}
                          value={singer._id || singer.id}
                        >
                          {singer.singer}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      name="singer"
                      placeholder="Nhập tên ca sĩ mới"
                      value={form.singer}
                      onChange={handleChange}
                      required={!useExistingSinger}
                      disabled={isLoading}
                      className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
                    />
                  )}
                </div>
              )}

              {/* For regular users: show their artist name (read-only) */}
              {isRegularUser && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Ca sĩ (tự động từ tài khoản của bạn)
                  </label>

                  <input
                    type="text"
                    value={
                      userArtistProfile?.singer ||
                      user?.displayName ||
                      user?.username ||
                      ""
                    }
                    disabled
                    className="cursor-not-allowed rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-2 text-zinc-500 shadow-sm dark:border-zinc-900 dark:bg-zinc-900 dark:text-zinc-400"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border border-zinc-300 p-1 dark:border-zinc-700">
              <label className="px-3 pt-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                Ảnh bìa
              </label>

              {imageFile ? (
                <div className="font-semibold text-green-600">
                  Đã chọn file ảnh: {imageFile.name}
                </div>
              ) : (
                <input
                  name="cover"
                  placeholder="Chọn file hình ảnh bài hát bên dưới"
                  value={form.cover}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="pointer-events-none rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isLoading}
                className="rounded-xl border bg-zinc-100 px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-800"
              />
            </div>

            {/* Nếu đã chọn file mp3 thì ẩn input nhập link audio */}
            <div className="flex flex-col gap-2 rounded-2xl border border-zinc-300 p-1 dark:border-zinc-700">
              <label className="px-3 pt-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                Audio bài hát
              </label>

              {file ? (
                <div className="font-semibold text-green-600">
                  Đã chọn file mp3: {file.name}
                </div>
              ) : (
                <input
                  name="audio"
                  placeholder="Chọn file mp3 bài hát bên dưới"
                  value={form.audio}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="pointer-events-none rounded-xl border bg-zinc-50 px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
                />
              )}

              <input
                type="file"
                accept=".mp3"
                onChange={handleFileChange}
                disabled={isLoading}
                className="rounded-xl border bg-zinc-100 px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-800"
              />
            </div>

            {/* Beat: cho phép chọn file hoặc nhập link */}
            <div className="flex flex-col gap-2 rounded-2xl border border-zinc-300 p-1 dark:border-zinc-700">
              <label className="px-3 pt-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                Beat
              </label>

              {beatFile ? (
                <div className="font-semibold text-green-600">
                  Đã chọn file beat: {beatFile.name}
                </div>
              ) : (
                <input
                  name="beat"
                  placeholder="Chọn file beat nhạc bên dưới"
                  value={form.beat}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="pointer-events-none rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
                />
              )}

              <input
                type="file"
                accept="audio/*,.mp3,.wav,.m4a"
                onChange={handleBeatFileChange}
                disabled={isLoading}
                className="rounded-xl border bg-zinc-100 px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-800"
              />
            </div>

            {/* SRT: cho phép chọn file hoặc nhập link */}
            <div className="flex flex-col gap-2 rounded-2xl border border-zinc-300 p-1 dark:border-zinc-700">
              <label className="px-3 pt-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                Lời bài hát (SRT)
              </label>

              {srtFile ? (
                <div className="font-semibold text-green-600">
                  Đã chọn file SRT: {srtFile.name}
                </div>
              ) : (
                <input
                  name="srt"
                  placeholder="Chọn file SRT lời bài hát bên dưới"
                  value={form.srt}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="pointer-events-none rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
                />
              )}

              <input
                type="file"
                accept=".srt,application/x-subrip"
                onChange={handleSrtFileChange}
                disabled={isLoading}
                className="rounded-xl border bg-zinc-100 px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-800"
              />
            </div>

            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              Chủ đề
            </label>

            <input
              name="topic"
              placeholder="Chọn topic"
              value={form.topic}
              onChange={handleChange}
              disabled={isLoading}
              required
              className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
            />
            {isSuggestingTopic && (
              <div className="ml-4 text-xs text-zinc-500">
                Đang gợi ý chủ đề...
              </div>
            )}

            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              Thể loại
            </label>

            <select
              name="type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              disabled={isLoading}
              required
              className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
            >
              <option value="">Thể loại</option>

              <option value="pop">Pop</option>

              <option value="rock">Rock</option>

              <option value="hiphop">Hip Hop / Rap</option>

              <option value="rnb">R&B / Soul</option>

              <option value="edm">EDM / Electronic</option>

              <option value="jazz">Jazz</option>

              <option value="classical">Classical</option>

              <option value="country">Country</option>

              <option value="metal">Metal</option>

              <option value="folk">Folk</option>

              <option value="latin">Latin</option>

              <option value="soundtrack">Soundtrack / OST</option>

              <option value="world">World Music</option>

              <option value="chill">Chill / Lo-fi</option>

              <option value="acoustic">Acoustic</option>
            </select>

            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              Link Youtube
            </label>

            <input
              name="youtube"
              placeholder="Link Youtube"
              value={form.youtube}
              onChange={handleChange}
              disabled={isLoading}
              className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
            />

            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              Nội dung
            </label>

            <textarea
              name="content"
              placeholder="Nội dung"
              value={form.content}
              onChange={handleChange}
              disabled={isLoading}
              className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
            />

            <div className="space-y-2">
              <Button
                type="submit"
                variant="liquid"
                size="lg"
                loading={isLoading}
                loadingText="Đang thêm bài hát..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-50 font-semibold text-black"
              >
                Thêm bài hát
              </Button>

              {isAdmin && adminMusics.length > 0 && (
                <div className="flex justify-between gap-2">
                  <Button
                    type="button"
                    onClick={handleEditMusic}
                    disabled={isLoading || !selectedMusicId}
                    className="w-full rounded-xl border border-blue-600 px-8 py-2 font-semibold"
                    variant="outline"
                  >
                    Sửa
                  </Button>

                  <Button
                    type="button"
                    onClick={handleDeleteMusic}
                    disabled={isLoading || !selectedMusicId}
                    className="w-full rounded-xl border border-rose-600 px-8 py-2 font-semibold text-rose-600"
                    variant="outline"
                  >
                    Xóa
                  </Button>
                </div>
              )}
            </div>
            {message && <p className="text-center font-semibold">{message}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
