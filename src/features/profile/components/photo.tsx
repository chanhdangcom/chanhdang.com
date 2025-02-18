/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
type IPhoto = {
  photoUrl: string;
  time?: string;
  title?: string;
};

export const Photos = ({ photoUrl, time, title }: IPhoto) => {
  return (
    <div className="rounded-xl border shadow-md dark:border-zinc-800">
      <Card className="p-2">
        <CardHeader className="flex-col items-start px-4 pb-0 pt-2">
          {/* <small className="text-default-500 font-mono">Daily Mix</small> */}
          <div>
            <ChanhdangLogotype className="w-24" />
          </div>
          <small className="text-default-500 font-mono text-gray-400">
            {time}
          </small>
          <h4 className="text-large font-semibold">{title}</h4>
        </CardHeader>
        <CardBody className="overflow-visible pt-2">
          <img
            className="h-80 w-72 rounded-xl border border-zinc-300 object-cover shadow-md dark:border-zinc-800 md:h-80 md:w-72"
            src={photoUrl}
            alt="Photo"
          />
        </CardBody>
      </Card>
    </div>
  );
};
