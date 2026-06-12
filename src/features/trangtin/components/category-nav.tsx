import Link from "next/link";

import { CategoryDropdown } from "./category-dropdown";

type CategoryNavProps = {
  locale: string;
  activeSlug?: string;
};

export function CategoryNav({ locale, activeSlug }: CategoryNavProps) {
  const base = `/${locale}/trangtin`;

  return (
    <div className="ml-4 mt-4 flex items-center gap-6 font-mono text-sm">
      <Link
        href={base}
        className={
          !activeSlug
            ? "font-semibold underline"
            : "text-zinc-500 hover:underline"
        }
      >
        All
      </Link>
      <CategoryDropdown locale={locale} activeSlug={activeSlug} />
    </div>
  );
}
