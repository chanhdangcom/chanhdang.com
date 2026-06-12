"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { useParams } from "next/navigation";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { cn } from "@/lib/utils";
import type { NewsArticle } from "../types";

const IMAGE_CLASS =
  "h-full w-full shrink-0 rounded-xl object-cover object-center";

export function NewsListItem({ article }: { article: NewsArticle }) {
  const [isHover, setIsHover] = useState(false);
  const { locale } = useParams();
  const localeStr = (locale as string) || "en";

  return (
    <Link
      href={`/${localeStr}/trangtin/bai-viet/${article.slug}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="block h-full"
    >
      <CardSpotlight className="z-0 flex h-full w-full flex-col rounded-none p-4">
        <div className="relative mx-auto mb-4 aspect-[16/10] w-full overflow-hidden">
          {isHover ? (
            <motion.img
              className={IMAGE_CLASS}
              src={article.coverImage}
              alt={article.title}
              animate={{ x: 10, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            />
          ) : (
            <motion.img
              className={IMAGE_CLASS}
              src={article.coverImage}
              alt={article.title}
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

        <div className="flex flex-1 flex-col space-y-2 dark:text-white">
          <div className="text-sm text-zinc-400">
            {new Date(article.createdAt).toLocaleDateString("en-GB")}
          </div>

          {isHover ? (
            <motion.div
              animate={{ x: 10, y: -10 }}
              className="line-clamp-2 min-h-[3rem] flex-1 font-sans text-base font-semibold hover:underline"
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {article.title}
            </motion.div>
          ) : (
            <motion.div className="line-clamp-2 min-h-[3rem] flex-1 font-sans text-base font-semibold hover:underline">
              {article.title}
            </motion.div>
          )}
        </div>
      </CardSpotlight>
    </Link>
  );
}
