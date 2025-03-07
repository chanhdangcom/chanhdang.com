"use client";

import { cn } from "@/utils/cn";
import React, { useEffect, useState } from "react";

export const PlayButton = () => {
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
        className={cn("", {
          "": isLike,
        })}
        onClick={handleClick}
      >
        {!isLike ? (
          <>
            <span>Play</span>
          </>
        ) : (
          <>
            <span>Pause</span>
          </>
        )}
      </button>
    </div>
  );
};
