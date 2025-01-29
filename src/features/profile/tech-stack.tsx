import React from "react";
import { TechStackItem } from "./components/tech-stack-item";

type ITechStackItem = {
  iconUrl: string;
};

const TECHSTACK: ITechStackItem[] = [
  {
    iconUrl: "/img/tech-stack/typescript.svg",
  },
  {
    iconUrl: "/img/tech-stack/js.svg",
  },
  {
    iconUrl: "/img/tech-stack/php.svg",
  },
  {
    iconUrl: "/img/tech-stack/mysql.svg",
  },
  {
    iconUrl: "/img/tech-stack/nextjs2-dark.svg",
  },
  {
    iconUrl: "/img/tech-stack/react.svg",
  },
  {
    iconUrl: "/img/tech-stack/tailwindcss.svg",
  },
  {
    iconUrl: "/img/tech-stack/git.svg",
  },
  {
    iconUrl: "/img/tech-stack/docker.svg",
  },
];

export const TechStack = () => {
  return (
    <div className="flex justify-center">
      <div className="flex flex-wrap justify-center gap-4 rounded-2xl border border-zinc-100 bg-zinc-100 p-4 shadow-xl dark:border-zinc-900 dark:bg-zinc-900/50">
        {TECHSTACK.map((item, index) => {
          return <TechStackItem key={index} iconUrl={item.iconUrl} />;
        })}
      </div>
    </div>
  );
};
