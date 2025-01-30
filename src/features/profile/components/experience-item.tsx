import React, { JSX } from "react";
import { ExperienceInfoItem } from "./experience-info-item";
import { BriefcaseBusinessIcon, Building2Icon } from "lucide-react";

type IProps = {
  time: string;

  company: string;
  companyIcon?: JSX.Element;

  jobTitle: string;
  jobIcon?: JSX.Element;

  content: string;
};

export const ExperienceItem = ({
  time,

  company,
  companyIcon,

  jobTitle,
  jobIcon,

  content,
}: IProps) => {
  return (
    <div className="transform rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm transition-transform duration-300 hover:scale-105 dark:border-neutral-800 dark:bg-zinc-900 dark:text-slate-50">
      <div className="text-xl font-bold text-blue-600">{time}</div>

      <ExperienceInfoItem
        icon={companyIcon || <Building2Icon size="1em" />}
        content={company}
      />

      <ExperienceInfoItem
        icon={jobIcon || <BriefcaseBusinessIcon size="1em" />}
        content={jobTitle}
      />

      <div className="mt-2">{content}</div>
    </div>
  );
};
