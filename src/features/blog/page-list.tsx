"use client";
import { useEffect, useState } from "react";
import { IPost } from "./types";
import Link from "next/link";
import qs from "qs";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carouse";
import { ExperienceInfoItem } from "../profile/components/experience-info-item";
import { DrawerBlog } from "../profile/drawer-blog";
import { BookIcon } from "lucide-react";

type viewOrList = {
  isList?: true;
};

export const PageList = ({ isList }: viewOrList) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const featchData = async () => {
    const queryParams = qs.stringify(
      {
        populate: {
          cover: true,
        },
        sort: ["updatedAt:desc"],
      },
      {
        encodeValuesOnly: true,
      }
    );
    const data = await fetch(
      `https://api.quaric.com/api/articles/custom?${queryParams}`,
      {
        method: "GET",
      }
    );
    const jsonData = await data.json();
    const posts = (await jsonData.data) as IPost[];
    console.log("🚀 ~ featchData ~ posts:", posts);
    setIsLoading(false);
    setPosts(posts);
  };

  useEffect(() => {
    featchData();
  }, []);

  if (isList) {
    return (
      <div className="container mx-auto">
        {isLoading && <div className="p-2">Loading...</div>}
        {!isLoading && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {posts.map((post) => (
              <div
                key={post.documentId}
                className="max-w-xs transform rounded-xl transition-transform duration-300 hover:scale-105"
              >
                <Link key={post.documentId} href={`/blog/${post.slug}`}>
                  <div className="space-y-4 rounded-xl border bg-zinc-100/50 p-1 dark:border-zinc-800 dark:bg-zinc-950/30">
                    <div className="relative mx-auto aspect-video">
                      <Image
                        className="rounded-lg border dark:border-zinc-900"
                        src={post.cover.formats.medium.url}
                        alt={post.title}
                        fill
                      />
                    </div>
                    <div className="line-clamp-2 h-20 rounded-xl p-1 font-medium dark:text-white">
                      {post.title}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="mt-4">
      <div className="my-2 flex items-center justify-between space-x-2 font-mono text-sm">
        <ExperienceInfoItem icon={<BookIcon />} content="Blogs" />
        <DrawerBlog />
      </div>
      <Carousel className="w-full max-w-4xl">
        <CarouselContent>
          {posts.map((post) => (
            <CarouselItem className="md:basis-1/3" key={post.documentId}>
              <Link key={post.documentId} href={`/blog/${post.slug}`}>
                <div className="space-y-4 rounded-xl border bg-zinc-100/50 p-1 dark:border-zinc-800 dark:bg-zinc-950/30">
                  <div className="relative mx-auto aspect-video">
                    <Image
                      className="rounded-lg border dark:border-zinc-900"
                      src={post.cover.formats.medium.url}
                      alt={post.title}
                      fill
                    />
                  </div>
                  <div className="line-clamp-2 h-20 rounded-xl p-1 font-medium dark:text-white">
                    {post.title}
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
