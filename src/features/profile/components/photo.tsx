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
    <div className="rounded-xl border bg-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-900/50">
      <Card className="p-1">
        <CardHeader className="flex-col items-start">
          <div className="">
            <ChanhdangLogotype className="w-20" />
          </div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <small className="text-default-500 font-mono text-gray-400">
            {time}
          </small>
        </CardHeader>
        <CardBody className="overflow-visible pt-2">
          <img
            className="h-96 w-80 rounded-lg border border-zinc-300 object-cover dark:border-zinc-800"
            src={photoUrl}
            alt="Photo"
          />
        </CardBody>
      </Card>
    </div>
  );
};
