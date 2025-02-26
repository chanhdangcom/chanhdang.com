"use client";
import React from "react";
import { IPost } from "./types";

import { Footer } from "../profile/footer";

import { HeaderMotion } from "../profile/components/header-motion";
import { StrapiBlocksRenderer } from "@/components/strapi-blocks-renderer";
import { Header } from "../profile/header";

type IProps = {
  post: IPost;
};

export const PostContent = ({ post }: IProps) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("vi-VN");

  return (
    <div className="mt-4">
      <HeaderMotion />
      <Header />

      <div className="container mt-8">
        <div className="prose prose-lg prose-zinc mx-auto mb-8 max-w-3xl dark:prose-invert prose-headings:text-balance prose-img:rounded-lg">
          <div className="text-sm">{formattedDate}</div>
          <h1>{post.title}</h1>
          <StrapiBlocksRenderer contentBlocks={post.content_blocks} />
        </div>
      </div>

      <Footer />
    </div>
  );
};
