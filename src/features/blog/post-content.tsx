"use client";
import React from "react";
import { IPost } from "./types";

import { StrapiBlocksRenderer } from "@/components/strapi-blocks-renderer";
import { Header } from "@/app/[locale]/features/profile /header";
import { HeaderMotion } from "@/app/[locale]/features/profile /components/header-motion";
import { ScrollHeaderPage } from "@/components/scroll-header-page";
import { Footer } from "@/app/[locale]/features/profile /footer";

type IProps = {
  post: IPost;
};

export const PostContent = ({ post }: IProps) => {
  return (
    <div className="mt-4">
      <Header />
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
