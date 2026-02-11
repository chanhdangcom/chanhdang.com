import { IMusic } from "@/app/[locale]/features/profile/types/music";
import clientPromise from "@/lib/mongodb";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { SuggestAuidoListClient } from "./suggest-audio-list-client";

export async function SuggestCarouselAudio() {
  try {
    // ✅ Kết nối MongoDB
    const client = await clientPromise;
    const db = client.db("musicdb");

    // ✅ Giảm tải dữ liệu để render nhanh hơn
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
            topic: 1,
            srt: 1,
            beat: 1,
            createdAt: 1,
          },
        }
      )
      .sort({ createdAt: -1 })
      .limit(36)
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
            topic: item.topic ? String(item.topic) : undefined,
            srt: item.srt ? String(item.srt) : undefined,
            beat: item.beat ? String(item.beat) : undefined,
          }))
          .filter((m) => m.title && m.audio)
      : [];

    return (
      <div className="relative w-full rounded-3xl text-black dark:text-white md:max-h-full">
        <div className="flex justify-between">
          <Link
            href="/en/music/new-release"
            className="ml-2 flex items-center gap-1 px-1 text-xl font-bold text-black dark:text-white md:ml-[270px]"
          >
            <div>Suggest for you</div>

            <CaretRight
              size={20}
              weight="bold"
              className="text-zinc-500 md:mt-1"
            />
          </Link>
        </div>

        <SuggestAuidoListClient musics={musics} />
      </div>
    );
  } catch (error) {
    console.error("❌ Failed to fetch musics:", error);
    return (
      <div className="text-center text-rose-500">Failed to load music data.</div>
    );
  }
}
