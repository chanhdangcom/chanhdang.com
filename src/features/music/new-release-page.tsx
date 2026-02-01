import clientPromise from "@/lib/mongodb";
import { AudioBar } from "./audio-bar";
import { MotionHeaderMusic } from "./component/motion-header-music";
import { MenuBar } from "./menu-bar";
import { MenuBarMobile } from "./menu-bar-mobile";
import { Footer } from "@/app/[locale]/features/profile/footer";
import { IMusic } from "@/app/[locale]/features/profile/types/music";
import { NewReleaseList } from "./new-release-list";
import { BackButton } from "./component/back-button";

type IProp = {
  searchPage?: boolean;
};

export async function NewReleasePage({ searchPage }: IProp) {
  try {
    const client = await clientPromise;
    const db = client.db("musicdb");
    const data = await db.collection("musics").find({}).toArray();
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
      <div className="flex font-apple">
        <MotionHeaderMusic />
        <MenuBar />

        <div className="mx-auto w-full">
          <div className="relative z-10">
            <BackButton />

            {searchPage ? (
              <div className="mt-4 line-clamp-1 gap-1 px-3 text-start text-xl font-semibold text-black dark:text-white md:ml-[270px]">
                New Release
              </div>
            ) : (
              <div className="mt-4 line-clamp-1 gap-1 px-1 text-center text-xl font-semibold text-black dark:text-white md:ml-[270px]">
                New Release
              </div>
            )}

            <div className="mt-2">
              <NewReleaseList musics={musics} />

              <div className="mt-8 md:ml-[60px]">
                <Footer />
              </div>
            </div>
          </div>

          <div className="my-40">
            <AudioBar />
            <MenuBarMobile />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("❌ Failed to fetch musics:", error);
    return (
      <div className="text-center text-red-500">Failed to load music data.</div>
    );
  }
}
