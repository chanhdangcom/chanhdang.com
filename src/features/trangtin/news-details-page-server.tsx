import { notFound } from "next/navigation";
import Script from "next/script";
import { NewsArticleContent } from "@/features/trangtin/components/news-article-content";
import { getArticleBySlug } from "@/features/trangtin/lib/db";
import { createArticleJsonLd } from "@/features/trangtin/lib/seo";

type NewsDetailsPageServerProps = {
  slug: string;
};

export async function NewsDetailsPageServer({ slug }: NewsDetailsPageServerProps) {
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const jsonLd = createArticleJsonLd(article);

  return (
    <>
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4">
        <NewsArticleContent article={article} />
      </div>
    </>
  );
}
