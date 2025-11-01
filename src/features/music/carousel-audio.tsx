import { IMusic } from "@/app/[locale]/features/profile /types/music";
import { AuidoListClient } from "./audio-list-client";
import clientPromise from "@/lib/mongodb";

export default async function CarouselAudio() {
  try {
    // ✅ Query DB trực tiếp trong Server Component (không cần fetch API)
    const client = await clientPromise;
    const db = client.db("musicdb");
    const data = await db.collection("musics").find({}).toArray();

    // ✅ Kiểm tra và chuyển đổi dữ liệu hợp lệ
    const musics: IMusic[] = Array.isArray(data)
      ? data
          .map(
            (
              item: Record<string, unknown> & {
                _id?: { toString(): string } | string;
              }
            ) => ({
              id:
                typeof item._id === "string"
                  ? item._id
                  : item._id?.toString() || "",
              title: String(item.title || ""),
              singer: String(item.singer || ""),
              cover: String(item.cover || ""),
              audio: String(item.audio || ""),
              youtube: String(item.youtube || ""),
              content: String(item.content || ""),
              type: item.type ? String(item.type) : undefined,
            })
          )
          .filter((m: IMusic) => m.title && m.audio) // Chỉ lấy những bài có đủ thông tin
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
  } catch (error) {
    console.error("❌ Failed to fetch musics:", error);
    return (
      <div className="text-center text-red-500">Failed to load music data.</div>
    );
  }
}
