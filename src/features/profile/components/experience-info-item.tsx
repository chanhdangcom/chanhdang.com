import React, { JSX } from "react";

type IProps = {
  icon: JSX.Element;
  content: React.ReactNode;
  extra?: React.ReactNode;
};

export const ExperienceInfoItem = ({ icon, content, extra }: IProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex size-6 items-center justify-center bg-zinc-50 text-pink-400 dark:bg-zinc-950">
        {icon}
      </div>
      <div>{content}</div>
      {extra && <div>{extra}</div>}
      {/* {extra ? <div>{extra}</div> : null} */}
    </div>
  );
};
