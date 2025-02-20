import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import React from "react";
import { IPost } from "./types";

import { Footer } from "../profile/footer";

import { SwitchTheme } from "@/components/switch-theme";
import { HeaderMotion } from "../profile/components/header-motion";

type IProps = {
  post: IPost;
};

export const PostContent = ({ post }: IProps) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("vi-VN");

  return (
    <div className="my-4 grid justify-center gap-y-4">
      <HeaderMotion />
      <div className="container prose prose-lg prose-zinc dark:prose-invert prose-img:rounded-lg md:max-w-3xl">
        <small className="my-8 grid grid-cols-2 items-center gap-2 text-zinc-400">
          <div className="text-lg">{formattedDate}</div>
          <div className="flex w-full justify-end">
            <SwitchTheme />
          </div>
        </small>
        <h1 className="text-3xl">{post.title}</h1>
        <BlocksRenderer content={post.content_blocks} />
      </div>
      <Footer />
    </div>
  );
};
