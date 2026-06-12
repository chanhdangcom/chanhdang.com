"use client";

import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CATEGORIES, getCategoryBySlug } from "../constants";

type CategoryDropdownProps = {
  locale: string;
  activeSlug?: string;
  className?: string;
};

export function CategoryDropdown({
  locale,
  activeSlug,
  className,
}: CategoryDropdownProps) {
  const base = `/${locale}/trangtin`;
  const activeCategory = activeSlug ? getCategoryBySlug(activeSlug) : undefined;
  const label = activeCategory?.name ?? "Topics";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-1 outline-none hover:underline",
          activeCategory && "font-semibold underline",
          className
        )}
      >
        {label}
        <ChevronDownIcon className="size-3.5 opacity-60" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="min-w-40 bg-zinc-100 font-mono dark:bg-zinc-900"
      >
        <DropdownMenuItem asChild>
          <Link href={base} className={cn(!activeSlug && "font-semibold")}>
            All
          </Link>
        </DropdownMenuItem>

        {CATEGORIES.map((category) => (
          <DropdownMenuItem key={category.slug} asChild>
            <Link
              href={`${base}/chu-de/${category.slug}`}
              className={cn(activeSlug === category.slug && "font-semibold")}
            >
              {category.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
