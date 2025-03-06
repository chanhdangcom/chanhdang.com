"use client";

import { Hello } from "./components/hello";
import { TechStack } from "./tech-stack";
import { CodeTag } from "@/components/code-tag";

export const AboutMe = () => {
  // const handleClick = () => {
  //   window.location.href = "/#work";
  // };

  return (
    <div className="space-y-8 dark:text-slate-50">
      <Hello className="hidden md:block" />
      {/* <div className="space-x-4 text-center">
        <Button type="primary" onClick={handleClick}>
          Work
        </Button>
        <Button type="secondary">Project</Button>
      </div> */}
      <div className="text-balance text-center font-mono text-sm">
        <CodeTag tagName="About" className="text-cyan-500 dark:text-cyan-400" />
        I am passionate about creating and developing web applications and
        software, always looking for the most optimal and efficient solutions.
        With experience in using modern technologies such as TypeScript, React
        and Tailwind CSS. I love learning and applying new technologies.
        <CodeTag
          tagName="About"
          className="text-cyan-500 dark:text-cyan-400"
          isCloseTag
        />
      </div>
      <TechStack />

      {/* <div className="mb-10 flex w-full flex-row items-center justify-center">
        <AnimatedTooltip items={TECHSTACK} />
      </div> */}
    </div>
  );
};
