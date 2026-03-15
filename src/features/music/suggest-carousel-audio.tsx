import { IMusic } from "@/app/[locale]/features/profile/types/music";
import clientPromise from "@/lib/mongodb";
import { SuggestCarouselAudioSection } from "./suggest-carousel-audio-section";

export interface SuggestCarouselAudioProps {
  locale?: string;
}

export async function SuggestCarouselAudio({
  locale = "vi",
}: SuggestCarouselAudioProps) {
  try {
    const client = await clientPromise;
    const db = client.db("musicdb");

    const publicFilter = {
      $or: [{ status: { $exists: false } }, { status: "approved" }],
    };

    const data = await db
      .collection("musics")
      .find(
        publicFilter,
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

    return <SuggestCarouselAudioSection musics={musics} locale={locale} />;
  } catch (error) {
    console.error(" Failed to fetch musics:", error);
    return (
      <div className="text-center text-rose-500">
        Failed to load music data.
      </div>
    );
  }
}
