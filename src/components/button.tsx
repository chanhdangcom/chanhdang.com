import { cn } from "@/utils/cn";
import React from "react";

type IProps = {
  type: "primary" | "secondary";
  className?: string;
  onClick?: () => void;

  children: React.ReactNode;
};

export const Button = ({ type, className, onClick, children }: IProps) => {
  return (
    <button
      className={cn(
        "rounded-md px-4 py-2 font-semibold",
        {
          "bg-blue-600 text-white hover:bg-blue-700": type === "primary",
          "bg-zinc-100 text-black hover:bg-zinc-200 dark:bg-white dark:hover:bg-zinc-200":
            type === "secondary",
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
