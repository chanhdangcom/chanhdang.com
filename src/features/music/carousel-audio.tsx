import { IMusic } from "@/app/[locale]/features/profile /types/music";
import { AuidoListClient } from "./audio-list-client";
import clientPromise from "@/lib/mongodb";

export default async function CarouselAudio() {
  try {
    // ✅ Kết nối MongoDB
    const client = await clientPromise;
    const db = client.db("musicdb");

    // ✅ Lấy toàn bộ dữ liệu
    const data = await db.collection("musics").find({}).toArray();

    // ✅ Chuyển đổi dữ liệu an toàn
    const musics: IMusic[] = Array.isArray(data)
      ? data
          .map((item) => ({
            id:
              typeof item._id === "string"
                ? item._id
                : (item._id?.toString() ?? ""),
            title: String(item.title ?? ""),
            singer: String(item.singer ?? ""),
            cover: String(item.cover ?? ""),
            audio: String(item.audio ?? ""),
            youtube: String(item.youtube ?? ""),
            content: String(item.content ?? ""),
            type: item.type ? String(item.type) : undefined,
          }))
          .filter((m) => m.title && m.audio)
      : [];

    // ✅ Render UI
    return (
      <div className="w-full rounded-3xl text-black dark:text-white md:max-h-full">
        <div className="flex justify-between">
          <h2 className="ml-2 px-1 text-2xl font-bold text-black dark:text-white md:ml-[270px]">
            Trending Now
          </h2>
        </div>

        {/* ✅ Client Component */}
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
