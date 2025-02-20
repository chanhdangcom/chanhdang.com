"use client";
import { useEffect, useState } from "react";
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

  const fetchData = async () => {
    const data = await fetch(
      `https://api.quaric.com/api/articles/custom/${slug}`,
      { method: "GET" }
    );
    const jsonData = (await data.json()) as IResponse;

    if (jsonData.data === null) {
      setPost(null);

      return;
    }

    if (jsonData !== null) {
      setPost(jsonData.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="container">
        {post !== null && <PostContent post={post} />}
      </div>
    </div>
  );
};
