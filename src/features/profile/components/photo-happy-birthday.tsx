/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";

type IPhoto = {
  photoUrl: string;
  time?: string;
  title?: string;
};

export const PhotoHappyBirthday = ({ photoUrl, time, title }: IPhoto) => {
  return (
    <div className="rounded-xl border bg-zinc-100/50 p-1 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold">{title}</div>
          <div className="text-default-500 font-mono text-xs text-gray-400">
            {time}
          </div>
        </div>
      </div>

      <div className="overflow-visible pt-2">
        <img
          className="h-96 w-80 rounded-lg border border-zinc-300 object-cover dark:border-zinc-800"
          src={photoUrl}
          alt="Photo"
        />
      </div>
    </div>
  );
};
