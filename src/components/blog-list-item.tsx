import { IPost } from "@/features/blog/types";
import Image from "next/image";
import Link from "next/link";

export function BlogListItem({ post }: { post: IPost }) {
  return (
    <>
      <Link key={post.documentId} href={`/blog/${post.slug}`}>
        <div>
          <div className="space-y-4 rounded-xl border bg-zinc-100/50 p-1 dark:border-zinc-800 dark:bg-zinc-950/30">
            <div className="relative mx-auto h-40 w-80">
              <Image
                className="shrink-0 rounded-lg border dark:border-zinc-900"
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
        </div>
      </Link>
    </>
  );
}
