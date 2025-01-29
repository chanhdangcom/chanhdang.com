"use client";

import { ThumbsUpIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

export const LikeButton = () => {
  const [isLike, setIsLike] = useState(false);

  const handleClick = () => {
    setIsLike((prevIsLike) => {
      const nextIsLike = !prevIsLike;
      localStorage.setItem("isLike", String(nextIsLike));
      return nextIsLike;
    });
  };

  useEffect(() => {
    const isLikeFromLS = localStorage.getItem("isLike") === "true";
    setIsLike(isLikeFromLS);
  }, []);

  return (
    <div>
      <button
        className="w-24 cursor-pointer rounded-2xl border bg-slate-100 px-4 py-2 font-semibold dark:border-neutral-800 dark:bg-zinc-900"
        onClick={handleClick}
      >
        {!isLike ? (
          <p className="flex justify-center gap-1">
            <ThumbsUpIcon />
            Like
          </p>
        ) : (
          <p className="flex justify-center gap-1 text-blue-700 dark:text-blue-600">
            <ThumbsUpIcon />
            Liked
          </p>
        )}
      </button>
    </div>
  );
};
