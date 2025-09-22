/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";

type IPhoto = {
  photoUrl: string;
  time?: string;
  title?: string;
};

export const Photos = ({ photoUrl, time, title }: IPhoto) => {
  return (
    <div className="p-1">
      <>
        <div className="font-mono">
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-default-500 font-mono text-xs text-gray-400">
            {time}
          </div>
        </div>
      </>

      <img className="h-96 w-full bg-cover" src={photoUrl} alt="Photo" />
    </div>
  );
};
