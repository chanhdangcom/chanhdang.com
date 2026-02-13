"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export type MenuBarItemConfig = {
  key: string;
  label: string;
  icon: ReactNode;
  href?: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  trailing?: ReactNode;
};

type MenuBarItemProps = {
  item: MenuBarItemConfig;
  getItemClass: (active: boolean) => string;
};

export function MenuBarItem({ item, getItemClass }: MenuBarItemProps) {
  const row = (
    <div
      onClick={item.onClick}
      className={cn(
        getItemClass(Boolean(item.isActive)),
        "cursor-pointer",
        item.trailing && "justify-between",
        item.disabled && "pointer-events-none opacity-30"
      )}
    >
      <div className="flex items-center gap-2">
        {item.icon}
        <div className="font-medium font-apple">{item.label}</div>
      </div>
      {item.trailing}
    </div>
  );

  if (item.href && !item.disabled) {
    return <Link href={item.href}>{row}</Link>;
  }

  return row;
}
