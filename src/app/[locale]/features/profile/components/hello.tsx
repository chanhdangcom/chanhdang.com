import { CodeTag } from "@/components/code-tag";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";

import React from "react";

type IProps = {
  className?: string;
};

export const Hello = ({ className }: IProps) => {
  const t = useTranslations("hello");

  return (
    <div className={cn("space-y-2 text-center", className)}>
      <div className="select-none bg-gradient-to-t from-zinc-950 to-zinc-600 bg-clip-text pt-1 font-handwritten text-8xl text-transparent dark:from-zinc-500 dark:to-white">
        {t("Hello")}
      </div>

      <div className="font-mono text-xl dark:text-white lg:text-2xl">
        <CodeTag tagName="p" className="text-pink-500 dark:text-pink-400" />
        {t("Description")}
        <CodeTag
          tagName="p"
          isCloseTag
          className="text-pink-500 dark:text-pink-400"
        />
      </div>
    </div>
  );
};
