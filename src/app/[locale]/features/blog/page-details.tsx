"use client";
import { useEffect, useState, useCallback } from "react";
import { IPost } from "./types";
import { PostContent } from "./post-content";

type IProps = {
  slug: string;
};

type IResponse = {
  data: IPost | null;
};

export const PageDetails = ({ slug }: IProps) => {
  const [post, setPost] = useState<IPost | null>(null);

  const fetchData = useCallback(async () => {
    const data = await fetch(
      `https://api.quaric.com/api/articles/custom/${slug}`,
      { method: "GET" }
    );
    const jsonData = (await data.json()) as IResponse;

    if (jsonData.data === null) {
      setPost(null);
      return;
    }

    setPost(jsonData.data);
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <div className="container">{post !== null && <PostContent post={post} />}</div>
    </div>
  );
};
