"use client";

import React, { useEffect, useState } from "react";
import { IPost } from "./types";
import { PostContent } from "./post-content";

type IResponse = {
  data: IPost | null;
};

type IProps = {
  slug: string;
};

export const BlogDetailsPageClient = ({ slug }: IProps) => {
  const [post, setPost] = useState<IPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const res = await fetch(
      `https://api.quaric.com/api/articles/custom/${slug}`
    );

    const jsonData = (await res.json()) as IResponse;

    if (jsonData.data === null) {
      setPost(null);
      setIsLoading(false);
      return;
    }

    setPost(jsonData.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4">
      {isLoading && <div>Loading...</div>}

      {!isLoading && post !== null && <PostContent post={post} />}

      {!isLoading && post === null && <div>Post not found</div>}
    </div>
  );
};
