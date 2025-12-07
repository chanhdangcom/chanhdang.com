"use client";
import { IPost } from "@/features/blog/types";
import Link from "next/link";
import { CardSpotlight } from "./ui/card-spotlight";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";
import { useParams } from "next/navigation";

export function BlogListItem({ post }: { post: IPost }) {
  const [isHover, setIsHover] = useState<boolean>(false);
  const { locale } = useParams();

  return (
    <Link
      key={post.documentId}
      href={`/${locale}/blog/${post.slug}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <CardSpotlight className="z-0 h-full w-full rounded-none p-4">
        <div className="relative mx-auto mb-4">
          {isHover ? (
            <motion.img
              className="h-auto w-full shrink-0 rounded-xl"
              src={post.cover.formats.medium.url}
              alt={post.title}
              animate={{ x: 10, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          ) : (
            <motion.img
              className="h-auto w-full shrink-0 rounded-xl"
              src={post.cover.formats.medium.url}
              alt={post.title}
            />
          )}

          {isHover ? (
            <motion.div
              animate={{ x: 10, y: -10 }}
              className={cn(
                "pointer-events-none absolute inset-0 rounded-xl",
                "ring-1 ring-inset ring-black/10 dark:ring-white/10"
              )}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          ) : (
            <motion.div
              className={cn(
                "pointer-events-none absolute inset-0 rounded-xl",
                "ring-1 ring-inset ring-black/10 dark:ring-white/10"
              )}
            />
          )}
        </div>

        <div className="space-y-2 dark:text-white">
          <div className="text-sm text-zinc-400">
            {new Date(post.createdAt).toLocaleDateString("vi-VN")}
          </div>

          {isHover ? (
            <motion.div
              animate={{ x: 10, y: -10 }}
              className="z-20 font-sans text-base font-semibold hover:underline"
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {post.title}
            </motion.div>
          ) : (
            <motion.div className="z-20 font-sans text-base font-semibold hover:underline">
              {post.title}
            </motion.div>
          )}
        </div>
      </CardSpotlight>
    </Link>
  );
}
