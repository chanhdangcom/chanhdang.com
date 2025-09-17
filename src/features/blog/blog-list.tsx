import Link from "next/link";
import React from "react";
import { IPost } from "./types";
import { BlogListItem } from "@/components/blog-list-item";

export function BlogList({ posts }: { posts: IPost[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4">
      {posts.map((post) => (
        <div key={post.documentId} className="">
          <Link key={post.documentId} href={`/blog/${post.slug}`}>
            <BlogListItem post={post} />
          </Link>
        </div>
      ))}
    </div>
  );
}
