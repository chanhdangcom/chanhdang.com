import React, { JSX } from "react";
import { ExperienceInfoItem } from "./experience-info-item";

import { Ping } from "@/components/ping";
import { TechStudiesItem } from "@/components/tech-studies-item";

import ReactMarkdown from "react-markdown";
import { Bag } from "@phosphor-icons/react/dist/ssr";

type IProps = {
  time: string;

  company: string;
  companyIcon?: JSX.Element;

  jobTitle?: string;
  jobIcon?: JSX.Element;

  contentMarkdown?: string;
  content?: React.ReactNode;
  skills?: string[];

  isWorking?: boolean;
};

export const ExperienceItem = ({
  time,

  company,
  // companyIcon,

  jobTitle,
  jobIcon,

  contentMarkdown,
  // content,
  skills = [],

  isWorking = false,
}: IProps) => {
  return (
    <div className="relative ml-2 py-2 first:before:absolute first:before:top-0 first:before:z-[1] first:before:size-6 first:before:bg-zinc-50 last:after:absolute last:after:bottom-0 last:after:z-[1] last:after:size-[13px] last:after:bg-zinc-50 dark:first:before:bg-zinc-950 dark:last:after:bg-zinc-950">
      <div className="absolute left-3 top-0 h-full w-px bg-zinc-200 dark:bg-zinc-800" />

      <div className="relative z-[2] mb-2 text-lg font-semibold">
        <ExperienceInfoItem
          icon={jobIcon || <Bag size={32} weight="fill" className="" />}
          content={company}
          extra={isWorking && <Ping />}
        />
      </div>

      <div className="ml-8 space-y-2 font-mono text-sm">
        <div className="text-zinc-400">{time}</div>
        <div>{jobTitle}</div>

        <div className="prose prose-sm prose-zinc max-w-none dark:prose-invert">
          <ReactMarkdown>{contentMarkdown}</ReactMarkdown>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <TechStudiesItem key={skill} techName={skill} />
          ))}
        </div>
      </div>
    </div>
  );
};
