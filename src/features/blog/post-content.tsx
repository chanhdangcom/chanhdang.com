import React from "react";
import { IPost } from "./types";

import { Footer } from "../profile/footer";

import { SwitchTheme } from "@/components/switch-theme";
import { HeaderMotion } from "../profile/components/header-motion";
import { StrapiBlocksRenderer } from "@/components/strapi-blocks-renderer";
import { LoadingBar } from "@/components/loading-bar";

type IProps = {
  post: IPost;
};

export const PostContent = ({ post }: IProps) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("vi-VN");

  return (
    <div>
      <LoadingBar />
      <div className="py-4">
        <HeaderMotion />

        <div className="container">
          <header className="mb-8 flex items-center justify-between text-zinc-400">
            <div className="text-lg">{formattedDate}</div>
            <SwitchTheme />
          </header>

          <div className="prose prose-lg prose-zinc mx-auto mb-8 max-w-3xl dark:prose-invert prose-headings:text-balance prose-img:rounded-lg">
            <h1>{post.title}</h1>
            <StrapiBlocksRenderer contentBlocks={post.content_blocks} />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};
