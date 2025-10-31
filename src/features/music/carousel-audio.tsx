import { IMusic } from "@/app/[locale]/features/profile /types/music";
import { AuidoListClient } from "./audio-list-client";

export default async function CarouselAudio() {
  // ✅ Xác định base URL cho SSR fetch
  const base =
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  // ✅ Fetch dữ liệu từ API (SSR)
  const res = await fetch(`${base.replace(/\/+$/, "")}/api/musics`, {
    cache: "no-store", // Không cache để luôn lấy data mới
  });

  // ✅ Nếu lỗi, log ra console (chỉ hiển thị server side)
  if (!res.ok) {
    console.error("❌ Failed to fetch musics:", res.status, res.statusText);
    return (
      <div className="text-center text-red-500">Failed to load music data.</div>
    );
  }

  // ✅ Parse dữ liệu
  const data = await res.json();

  // ✅ Kiểm tra và chuyển đổi dữ liệu hợp lệ
  const musics: IMusic[] = Array.isArray(data)
    ? data.map((item) => ({
        ...item,
        id: typeof item._id === "string" ? item._id : item._id?.toString(),
      }))
    : [];

  // ✅ Render phần UI
  return (
    <div className="w-full rounded-3xl text-black dark:text-white md:max-h-full">
      <div className="flex justify-between">
        <div className="flex gap-1 text-3xl font-bold">
          <div className="ml-2 px-1 text-2xl text-black dark:text-white md:ml-[270px]">
            Trending Now
          </div>
        </div>
      </div>

      {/* ✅ Client Component: render danh sách audio */}
      <AuidoListClient musics={musics} />
    </div>
  );
}
