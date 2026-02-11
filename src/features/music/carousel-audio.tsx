import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { AuidoListClient } from "./audio-list-client";
import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";

export default async function CarouselAudio() {
  try {
    // ✅ Kết nối MongoDB
    const client = await clientPromise;
    const db = client.db("musicdb");

    // ✅ Chỉ lấy dữ liệu cần cho carousel để tải nhanh khi chuyển trang
    const data = await db
      .collection("musics")
      .find(
        {},
        {
          projection: {
            title: 1,
            singer: 1,
            cover: 1,
            audio: 1,
            youtube: 1,
            content: 1,
            type: 1,
            srt: 1,
            beat: 1,
            createdAt: 1,
            playCount: 1,
          },
        }
      )
      .sort({ playCount: -1, createdAt: -1 })
      .limit(24)
      .toArray();

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
            srt: item.srt ? String(item.srt) : undefined,
            beat: item.beat ? String(item.beat) : undefined,
          }))
          .filter((m) => m.title && m.audio)
      : [];

    return (
      <div className="relative w-full rounded-3xl text-black dark:text-white md:max-h-full">
        <div className="flex justify-between">
          <Link
            href="/en/music/trending-now"
            className="ml-2 flex cursor-pointer items-center gap-1 px-1 text-xl font-bold text-black dark:text-white md:ml-[270px]"
          >
            <div> Trending Now </div>

            <CaretRight
              size={20}
              weight="bold"
              className="text-zinc-500 md:mt-1"
            />
          </Link>
        </div>

        <AuidoListClient musics={musics} />
      </div>
    );
  } catch (error) {
    console.error("❌ Failed to fetch musics:", error);
    return (
      <div className="text-center text-rose-500">Failed to load music data.</div>
    );
  }
}
