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
      <div className="font-mono text-2xl dark:text-white">
        <span className="font-bold text-sky-400">{"<p>"}</span>I am a Developer.
        <span className="font-bold text-sky-400">{"</p>"}</span>
      </div>
    </div>
  );
};
