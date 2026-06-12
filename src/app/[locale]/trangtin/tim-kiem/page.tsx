import type { Metadata } from "next";
import { NewsList } from "@/features/trangtin/components/news-list";
import {
  TrangTinContent,
  TrangTinPageHeading,
  TrangTinShell,
} from "@/features/trangtin/components/trangtin-shell";
import { getArticles } from "@/features/trangtin/lib/db";
import { createTrangTinMetadata } from "@/features/trangtin/lib/seo";
import { normalizeSearch } from "@/features/trangtin/utils";

export const revalidate = 60;

export const metadata: Metadata = createTrangTinMetadata({
  title: "Search articles",
  description: "Search articles by keyword on ChanhDang News.",
  path: "/trangtin/tim-kiem",
});

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { q = "" } = await searchParams;
  const query = q.trim();
  const hasQuery = query.length > 0;

  let articles = hasQuery
    ? await getArticles({ search: query, limit: 24 })
    : [];

  if (hasQuery && articles.length === 0) {
    const all = await getArticles({ limit: 50 });
    const normalized = normalizeSearch(query);
    articles = all.filter((article) =>
      normalizeSearch(
        `${article.title} ${article.description} ${article.content} ${article.categoryName}`
      ).includes(normalized)
    );
  }

  return (
    <TrangTinShell>
      <TrangTinPageHeading title="Search" hint="search input rounded-full" />

      <TrangTinContent>
        <form
          action={`/${locale}/trangtin/tim-kiem`}
          method="get"
          className="my-8 flex"
        >
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="e.g. Next.js, TypeScript, SEO..."
            className="w-full border-y border-dashed border-zinc-300 bg-white px-5 py-3 font-mono text-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/40 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-white dark:focus:ring-white/30"
          />
          <button
            type="submit"
            className="shrink-0 bg-zinc-900 px-5 py-3 font-mono text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Search
          </button>
        </form>

        {hasQuery ? (
          <>
            <p className="ml-4 font-mono text-xs text-zinc-500">
              {articles.length} results for &ldquo;{query}&rdquo;
            </p>
            <NewsList articles={articles} />
          </>
        ) : (
          <p className="border border-dashed border-zinc-300 p-8 text-center font-mono text-sm text-zinc-500 dark:border-zinc-800">
            Enter a keyword above to start searching.
          </p>
        )}
      </TrangTinContent>
    </TrangTinShell>
  );
}
