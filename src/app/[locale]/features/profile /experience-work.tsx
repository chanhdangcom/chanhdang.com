"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { ExperienceItem } from "./components/experience-item";
import { CodeTag } from "@/components/code-tag";

type IExperienceItem = {
  time: string;
  company: string;
  jobTitle?: string;
  contentMarkdown?: string;
  content?: React.ReactNode;
  isWorking?: boolean;
  skills?: string[];
};

export const ExperienceWork = () => {
  const t = useTranslations();

  const EXPERIENCE_WORK: IExperienceItem[] = [
    {
      time: t("experience.work.intern"),
      company: t("experience.work.company"),
      contentMarkdown: t("experience.work.content"),
      skills: [
        "React",
        "Next.js",
        "Tailwind CSS",
        "Docker",
        "TypeScript",
        "Github",
        "UX/UI",
        "Library",
      ],
      isWorking: true,
    },
  ];

  return (
    <>
      <div className="scroll-mt-8">
        <div className="p-2">
          <CodeTag
            tagName="Work"
            className="ml-2 text-cyan-500 dark:text-cyan-400"
          />

          <div className="ml-2 text-balance border-l border-zinc-200 text-sm dark:border-zinc-800">
            {EXPERIENCE_WORK.map((item, index) => {
              return (
                <ExperienceItem
                  key={index}
                  time={item.time}
                  jobTitle={item.jobTitle}
                  company={item.company}
                  contentMarkdown={item.contentMarkdown}
                  content={item.content}
                  skills={item.skills}
                  isWorking={item.isWorking}
                />
              );
            })}
          </div>

          <CodeTag
            tagName="Work"
            isCloseTag
            className="ml-2 text-cyan-500 dark:text-cyan-400"
          />
        </div>
      </div>
    </>
  );
};
