import type { Metadata } from "next";
import Link from "next/link";
import { MUSICS } from "@/features/music/data/music-page";

export const metadata: Metadata = {
  title: "Search — Chánh Đang",
  description:
    "Search across portfolio pages, music playlists, and blog posts on chanhdang.com.",
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[]>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const queryValue = resolvedSearchParams.q;
  const query =
    typeof queryValue === "string"
      ? queryValue
      : Array.isArray(queryValue)
        ? (queryValue[0] ?? "")
        : "";
  const hasQuery = query.length > 0;
  const normalizedQuery = hasQuery ? normalize(query) : "";

  const musicResults = hasQuery
    ? MUSICS.filter((music) =>
        normalize(`${music.title} ${music.singer}`).includes(normalizedQuery)
      ).slice(0, 8)
    : [];

  const primaryDestinations = [
    { name: "Daifolio", description: "Overview of Chánh Đang", href: "/" },
    {
      name: "Musics",
      description: "Playlists & curated tracks",
      href: "/music",
    },
    {
      name: "Blogs",
      description: "Thoughts, tutorials & stories",
      href: "/blog",
    },
    {
      name: "Components",
      description: "UI components & code snippets",
      href: "/components",
    },
  ] as const;

  return (
    <main className="mx-auto max-w-4xl space-y-10 px-4 py-16">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
        <p className="text-muted-foreground max-w-2xl text-base">
          Tìm kiếm nội dung trên chanhdang.com — danh mục dự án, bài viết, âm
          nhạc và nhiều hơn nữa.
        </p>
        <form action="/search" method="get" className="flex gap-2">
          <label htmlFor="site-search" className="sr-only">
            Search
          </label>
          <input
            id="site-search"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Nhập từ khóa ví dụ: portfolio, music, blog..."
            className="w-full rounded-full border border-zinc-300 bg-white px-5 py-3 text-base shadow-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-white dark:focus:ring-white/30"
          />
          <button
            type="submit"
            className="rounded-full bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Search
          </button>
        </form>
      </header>

      <section className="grid gap-3 md:grid-cols-2">
        {primaryDestinations.map((item) => (
          <article
            key={item.href}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="text-lg font-semibold">
              <Link href={item.href} className="hover:underline">
                {item.name}
              </Link>
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {item.description}
            </p>
            <Link
              href={item.href}
              className="mt-3 inline-flex items-center text-sm font-medium text-zinc-900 hover:underline dark:text-white"
            >
              Visit {item.name}
            </Link>
          </article>
        ))}
      </section>

      {hasQuery ? (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">
              Music results for “{query}”
            </h2>
            <p className="text-muted-foreground text-sm">
              Showing top matches from playlists curated by Chánh Đang.
            </p>
          </div>

          {musicResults.length > 0 ? (
            <ul className="space-y-3">
              {musicResults.map((music) => (
                <li
                  key={music.id}
                  className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div>
                    <p className="text-base font-semibold">{music.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {music.singer}
                    </p>
                  </div>
                  <Link
                    href="/music"
                    className="text-sm font-medium text-zinc-900 hover:underline dark:text-white"
                  >
                    Listen
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground rounded-2xl border border-dashed border-zinc-300 p-6 text-sm dark:border-zinc-700">
              Không tìm thấy bài hát phù hợp. Thử với từ khóa khác hoặc khám phá
              danh mục Music.
            </p>
          )}
        </section>
      ) : (
        <section className="text-muted-foreground rounded-2xl border border-dashed border-zinc-300 p-6 text-sm dark:border-zinc-700">
          Nhập từ khóa để bắt đầu tìm kiếm. Bạn cũng có thể duyệt nhanh các mục
          chính ở trên.
        </section>
      )}
    </main>
  );
}
