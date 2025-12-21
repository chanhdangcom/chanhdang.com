/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { IPost } from "./types";

import { StrapiBlocksRenderer } from "@/components/strapi-blocks-renderer";
import { HeaderMotion } from "@/app/[locale]/features/profile/components/header-motion";
import { ScrollHeaderPage } from "@/components/scroll-header-page";
import { Footer } from "@/app/[locale]/features/profile/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";

type IProps = {
  post: IPost;
};

export const PostContent = ({ post }: IProps) => {
  const { theme } = useTheme();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const withLocale = (path: string) => `/${locale}${path}`;

  return (
    <div className="mt-4">
      <div>
        <>
          <div className="flex items-center justify-between px-2" role="banner">
            <Link href={withLocale("/")}>
              <ChanhdangLogotype />
            </Link>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <ThemeToggle />

                <Link
                  href="https://github.com/chanhdangcom"
                  target="_blank"
                  className="rounded-full border border-zinc-300 p-1 dark:border-zinc-900"
                >
                  <img
                    src={
                      theme === "dark"
                        ? "/img/tech-stack/github-mark-white.svg"
                        : "/img/tech-stack/github-mark.svg"
                    }
                    alt="icon"
                    className="size-6"
                  />
                </Link>
              </div>
            </div>
          </div>
        </>
      </div>

      <HeaderMotion />

      <div className="container mt-8">
        <div className="prose prose-lg prose-zinc mx-auto mb-8 max-w-3xl space-y-4 dark:prose-invert prose-headings:text-balance prose-img:rounded-lg">
          <div className="text-sm">
            {new Date(post.createdAt).toLocaleDateString("vi-VN")}
          </div>

          <h1>{post.title}</h1>

          <StrapiBlocksRenderer contentBlocks={post.content_blocks} />
        </div>
      </div>

      <ScrollHeaderPage />
      <Footer />
    </div>
  );
};
