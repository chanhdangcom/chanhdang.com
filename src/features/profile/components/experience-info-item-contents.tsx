import React from "react";
type IProps = {
  content1?: string;
  content2?: string;
  content3?: string;
  addOn?: React.ReactNode;
};

export const ExperienceIinfoItemContents = ({
  content1,
  content2,
  content3,
  addOn,
}: IProps) => {
  return (
    <div className="space-y-3">
      <div>{content1}</div>
      <div>{content2}</div>
      <div>{content3}</div>
      <div>{addOn}</div>
    </div>
  );
};
