import Link from "next/link";
import { CATEGORIES } from "../constants";

type CategoryNavProps = {
  locale: string;
  activeSlug?: string;
};

export function CategoryNav({ locale, activeSlug }: CategoryNavProps) {
  const base = `/${locale}/trangtin`;

  return (
    <div className="ml-4 mt-4 flex gap-8 font-mono text-sm">
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
      {CATEGORIES.map((category) => (
        <Link
          key={category.slug}
          href={`${base}/chu-de/${category.slug}`}
          className={
            activeSlug === category.slug
              ? "font-semibold underline"
              : "text-zinc-500 hover:underline"
          }
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
