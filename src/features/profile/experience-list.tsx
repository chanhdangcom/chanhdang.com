import React from "react";
import { ExperienceItem } from "./components/experience-item";
import { GraduationCapIcon, SchoolIcon } from "lucide-react";

type IExperienceItem = {
  time: string;
  company: string;
  jobTitle: string;
  content: string;
};

const EXPERIENCE_WORK: IExperienceItem[] = [
  {
    time: "2023 - Present",
    company: "Quaric",
    jobTitle: "Intern Full-stack Developer",
    content:
      "I had the opportunity to intern at a technology company where I got to work on real-world software development projects. During my internship, I learned how to work in a team, manage my time, and apply my knowledge to solving real-world problems. This was an important stepping stone to help me better understand the professional working environment and strengthen my skills.",
  },
];

const EXPERIENCE_EDUCATION: IExperienceItem[] = [
  {
    time: "2022 - Present",
    company: "An Giang University",
    jobTitle: "Software Engineer",
    content:
      "As a student of Information Technology, where I studied programming, web development, artificial intelligence and databases. During my studies, I participated in many real-life projects and programming competitions, which helped me develop logical thinking, problem-solving skills and apply knowledge in practice.",
  },
  {
    time: "2019 - 2022",
    company: "Thuan Hung High School",
    jobTitle: "Graduated",
    content:
      "In high school, where I not only built a solid foundation of knowledge but also trained my thinking skills and proactive learning. During my studies, I actively participated in extracurricular activities and competitions, which helped develop my communication and teamwork skills and better prepared me for my future studies.",
  },
  {
    time: "2015 - 2029",
    company: "Thuan Hung Secondary School",
    jobTitle: "Graduated",
    content:
      "In middle school, I began to develop logical thinking and discover my passion for learning. This was an important stage that helped me build a foundation of basic knowledge, develop self-learning skills and practice discipline through studying and participating in extracurricular activities.",
  },
];

export const ExperienceList = () => {
  return (
    <div className="scroll-mt-8 space-y-8" id="work">
      <div className="space-y-4">
        <div className="text-4xl font-bold dark:text-neutral-50">Work</div>

        {EXPERIENCE_WORK.map((item, index) => {
          return (
            <ExperienceItem
              key={index}
              time={item.time}
              jobTitle={item.jobTitle}
              company={item.company}
              content={item.content}
            />
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="text-4xl font-bold dark:text-neutral-50">Education</div>

        {EXPERIENCE_EDUCATION.map((item, index) => {
          return (
            <ExperienceItem
              key={index}
              time={item.time}
              company={item.company}
              companyIcon={<SchoolIcon size="1em" />}
              jobTitle={item.jobTitle}
              jobIcon={<GraduationCapIcon size="1em" />}
              content={item.content}
            />
          );
        })}
      </div>
    </div>
  );
};
