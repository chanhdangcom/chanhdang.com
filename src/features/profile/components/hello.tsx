import { cn } from "@/utils/cn";
import React from "react";

type IProps = {
  className?: string;
};

export const Hello = ({ className }: IProps) => {
  return (
    <div className={cn("space-y-2 text-center", className)}>
      <div className="font-handwritten select-none bg-gradient-to-t from-zinc-950 to-zinc-600 bg-clip-text pt-1 text-8xl text-transparent dark:from-zinc-500 dark:to-white">
        Hello
      </div>
      <div className="text-2xl dark:text-white">I am a Developer.</div>
    </div>
  );
};
