import { IMusic } from "@/app/[locale]/features/profile/types/music";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type Iprop = {
  params: { id: string };
};

async function GetTopic(id: string) {
  const client = await clientPromise;
  const db = await client.db("musicdb");
  const topic = await db
    .collection("topics")
    .findOne({ _id: new ObjectId(id) });

  return topic;
}

export default async function Page({ params }: Iprop) {
  const { id } = await params;
  const topic = await GetTopic(id);

  if (!topic) {
    return <div>Topic not found</div>;
  }

  return (
    <div>
      <div>Đây là trang topic item</div>

      <img src={topic?.cover} alt="" className="size-16 rounded-3xl" />

      <div>{topic?.title}</div>

      <div>{topic?.musics.length}</div>

      <div>
        {topic?.musics.map((music: IMusic) => (
          <div key={music.id}>
            <img src={music.cover} alt="" className="size-16 rounded-3xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
