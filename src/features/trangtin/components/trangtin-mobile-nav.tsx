"use client";

import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "../constants";
import { TRANGTIN_NAV_ITEMS } from "../nav-config";

type TrangTinMobileNavProps = {
  locale: string;
  pathname: string;
  activeCategorySlug?: string;
};

export function TrangTinMobileNav({
  locale,
  pathname,
  activeCategorySlug,
}: TrangTinMobileNavProps) {
  const [open, setOpen] = useState(false);
  const base = `/${locale}/trangtin`;

  const isActive = (href: string) =>
    href === base ? pathname === base : pathname.startsWith(href);

  const close = () => setOpen(false);

  const linkClass = (active: boolean) =>
    cn(
      "block rounded-md px-3 py-2.5 font-mono text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900",
      active && "font-semibold underline"
    );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        className="rounded-md p-1.5 xl:hidden"
        aria-label="Open menu"
      >
        <MenuIcon className="size-5" />
      </DrawerTrigger>

      <DrawerContent className="border bg-zinc-50 font-mono dark:border-zinc-800 dark:bg-zinc-950">
        <DrawerHeader className="border-b dark:border-zinc-900">
          <DrawerTitle className="font-mono text-base">Menu</DrawerTitle>
        </DrawerHeader>

        <nav
          aria-label="News mobile"
          className="max-h-[70vh] overflow-y-auto px-4 pb-8 pt-2"
        >
          <ul className="space-y-1">
            {TRANGTIN_NAV_ITEMS.map((item) => {
              const href = item.href(locale);
              return (
                <li key={item.label}>
                  <Link
                    href={href}
                    onClick={close}
                    className={linkClass(isActive(href))}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="my-3 border-t border-dashed border-zinc-200 dark:border-zinc-800" />

          <p className="px-3 py-1 text-xs text-zinc-500">Topics</p>
          <ul className="space-y-1">
            <li>
              <Link
                href={base}
                onClick={close}
                className={linkClass(!activeCategorySlug)}
              >
                All
              </Link>
            </li>
            {CATEGORIES.map((category) => {
              const href = `${base}/chu-de/${category.slug}`;
              return (
                <li key={category.slug}>
                  <Link
                    href={href}
                    onClick={close}
                    className={linkClass(activeCategorySlug === category.slug)}
                  >
                    {category.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="my-3 border-t border-dashed border-zinc-200 dark:border-zinc-800" />

          <Link
            href={`/${locale}/blog`}
            onClick={close}
            className={linkClass(pathname.startsWith(`/${locale}/blog`))}
          >
            Blogs
          </Link>
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
