import React, { JSX } from "react";

type IProps = {
  icon: JSX.Element;
  content: React.ReactNode;
  extra?: React.ReactNode;
};

export const IntroItem = ({ icon, content, extra }: IProps) => {
  return (
    <div className="flex items-center md:text-lg">
      <div className="mr-4 text-zinc-500">{icon}</div>
      <div className="flex items-center space-x-2 font-mono">
        {content}
        {extra}
      </div>
    </div>
  );
};
