import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "../constants";

const BASE_URL = "https://chanhdang.com";

export function createTrangTinMetadata(options: {
  title: string;
  description?: string;
  path: string;
  type?: "website" | "article";
  image?: string;
  publishedTime?: string;
}): Metadata {
  const title = `${options.title} | ${SITE_NAME}`;
  const description = options.description || SITE_DESCRIPTION;
  const url = `${BASE_URL}${options.path}`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: options.type || "website",
      publishedTime: options.publishedTime,
      images: options.image
        ? [{ url: options.image, width: 1200, height: 630, alt: options.title }]
        : [{ url: "https://cdn.chanhdang.com/ncdang_cover_2.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: options.image
        ? [options.image]
        : ["https://cdn.chanhdang.com/ncdang_cover_2.jpg"],
    },
    alternates: { canonical: url },
  };
}

export function createArticleJsonLd(article: {
  title: string;
  description: string;
  slug: string;
  coverImage: string;
  author: string;
  createdAt: string;
  categoryName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    image: [article.coverImage],
    datePublished: article.createdAt,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: "https://cdn.chanhdang.com/ncdang_cover_2.jpg",
      },
    },
    articleSection: article.categoryName,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://chanhdang.com/trangtin/bai-viet/${article.slug}`,
    },
  };
}
