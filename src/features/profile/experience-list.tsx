"use client";
import React from "react";
import { ExperienceItem } from "./components/experience-item";
import { GraduationCapIcon, SchoolIcon } from "lucide-react";
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

const EXPERIENCE_WORK: IExperienceItem[] = [
  {
    time: "Intern | 2023 - Present",
    company: "Quaric Co., Ltd.",
    contentMarkdown:
      "- I had the opportunity to intern at a technology company where I got to work on real-world software development projects. During my internship, I learned how to work in a team, manage my time, and apply my knowledge to solving real-world problems.\n\n - This was an important stepping stone to help me better understand the professional working environment and strengthen my skills.",

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
    time: "Full-time | 2022 - Present",
    company: "An Giang University",
    contentMarkdown:
      "- I had the opportunity to intern at a technology company where I got to work on real-world software development projects. During my internship, I learned how to work in a team, manage my time, and apply my knowledge to solving real-world problems.\n\n- These experiences nurtured a passion for technology and a willingness to adapt to change.\n\n",

    skills: ["C/C++", "Python", ".NET", "PHP", "JavaScript", "Teamwork"],
    isWorking: true,
  },
  {
    time: "Full-time | 2019 - 2022",
    company: "Thuan Hung High School",
    contentMarkdown:
      "- In high school, where I not only built a solid foundation of knowledge but also trained my thinking skills and proactive learning.\n\n- During my studies, I actively participated in extracurricular activities and competitions, which helped develop my communication and teamwork skills and better prepared me for my future studies.",
    skills: ["Pascal"],
  },
  {
    time: "Full-time | 2015 - 2019",
    company: "Thuan Hung Secondary School",
    contentMarkdown:
      "- In high school, I began expand my knowledge and sharpen my critical thinking skills. I challenged myself with advanced subjects and explored different fields of study, which helped me gain a deeper understanding of various concepts.\n\n- Beyond academics, I actively participated in group projects and extracurricular activities, taking on leadership roles whenever possible. These experiences improved my problem-solving abilities, teamwork, and communication skills, all of which prepared me for future academic and personal growth.",
    skills: ["Pascal"],
  },
];

export const ExperienceList = () => {
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
                <>
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
                </>
              );
            })}
          </div>

          <CodeTag
            tagName="Work"
            isCloseTag
            className="ml-2 text-cyan-500 dark:text-cyan-400"
          />
        </div>

        <>
          <div className="relative top-0 h-[1px] w-full bg-zinc-200 dark:bg-zinc-800"></div>
          <div className="flex h-8 w-full bg-[image:repeating-linear-gradient(315deg,_var(--pattern-foreground)_0,_var(--pattern-foreground)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] [--pattern-foreground:#e4e4e7] dark:[--pattern-foreground:#27272a]" />
          <div className="relative bottom-0 h-[1px] w-full bg-zinc-200 dark:bg-zinc-800"></div>
        </>

        <div className="p-2">
          <CodeTag
            tagName="Education"
            className="ml-2 text-cyan-500 dark:text-cyan-400"
          />

          <div className="text-balanc ml-2 border-l border-zinc-200 text-sm dark:border-zinc-800">
            {EXPERIENCE_EDUCATION.map((item, index) => {
              return (
                <>
                  <ExperienceItem
                    key={index}
                    time={item.time}
                    company={item.company}
                    companyIcon={<SchoolIcon size="1em" />}
                    jobTitle={item.jobTitle}
                    jobIcon={<GraduationCapIcon size="1em" />}
                    contentMarkdown={item.contentMarkdown}
                    content={item.content}
                    skills={item.skills}
                    isWorking={item.isWorking}
                  />
                </>
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
