"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export type MenuBarMobileItemConfig = {
  key: string;
  label: string;
  href: string;
  icon: ReactNode;
  disabled?: boolean;
  isActive?: boolean;
};

type MenuBarMobileItemProps = {
  item: MenuBarMobileItemConfig;
};

export function MenuBarMobileItem({ item }: MenuBarMobileItemProps) {
  const content = (
    <div
      className={cn(
        "relative z-10 flex w-full flex-col items-center rounded-full px-[21px] py-1 transition-all duration-300 ease-out",
        item.isActive
          ? "bg-white/30 text-rose-600 dark:bg-white/20"
          : "bg-transparent text-zinc-700 dark:text-zinc-200",
        item.disabled && "pointer-events-none opacity-25"
      )}
    >
      {item.icon}

      <div className="text-center font-apple text-[10px] font-medium leading-none">
        {item.label}
      </div>
    </div>
  );

  if (item.disabled) {
    return content;
  }

  return <Link href={item.href}>{content}</Link>;
}
