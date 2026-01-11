import { Footer } from "@/app/[locale]/features/profile/footer";
import { AudioBar } from "@/features/music/audio-bar";
import { BackButton } from "@/features/music/component/back-button";
import { MotionHeaderMusic } from "@/features/music/component/motion-header-music";
import { HeaderMusicPage } from "@/features/music/header-music-page";
import { MenuBar } from "@/features/music/menu-bar";
import { MenuBarMobile } from "@/features/music/menu-bar-mobile";
import { TopicList } from "@/features/music/topic-list";
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
      <div className="flex font-apple">
        <MotionHeaderMusic />
        <MenuBar />

        <div className="mx-auto w-full">
          <div className="relative z-10">
            <div className="z-20 hidden md:ml-[270px] md:flex">
              <HeaderMusicPage />
            </div>

            <BackButton className="left-3" />

            <div className="mt-4 line-clamp-1 gap-1 px-1 text-center text-xl font-bold text-black dark:text-white md:ml-[270px]">
              {topic?.title}
            </div>

            <div className="mt-4">
              <TopicList musics={topic?.musics} />

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
    </div>
  );
}
