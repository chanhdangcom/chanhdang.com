"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { ExperienceItem } from "./components/experience-item";
import { SchoolIcon } from "lucide-react";
import { CodeTag } from "@/components/code-tag";
import { Student } from "phosphor-react";

type IExperienceItem = {
  time: string;
  company: string;
  jobTitle?: string;
  contentMarkdown?: string;
  content?: React.ReactNode;
  isWorking?: boolean;
  skills?: string[];
};

export const ExperienceList = () => {
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

  const EXPERIENCE_EDUCATION: IExperienceItem[] = [
    {
      time: t("experience.education.university.time"),
      company: t("experience.education.university.company"),
      contentMarkdown: t("experience.education.university.content"),
      skills: ["C/C++", "Python", ".NET", "PHP", "JavaScript", "Teamwork"],
      isWorking: true,
    },
    {
      time: t("experience.education.highSchool.time"),
      company: t("experience.education.highSchool.company"),
      contentMarkdown: t("experience.education.highSchool.content"),
      skills: ["Pascal"],
    },
    {
      time: t("experience.education.secondarySchool.time"),
      company: t("experience.education.secondarySchool.company"),
      contentMarkdown: t("experience.education.secondarySchool.content"),
      skills: ["Pascal"],
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

          <div className="ml-2 text-balance border-l border-zinc-200 text-sm dark:border-zinc-900">
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

        <div className="p-2">
          <CodeTag
            tagName="Education"
            className="ml-2 text-cyan-500 dark:text-cyan-400"
          />

          <div className="text-balanc ml-2 border-l border-zinc-200 text-sm dark:border-zinc-900">
            {EXPERIENCE_EDUCATION.map((item, index) => {
              return (
                <ExperienceItem
                  key={index}
                  time={item.time}
                  company={item.company}
                  companyIcon={<SchoolIcon size="1em" />}
                  jobTitle={item.jobTitle}
                  jobIcon={<Student size={32} weight="fill" className="" />}
                  contentMarkdown={item.contentMarkdown}
                  content={item.content}
                  skills={item.skills}
                  isWorking={item.isWorking}
                />
              );
            })}
          </div>

          <CodeTag
            tagName="Education"
            isCloseTag
            className="ml-2 text-cyan-500 dark:text-cyan-400"
          />
        </div>
      </div>
    </>
  );
};
