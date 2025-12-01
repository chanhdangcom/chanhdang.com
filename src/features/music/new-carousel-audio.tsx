import { IMusic } from "@/app/[locale]/features/profile /types/music";
import clientPromise from "@/lib/mongodb";
import { NewAuidoListClient } from "./new-audio-list-client";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export async function NewCarouselAudio() {
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
            srt: item.srt ? String(item.srt) : undefined,
            beat: item.beat ? String(item.beat) : undefined,
          }))
          .filter((m) => m.title && m.audio)
      : [];

    return (
      <div className="w-full rounded-3xl text-black dark:text-white md:max-h-full">
        <div className="flex justify-between">
          <Link
            href="/music/new-release"
            className="ml-2 flex items-center gap-1 px-1 text-xl font-bold text-black dark:text-white md:ml-[270px]"
          >
            <div>New Release</div>

            <CaretRight
              size={20}
              weight="bold"
              className="text-zinc-500 md:mt-1"
            />
          </Link>
        </div>

        <NewAuidoListClient musics={musics} />
      </div>
    );
  } catch (error) {
    console.error("❌ Failed to fetch musics:", error);
    return (
      <div className="text-center text-red-500">Failed to load music data.</div>
    );
  }
}
