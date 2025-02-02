/* eslint-disable @next/next/no-img-element */
import React from "react";

type IProbs = {
  iconUrl: string;
};

export const FloatingDockItem = ({ iconUrl }: IProbs) => {
  return (
    <div>
      <img src={iconUrl} alt="" className="size-8" />
    </div>
  );
};
