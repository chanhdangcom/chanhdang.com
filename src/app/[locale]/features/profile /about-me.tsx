"use client";

import { useTranslations } from "next-intl";
import { Hello } from "./components/hello";
import { TechStack } from "./tech-stack";
import { CodeTag } from "@/components/code-tag";

export const AboutMe = () => {
  const t = useTranslations("about");

  return (
    <div className="space-y-4 dark:text-slate-50">
      <div className="m-2 border-zinc-300 bg-zinc-50 bg-[radial-gradient(circle,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:12px_12px] py-4 dark:border-zinc-800 dark:bg-[#030610] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)]">
        <Hello className="hidden text-8xl md:block" />
      </div>

      <div className="m-2 text-balance border-zinc-300 bg-zinc-50 bg-[radial-gradient(circle,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:12px_12px] py-6 text-center font-mono text-sm dark:border-zinc-800 dark:bg-[#030610] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)]">
        <CodeTag tagName="About" className="text-cyan-500 dark:text-cyan-400" />
        {t("Content")}

        <CodeTag
          tagName="About"
          className="text-cyan-500 dark:text-cyan-400"
          isCloseTag
        />
      </div>

      <div className="m-2 rounded-bl-3xl rounded-br-3xl border-zinc-300 bg-zinc-50 bg-[radial-gradient(circle,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:12px_12px] py-2 dark:border-zinc-800 dark:bg-[#030610] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)]">
        <TechStack />
      </div>
    </div>
  );
};
