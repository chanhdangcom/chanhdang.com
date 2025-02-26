"use client";

import { CarouselItem } from "@/components/ui/carouse";
import Link from "next/link";
import React from "react";
import { motion } from "motion/react";
import { IPost } from "./types";
import Image from "next/image";

export function BlogCarouselItem({ post }: { post: IPost }) {
  return (
    <CarouselItem className="md:basis-1/3" key={post.documentId}>
      <Link key={post.documentId} href={`/blog/${post.slug}`}>
        <motion.div
          animate={{ x: [-5, 5, -5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="transform space-y-4 rounded-xl border bg-zinc-100/50 p-1 transition-transform duration-300 dark:border-zinc-800 dark:bg-zinc-950/30 md:hover:scale-105">
            <div className="relative mx-auto aspect-video">
              <Image
                className="rounded-lg border dark:border-zinc-900"
                src={post.cover.formats.medium.url}
                alt={post.title}
                fill
              />
            </div>
            <div className="line-clamp-2 h-24 rounded-xl p-1 font-semibold dark:text-white">
              <div className="text-sm font-light text-zinc-400">
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </div>
              {post.title}
            </div>
          </div>
        </motion.div>
      </Link>
    </CarouselItem>
  );
}
