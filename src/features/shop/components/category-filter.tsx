import Link from "next/link";
import type { Category } from "../types";

type CategoryFilterProps = {
  categories: Category[];
  active?: string | null;
  locale: string;
};

export function CategoryFilter({ categories, active, locale }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/${locale}/CuaHangPhuKien`}
        className={`rounded-full border px-4 py-2 text-sm transition ${
          !active
            ? "border-zinc-900 bg-zinc-900 text-white"
            : "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700"
        }`}
      >
        Tất cả
      </Link>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/${locale}/CuaHangPhuKien?category=${category.slug}`}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            active === category.slug
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
