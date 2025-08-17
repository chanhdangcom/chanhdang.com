"use client";

import { useTranslations } from "next-intl";
import { Hello } from "./components/hello";
import { TechStack } from "./tech-stack";
import { CodeTag } from "@/components/code-tag";

export const AboutMe = () => {
  const t = useTranslations("about");

  return (
    <div className="space-y-8 dark:text-slate-50">
      <div className="">
        <Hello className="hidden text-8xl md:block" />
      </div>

      <div className="text-balance text-center font-mono text-sm">
        <CodeTag tagName="About" className="text-cyan-500 dark:text-cyan-400" />
        {t("Content")}

        <CodeTag
          tagName="About"
          className="text-cyan-500 dark:text-cyan-400"
          isCloseTag
        />
      </div>

      <TechStack />
    </div>
  );
};
