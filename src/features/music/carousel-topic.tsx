import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { NewAuidoListClient } from "./new-audio-list-client";

export async function CarouselTopic() {
  try {
    const client = await clientPromise;
    const db = await client.db("musicdb");
    const topics = await db.collection("topics").find().toArray();

    if (!topics || topics.length === 0) {
      return null;
    }

    return (
      <div className="w-full">
        {topics
          .sort(() => Math.random() - 0.5)
          .map((topic) => (
            <div key={topic._id.toString()} className="">
              <>
                <Link
                  href={`/en/music/topic/${topic._id.toString()}`}
                  className="relative ml-2 mt-4 flex w-fit items-center gap-1 px-1 text-xl font-bold text-black dark:text-white md:ml-[270px]"
                >
                  <div className="mb-1 mt-2 line-clamp-1">{topic.title}</div>

                  <CaretRight
                    size={20}
                    weight="bold"
                    className="mt-1 text-zinc-500"
                  />
                </Link>
              </>

              <NewAuidoListClient musics={topic.musics} />
            </div>
          ))}
      </div>
    );
  } catch (error) {
    console.error("❌ Failed to fetch topics:", error);
    // Return null to gracefully handle the error without breaking the page
    return null;
  }
}
