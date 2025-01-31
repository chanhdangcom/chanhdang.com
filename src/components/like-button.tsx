"use client";

import { cn } from "@/utils/cn";
import { ThumbsUpIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

export const LikeButton = () => {
  const [isLike, setIsLike] = useState(
    typeof localStorage !== "undefined" &&
      localStorage.getItem("isLike") === "true"
  );

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClick = () => {
    setIsLike((prevIsLike) => {
      const nextIsLike = !prevIsLike;
      localStorage.setItem("isLike", String(nextIsLike));
      return nextIsLike;
    });
  };

  if (!isClient) return null;

  <p></p>;

  return (
    <div>
      <button
        className={cn(
          "flex min-w-28 cursor-pointer items-center justify-center space-x-1 rounded-2xl border bg-slate-100 py-2 font-mono font-semibold text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400",
          {
            "text-pink-500 dark:border-pink-400/50 dark:text-pink-400": isLike,
          }
        )}
        onClick={handleClick}
      >
        {!isLike ? (
          <>
            <ThumbsUpIcon size={20} className="relative -top-px" />
            <span>Like</span>
          </>
        ) : (
          <>
            <ThumbsUpIcon size={20} className="relative -top-px" />
            <span>Liked</span>
          </>
        )}
      </button>
    </div>
  );
};
