import { IPost } from "@/features/blog/types";
import Image from "next/image";
import Link from "next/link";
import { CardSpotlight } from "./ui/card-spotlight";

export function BlogListItem({ post }: { post: IPost }) {
  return (
    <CardSpotlight className="z-0 h-full w-auto rounded-none p-4">
      <Link key={post.documentId} href={`/blog/${post.slug}`}>
        <>
          <div className="space-y-4">
            <div className="relative mx-auto h-48 w-auto">
              <Image
                className="shrink-0 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800"
                src={post.cover.formats.medium.url}
                alt={post.title}
                fill
              />
            </div>

            <div className="h-fit space-y-2 dark:text-white">
              <div className="text-xs text-zinc-400">
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </div>

              <div className="z-20 line-clamp-2 font-apple text-lg font-semibold hover:underline">
                {post.title}
              </div>
            </div>
          </div>
        </>
      </Link>
    </CardSpotlight>
  );
}
