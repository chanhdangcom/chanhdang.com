"use client";
import { useEffect, useState } from "react";
import { IPost } from "../blog/types";
import { PostContent } from "../blog/post-content";

type IProp = {
  slug: string;
};
type IResponse = {
  data: IPost | null;
};
export const BlogTrainingPage = ({ slug }: IProp) => {
  const [post, setPost] = useState<IPost | null>(null);
  const fetchData = async () => {
    const res = await fetch(
      `https://api.quaric.com/api/articles/custom/${slug}`
    );
    const jsonData = (await res.json()) as IResponse;
    if (jsonData == null) {
      setPost(null);
      return;
    }
    setPost(jsonData.data);
  };

  useEffect(() => {
    fetchData();
  });
  return <div>{post !== null && <PostContent post={post} />}</div>;
};
