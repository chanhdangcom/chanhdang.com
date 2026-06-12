import type { Metadata } from "next";
import { NewsDetailsPageServer } from "@/features/trangtin/news-details-page-server";
import { getArticleBySlug, getArticles } from "@/features/trangtin/lib/db";
import { createTrangTinMetadata } from "@/features/trangtin/lib/seo";

export const revalidate = 300;
export const dynamicParams = true;

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  try {
    const articles = await getArticles({ limit: 20 });
    return articles.map((article) => ({ slug: article.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article - ChanhDang News",
      description: "Read articles about technology, programming and design.",
      robots: { index: true, follow: true },
    };
  }

  const title = `${article.title} - ChanhDang News`;

  return {
    ...createTrangTinMetadata({
      title: article.title,
      description: article.description,
      path: `/${locale}/trangtin/bai-viet/${slug}`,
      type: "article",
      image: article.coverImage,
      publishedTime: article.createdAt,
    }),
    title,
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return <NewsDetailsPageServer slug={slug} />;
}
