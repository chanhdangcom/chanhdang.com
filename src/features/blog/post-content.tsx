import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import React from "react";
import { IPost } from "./types";

type IProps = {
  post: IPost;
};

export const PostContent = ({ post }: IProps) => {
  return (
    <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none">
      <h1>{post.title}</h1>
      <BlocksRenderer content={post.content_blocks} />
    </div>
  );
};
