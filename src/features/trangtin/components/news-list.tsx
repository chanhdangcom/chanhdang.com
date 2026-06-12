import type { NewsArticle } from "../types";
import { NewsListItem } from "./news-list-item";

export function NewsList({ articles }: { articles: NewsArticle[] }) {
  if (articles.length === 0) {
    return (
      <p className="border border-dashed border-zinc-300 p-8 text-center font-mono text-sm text-zinc-500 dark:border-zinc-800">
        No articles yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4">
      {articles.map((article) => (
        <div key={article.id} className="min-h-0">
          <NewsListItem article={article} />
        </div>
      ))}
    </div>
  );
}
