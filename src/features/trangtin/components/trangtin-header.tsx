/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { useParams, usePathname } from "next/navigation";
import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { ThemeToggle } from "@/components/theme-toggle";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "../constants";

const NAV_ITEMS = [
  { label: "Home", href: (locale: string) => `/${locale}/trangtin` },
  {
    label: "Search",
    href: (locale: string) => `/${locale}/trangtin/tim-kiem`,
  },
  { label: "Contact", href: (locale: string) => `/${locale}/trangtin/lien-he` },
  { label: "Admin", href: (locale: string) => `/${locale}/trangtin/admin` },
] as const;

export function TrangTinHeader() {
  const { locale } = useParams();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const localeStr = (locale as string) || "en";
  const base = `/${localeStr}/trangtin`;

  const isActive = (href: string) =>
    href === base ? pathname === base : pathname.startsWith(href);

  if (!mounted) {
    return (
      <img
        src="/img/tech-stack/github-mark.svg"
        alt="icon"
        className="size-6"
      />
    );
  }

  return (
    <>
      <div className="absolute">
        <Progress className="w-[60%]" value={33} />
      </div>

      <div className="flex items-center justify-between px-2" role="banner">
        <Link href={`/${localeStr}/trangtin`} className="flex items-end gap-1">
          <ChanhdangLogotype />
          <div className="font-mono text-xs font-medium">News</div>
        </Link>

        <div className="flex items-center gap-8">
          <nav aria-label="News" className="hidden xl:block">
            <ul className="flex items-center gap-6 font-mono text-sm">
              {NAV_ITEMS.map((item) => {
                const href = item.href(localeStr);
                return (
                  <motion.li
                    key={item.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={href}
                      className={cn(
                        "hover:underline",
                        isActive(href) && "font-semibold underline"
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                );
              })}

              {CATEGORIES.map((category) => {
                const href = `${base}/chu-de/${category.slug}`;
                return (
                  <motion.li
                    key={category.slug}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={href}
                      className={cn(
                        "hover:underline",
                        isActive(href) && "font-semibold underline"
                      )}
                    >
                      {category.name}
                    </Link>
                  </motion.li>
                );
              })}

              <motion.li
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={`/${localeStr}/blog`} className="hover:underline">
                  Blogs
                </Link>
              </motion.li>
            </ul>
          </nav>

          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
