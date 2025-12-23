import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { NewAuidoListClient } from "./new-audio-list-client";

export async function CarouselTopic() {
  const client = await clientPromise;
  const db = await client.db("musicdb");
  const topics = await db.collection("topics").find().toArray();

  return (
    <div className="w-full">
      {topics.map((topic) => (
        <div key={topic._id.toString()}>
          <Link href={`/en/music/topic/${topic._id.toString()}`}>
            <h2 className="ml-2 flex items-center gap-1 px-1 text-xl font-bold text-black dark:text-white md:ml-[270px]">
              <div className="line-clamp-1"> {topic.title}</div>

              <CaretRight
                size={20}
                weight="bold"
                className="text-zinc-500 md:mt-1"
              />
            </h2>
          </Link>
          <NewAuidoListClient musics={topic.musics} />
        </div>
      ))}
    </div>
  );
}
