import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IPost } from "./types";

export function BlogList({ posts }: { posts: IPost[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {posts.map((post) => (
        <div
          key={post.documentId}
          className="max-w-xs transform rounded-xl transition-transform duration-300 md:hover:scale-105"
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

              <div className="line-clamp-2 h-24 rounded-xl p-1 font-medium dark:text-white">
                <div className="text-sm font-light text-zinc-400">
                  {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                </div>
                {post.title}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
