"use client";

import { Button } from "@/components/button";
import { Hello } from "./components/hello";
import { TechStack } from "./tech-stack";

export const AboutMe = () => {
  const handleClick = () => {
    window.location.href = "/#work";
  };

  return (
    <div className="space-y-8 dark:text-slate-50">
      <Hello className="hidden md:block" />

      <div className="space-x-4 text-center">
        <Button type="primary" onClick={handleClick}>
          Work
        </Button>
        <Button type="secondary">Project</Button>
      </div>

      <div className="text-balance text-center text-lg">
        I am passionate about creating and developing web applications and
        software, always looking for the most optimal and efficient solutions.
        With experience in using modern technologies such as JavaScript, React
        and Tailwind CSS. I love learning and applying new technologies.
      </div>

      <TechStack />
    </div>
  );
};
