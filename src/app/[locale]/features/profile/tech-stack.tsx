import React from "react";
import { FloatingDock } from "@/components/floating-dock";
import { FloatingDockItem } from "@/components/floating-dock-item";

// type ITechStackItem = {
//   iconUrl: string;
// };

// const TECHSTACK: ITechStackItem[] = [
//   {
//     iconUrl: "/img/tech-stack/typescript.svg",
//   },
//   {
//     iconUrl: "/img/tech-stack/js.svg",
//   },
//   {
//     iconUrl: "/img/tech-stack/php.svg",
//   },
//   {
//     iconUrl: "/img/tech-stack/mysql.svg",
//   },
//   {
//     iconUrl: "/img/tech-stack/nextjs2-dark.svg",
//   },
//   {
//     iconUrl: "/img/tech-stack/react.svg",
//   },
//   {
//     iconUrl: "/img/tech-stack/tailwindcss.svg",
//   },
//   {
//     iconUrl: "/img/tech-stack/git.svg",
//   },
//   {
//     iconUrl: "/img/tech-stack/docker.svg",
//   },
// ];

const ITechStackItem = [
  {
    title: "Type Script",
    icon: <FloatingDockItem iconUrl={"/img/tech-stack/typescript.svg"} />,
    href: "",
  },
  {
    title: "Java Script",
    icon: <FloatingDockItem iconUrl={"/img/tech-stack/js.svg"} />,
    href: "",
  },
  {
    title: "PHP",
    icon: <FloatingDockItem iconUrl={"/img/tech-stack/php.svg"} />,
    href: "",
  },
  {
    title: "My Sql",
    icon: <FloatingDockItem iconUrl={"/img/tech-stack/mysql.svg"} />,
    href: "",
  },
  {
    title: "Next Js",
    icon: <FloatingDockItem iconUrl={"/img/tech-stack/nextjs2-dark.svg"} />,
    href: "",
  },
  {
    title: "React",
    icon: <FloatingDockItem iconUrl={"/img/tech-stack/react.svg"} />,
    href: "",
  },
  {
    title: "Tailwind css",
    icon: <FloatingDockItem iconUrl={"/img/tech-stack/tailwindcss.svg"} />,
    href: "",
  },
  {
    title: "Git",
    icon: <FloatingDockItem iconUrl={"/img/tech-stack/git.svg"} />,
    href: "",
  },
  {
    title: "Docker",
    icon: <FloatingDockItem iconUrl={"/img/tech-stack/docker.svg"} />,
    href: "",
  },
];

export const TechStack = () => {
  return (
    <div className="flex justify-center p-4">
      <FloatingDock items={ITechStackItem} />
    </div>
  );
};
