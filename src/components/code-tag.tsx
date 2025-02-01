import { cn } from "@/utils/cn";
import React from "react";

type IProps = {
  tagName: string;
  isCloseTag?: boolean;
  className?: string;
};

export const CodeTag = ({ tagName, isCloseTag = false, className }: IProps) => {
  return (
    <span className={cn("inline-flex font-mono text-cyan-400", className)}>
      <span className="dark:text-zinc-50">{isCloseTag ? "</" : "<"}</span>
      <span>{tagName}</span>
      <span className="dark:text-zinc-50">{">"}</span>
    </span>
  );
};
