import React, { JSX } from "react";
import { ExperienceInfoItem } from "./experience-info-item";
import { BriefcaseBusinessIcon } from "lucide-react";
import { Ping } from "@/components/ping";

type IProps = {
  time: string;

  company: string;
  companyIcon?: JSX.Element;

  jobTitle?: string;
  jobIcon?: JSX.Element;

  content: string;

  isWorking?: boolean;
};

export const ExperienceItem = ({
  time,

  company,
  // companyIcon,

  jobTitle,
  jobIcon,

  content,

  isWorking = false,
}: IProps) => {
  return (
    <div className="relative ml-2 py-2 first:before:absolute first:before:top-0 first:before:z-[1] first:before:size-6 first:before:bg-zinc-50 dark:first:before:bg-zinc-950">
      <div className="absolute left-3 top-0 h-full w-px bg-zinc-200 dark:bg-zinc-800" />

      <div className="relative z-[2] mb-2 text-lg font-semibold">
        <ExperienceInfoItem
          icon={jobIcon || <BriefcaseBusinessIcon size="1em" />}
          content={company}
          extra={isWorking && <Ping />}
        />
      </div>

      <div className="ml-8 space-y-2 font-mono text-sm">
        <div className="text-zinc-400">{time}</div>
        <div>{jobTitle}</div>
        <div>{content}</div>
      </div>
    </div>
  );
};
