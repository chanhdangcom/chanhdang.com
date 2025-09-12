import { IPost } from "@/features/blog/types";
import Image from "next/image";
import Link from "next/link";

export function BlogListItem({ post }: { post: IPost }) {
  return (
    <>
      <Link key={post.documentId} href={`/blog/${post.slug}`}>
        <>
          <div className="space-y-2 p-2">
            <div className="relative mx-auto h-44 w-full">
              <Image
                className="shrink-0 rounded-2xl border border-zinc-200 dark:border-zinc-800"
                src={post.cover.formats.medium.url}
                alt={post.title}
                fill
              />
            </div>

            <div className="h-fit space-y-2 dark:text-white">
              <div className="text-xs text-zinc-400">
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </div>

              <div className="line-clamp-2 text-base font-semibold hover:underline">
                {post.title}
              </div>
            </div>
          </div>
        </>
      </Link>
    </>
  );
}
