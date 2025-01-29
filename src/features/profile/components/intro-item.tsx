import React, { JSX } from "react";

type IProps = {
  icon: JSX.Element;
  content: React.ReactNode;
};

export const IntroItem = ({ icon, content }: IProps) => {
  return (
    <div className="flex items-center text-lg">
      <div className="mr-4 text-zinc-500">{icon}</div>
      <div className="font-mono">{content}</div>
    </div>
  );
};
