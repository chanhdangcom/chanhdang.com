"use client";
import { useEffect, useState } from "react";
import { IPost } from "./types";
import Link from "next/link";

export const PageList = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const featchData = async () => {
    const data = await fetch("https://api.quaric.com/api/articles/custom", {
      method: "GET",
    });
    const jsonData = await data.json();
    const posts = (await jsonData.data) as IPost[];
    setIsLoading(false);
    setPosts(posts);
  };

  useEffect(() => {
    featchData();
  }, []);
  return (
    <div>
      <div className="container mx-auto w-fit space-y-4 rounded-xl border border-zinc-400 p-6 dark:border-zinc-800">
        {isLoading && <div className="p-2">Loading...</div>}
        {!isLoading && (
          <div>
            {posts.map((posts) => (
              <div key={posts.documentId} className="">
                <Link key={posts.documentId} href={`/blog/${posts.slug}`}>
                  <div className="transform rounded-xl border p-1 text-xl text-zinc-500 shadow-sm transition-transform hover:scale-105 dark:border-zinc-800 dark:bg-zinc-900">
                    {posts.title}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
