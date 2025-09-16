import { IPost } from "@/features/blog/types";
import Image from "next/image";
import Link from "next/link";
import { CardSpotlight } from "./ui/card-spotlight";
import { cn } from "@/lib/utils";

export function BlogListItem({ post }: { post: IPost }) {
  return (
    <Link key={post.documentId} href={`/blog/${post.slug}`}>
      <CardSpotlight className="z-0 h-full w-auto rounded-none p-4">
        <div className="relative mx-auto mb-4 h-56 w-auto">
          <Image
            className="shrink-0 rounded-xl"
            src={post.cover.formats.medium.url}
            alt={post.title}
            fill
          />

          <div
            className={cn(
              "pointer-events-none absolute inset-0 rounded-xl",
              "ring-1 ring-inset ring-black/10 dark:ring-white/10"
            )}
          />
        </div>

        <div className="space-y-2 dark:text-white">
          <div className="text-sm text-zinc-400">
            {new Date(post.createdAt).toLocaleDateString("vi-VN")}
          </div>

          <div className="z-20 font-apple text-base font-semibold hover:underline">
            {post.title}
          </div>
        </div>
      </CardSpotlight>
    </Link>
  );
}
