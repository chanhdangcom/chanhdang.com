import React from "react";

type IProps = {
  iconUrl: string;
};

export const TechStackItem = ({ iconUrl }: IProps) => {
  return (
    <div className="">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={iconUrl} alt="" className="size-8" />
    </div>
  );
};
