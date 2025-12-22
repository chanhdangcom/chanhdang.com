import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import { NewReleaseList } from "./new-release-list";

export async function CarouselTopic() {
  const client = await clientPromise;
  const db = await client.db("musicdb");
  const topics = await db.collection("topics").find().toArray();

  return (
    <div>
      {topics.map((topic) => (
        <div key={topic._id.toString()}>
          <Link href={`/en/music/topic/${topic._id.toString()}`}>
            <div className="mx-4 text-xl font-bold md:ml-[270px]">
              {topic.title}
            </div>
          </Link>

          <NewReleaseList musics={topic.musics} />
        </div>
      ))}
    </div>
  );
}
