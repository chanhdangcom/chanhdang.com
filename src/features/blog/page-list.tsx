"use client";

import React, { useEffect, useState } from "react";
import { IPost } from "./types";
import Link from "next/link";

// 1. Hoc sau them: Async/Await in JS/TS

// 2. Chuc nang Weather

// const iconUrl = 'https://openweathermap.org/img/wn/' + icon + '@2x.png'
// const iconName = "01n";
// const iconUrl = `https://openweathermap.org/img/wn/${iconName}@2x.png`;

export const PageBlogList = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   fetch("https://api.quaric.com/api/articles/custom", {
  //     method: "GET",
  //   })
  //     .then((data) => data.json())
  //     .then((jsonData) => {
  //       const posts = jsonData.data as IPost[];
  //       setPosts(posts);
  //       setIsLoading(false);
  //     });
  // }, []);

  const fetchData = async () => {
    const data = await fetch("https://api.quaric.com/api/articles/custom", {
      method: "GET",
    });
    const jsonData = await data.json();
    const posts = jsonData.data as IPost[];
    setPosts(posts);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1>PageBlogList</h1>

      {isLoading && <div>Loading...</div>}

      {!isLoading && posts.length > 0 && (
        <div className="space-y-4 border border-red-500">
          {posts.map((post) => {
            return (
              <div key={post.documentId}>
                <Link href={`/blogtraining/${post.slug}`}>
                  <h2 className="cursor-pointer">{post.title}</h2>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && !posts.length && <div>No Posts</div>}
    </div>
  );
};
