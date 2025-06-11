import { CodeTag } from "@/components/code-tag";
import { cn } from "@/utils/cn";
import React from "react";

type IProps = {
  className?: string;
};

export const Hello = ({ className }: IProps) => {
  return (
    <div className={cn("space-y-2 text-center", className)}>
      <div className="select-none bg-gradient-to-t from-zinc-950 to-zinc-600 bg-clip-text pt-1 font-handwritten text-8xl text-transparent dark:from-zinc-500 dark:to-white">
        Hello
      </div>

      {/* <div className="select-none bg-gradient-to-t from-yellow-400 to-red-600 bg-clip-text p-4 font-handwritten text-7xl text-transparent dark:from-yellow-400 dark:to-red-600 md:text-8xl">
        Việt Nam
      </div> */}

      <div className="font-mono text-xl dark:text-white lg:text-2xl">
        <CodeTag tagName="p" className="text-pink-500 dark:text-pink-400" />
        I am a Developer
        <CodeTag
          tagName="p"
          isCloseTag
          className="text-pink-500 dark:text-pink-400"
        />
      </div>

      {/* <div className="font-mono text-xl dark:text-white lg:text-2xl">
        <CodeTag tagName="p" className="text-pink-500 dark:text-pink-400" />
        30 Tháng 4 Năm 1975
        <CodeTag
          tagName="p"
          isCloseTag
          className="text-pink-500 dark:text-pink-400"
        />
      </div> */}
    </div>
  );
};
