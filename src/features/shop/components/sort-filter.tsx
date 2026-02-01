"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "newest", label: "Ngày mới - cũ" },
  { value: "oldest", label: "Ngày cũ - mới" },
  { value: "price-desc", label: "Giá cao - thấp" },
  { value: "price-asc", label: "Giá thấp - cao" },
];

export function SortFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "newest";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    const nextSearch = params.toString();
    router.push(nextSearch ? `${pathname}?${nextSearch}` : pathname);
  };

  return (
    <label className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
      <span className="hidden font-semibold sm:inline">Sắp xếp</span>
      <select
        value={currentSort}
        onChange={(event) => handleChange(event.target.value)}
        className="rounded-full border border-zinc-200/80 bg-white/80 px-4 py-2 text-sm text-zinc-700 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-zinc-200/70 dark:border-zinc-800/70 dark:bg-zinc-950/60 dark:text-zinc-200 dark:focus:ring-zinc-800/70"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
