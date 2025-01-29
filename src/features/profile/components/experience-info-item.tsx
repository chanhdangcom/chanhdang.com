import React, { JSX } from "react";

type IProps = {
  icon: JSX.Element;
  content: React.ReactNode;
};

export const ExperienceInfoItem = ({ icon, content }: IProps) => {
  return (
    <div className="flex items-center">
      <div className="mr-2 text-blue-600">{icon}</div>
      <div>{content}</div>
    </div>
  );
};
