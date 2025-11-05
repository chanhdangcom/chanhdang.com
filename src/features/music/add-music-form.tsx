"use client";
import { useState, useEffect } from "react";
import { HeaderMusicPage } from "./header-music-page";
import { Button } from "@/components/ui/button";
import { MotionHeaderMusic } from "./component/motion-header-music";
import { Footer } from "@/app/[locale]/features/profile /footer";
import { ISingerItem } from "./type/singer";

export default function AddMusicForm() {
  const [form, setForm] = useState({
    title: "",
    singer: "",
    cover: "",
    audio: "",
    youtube: "",
    content: "",
    type: "",
    srt: "",
    beat: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Singer selection states
  const [singers, setSingers] = useState<ISingerItem[]>([]);
  const [selectedSingerId, setSelectedSingerId] = useState("");
  const [useExistingSinger, setUseExistingSinger] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      let audioUrl = form.audio;
      let coverUrl = form.cover;

      // Nếu có file mp3, upload lên R2 trước
      if (file) {
        // 1. Lấy presigned URL
        const presignedRes = await fetch(
          `/api/upload-music?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`
        );
        const { presignedUrl, publicUrl } = await presignedRes.json();

        // 2. Upload trực tiếp lên R2
        const uploadRes = await fetch(presignedUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (uploadRes.ok) {
          audioUrl = publicUrl;
        } else {
          setMessage("Upload mp3 thất bại!");
          setIsLoading(false);
          return;
        }
      }

      // Nếu có file ảnh, upload lên R2 trước
      if (imageFile) {
        const presignedRes = await fetch(
          `/api/upload-music?fileName=${encodeURIComponent(imageFile.name)}&contentType=${encodeURIComponent(imageFile.type)}`
        );
        const { presignedUrl, publicUrl } = await presignedRes.json();

        const uploadRes = await fetch(presignedUrl, {
          method: "PUT",
          headers: { "Content-Type": imageFile.type },
          body: imageFile,
        });

        if (uploadRes.ok) {
          coverUrl = publicUrl;
        } else {
          setMessage("Upload ảnh thất bại!");
          setIsLoading(false);
          return;
        }
      }

      // Upload SRT nếu có
      let srtUrl = form.srt;
      if (srtFile) {
        const presignedRes = await fetch(
          `/api/upload-music?fileName=${encodeURIComponent(srtFile.name)}&contentType=${encodeURIComponent(srtFile.type || "application/octet-stream")}`
        );
        const { presignedUrl, publicUrl } = await presignedRes.json();
        const uploadRes = await fetch(presignedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": srtFile.type || "application/octet-stream",
          },
          body: srtFile,
        });
        if (uploadRes.ok) {
          srtUrl = publicUrl;
        } else {
          setMessage("Upload file SRT thất bại!");
          setIsLoading(false);
          return;
        }
      }

      // Upload BEAT nếu có
      let beatUrl = form.beat;
      if (beatFile) {
        const presignedRes = await fetch(
          `/api/upload-music?fileName=${encodeURIComponent(beatFile.name)}&contentType=${encodeURIComponent(beatFile.type || "application/octet-stream")}`
        );
        const { presignedUrl, publicUrl } = await presignedRes.json();
        const uploadRes = await fetch(presignedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": beatFile.type || "application/octet-stream",
          },
          body: beatFile,
        });
        if (uploadRes.ok) {
          beatUrl = publicUrl;
        } else {
          setMessage("Upload file beat thất bại!");
          setIsLoading(false);
          return;
        }
      }

      // Gửi thông tin bài hát
      const bodyData = {
        ...form,
        audio: audioUrl,
        cover: coverUrl,
        srt: srtUrl,
        beat: beatUrl,
      };

      let res, data;

      if (useExistingSinger && selectedSingerId) {
        // Thêm vào singer nếu đã chọn ca sĩ có sẵn
        console.log(
          "Gửi lên API /api/singers/" + selectedSingerId + "/musics:",
          bodyData
        );
        res = await fetch(`/api/singers/${selectedSingerId}/musics`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        });
        data = await res.json();
        console.log("Kết quả trả về từ /api/singers/[id]/musics:", data);
      } else {
        // Thêm vào collection musics như cũ
        console.log("Gửi lên API /api/musics:", bodyData);
        res = await fetch("/api/musics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        });
        data = await res.json();
        console.log("Kết quả trả về từ /api/musics:", data);
      }

      if (data.success) {
        setMessage("Thêm bài hát thành công!");
        setForm({
          title: "",
          singer: "",
          cover: "",
          audio: "",
          youtube: "",
          content: "",
          type: "",
          srt: "",
          beat: "",
        });
        setFile(null);
        setImageFile(null);
        setSrtFile(null);
        setBeatFile(null);
        setSelectedSingerId("");
        setUseExistingSinger(false);
      } else {
        setMessage("Có lỗi xảy ra! " + (data.error || ""));
      }
    } catch {
      setMessage("Có lỗi xảy ra khi thêm bài hát!");
    } finally {
      setIsLoading(false);
    }
  };

  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [srtFile, setSrtFile] = useState<File | null>(null);
  const [beatFile, setBeatFile] = useState<File | null>(null);

  // Fetch singers on component mount
  useEffect(() => {
    fetchSingers();
  }, []);

  const fetchSingers = async () => {
    try {
      const response = await fetch("/api/singers");
      const data = await response.json();
      setSingers(data);
    } catch (error) {
      console.error("Error fetching singers:", error);
    }
  };

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

  return (
    <div>
      <MotionHeaderMusic name="New Music" />

      <div className="md:ml-6">
        <HeaderMusicPage name="New Music" />
      </div>

      <div className="pointer-events-none fixed top-0 z-20 h-24 w-full bg-gradient-to-b from-white via-white/50 to-transparent dark:from-black dark:via-black/50" />

      <div className="">
        <form
          className="left-6 z-30 mx-4 space-y-4 rounded-3xl border border-zinc-300 bg-gradient-to-tr from-transparent to-black/10 p-4 font-apple backdrop-blur-2xl dark:border-zinc-700 dark:to-white/10 md:mx-72"
          onSubmit={handleSubmit}
        >
          <div className="text-center text-2xl font-bold">Thêm bài hát mới</div>

          {/* Info about singer selection */}
          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            <div className="mb-1 font-semibold">💡 Cách thêm nhạc:</div>
            <div className="space-y-1">
              <div>
                • <strong>Chọn ca sĩ có sẵn:</strong> Nhạc sẽ được thêm vào danh
                sách của ca sĩ đó
              </div>
              <div>
                • <strong>Nhập ca sĩ mới:</strong> Nhạc sẽ được thêm vào
                collection musics chung
              </div>
            </div>
          </div>

          <div className="mx-auto flex w-full flex-col space-y-4">
            <div className="mx-auto flex w-full flex-col justify-between gap-4">
              <input
                name="title"
                placeholder="Tên bài hát"
                value={form.title}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
              />

              {/* Singer selection */}
              <div className="flex flex-col gap-2">
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
                    onChange={(e) => setSelectedSingerId(e.target.value)}
                    disabled={isLoading}
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
                    required
                    disabled={isLoading}
                    className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border border-zinc-300 p-1 dark:border-zinc-700">
              {imageFile ? (
                <div className="font-semibold text-green-600">
                  Đã chọn file ảnh: {imageFile.name}
                </div>
              ) : (
                <input
                  name="cover"
                  placeholder="Link ảnh cover hoặc chọn file bên dưới"
                  value={form.cover}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
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
              {file ? (
                <div className="font-semibold text-green-600">
                  Đã chọn file mp3: {file.name}
                </div>
              ) : (
                <input
                  name="audio"
                  placeholder="Link audio (.mp3) hoặc chọn file bên dưới"
                  value={form.audio}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="rounded-xl border bg-zinc-100 px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
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
              {beatFile ? (
                <div className="font-semibold text-green-600">
                  Đã chọn file beat: {beatFile.name}
                </div>
              ) : (
                <input
                  name="beat"
                  placeholder="Link beat nhạc (tuỳ chọn) hoặc chọn file bên dưới"
                  value={form.beat}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
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
              {srtFile ? (
                <div className="font-semibold text-green-600">
                  Đã chọn file SRT: {srtFile.name}
                </div>
              ) : (
                <input
                  name="srt"
                  placeholder="Link file .srt (tuỳ chọn) hoặc chọn file bên dưới"
                  value={form.srt}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
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

            <input
              name="youtube"
              placeholder="Link Youtube"
              value={form.youtube}
              onChange={handleChange}
              disabled={isLoading}
              className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
            />

            <input
              name="type"
              placeholder="Thể loại"
              value={form.type}
              onChange={handleChange}
              disabled={isLoading}
              className="rounded-xl border px-4 py-2 shadow-sm disabled:opacity-50 dark:border-zinc-900 dark:bg-zinc-950"
            />

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

              <div className="flex justify-between gap-2">
                <div className="w-full rounded-xl border border-blue-600 px-8 py-2 text-center font-semibold">
                  Sửa
                </div>

                <div className="w-full rounded-xl border border-red-600 px-8 py-2 text-center font-semibold">
                  Xóa
                </div>
              </div>
            </div>
            {message && <p className="text-center font-semibold">{message}</p>}
          </div>
        </form>
      </div>

      <div className="">
        <Footer />
      </div>
    </div>
  );
}
