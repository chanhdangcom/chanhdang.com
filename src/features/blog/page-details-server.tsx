import React from "react";
import { IPost } from "./types";
import { PostContent } from "./post-content";

type IResponse = {
  data: IPost | null;
};

type IProps = {
  slug: string;
};

export const DetailsPageServer = async ({ slug }: IProps) => {
  const res = await fetch(
    `https://api.quaric.com/api/articles/custom/${slug}`,
    { cache: "no-store" }
  );

  const jsonData = (await res.json()) as IResponse;

  const post = jsonData.data;

  if (post === null) {
    return <div>Post not found</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4">
      <PostContent post={post} />
    </div>
  );
};
