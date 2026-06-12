import type { Metadata } from "next";
import Script from "next/script";
import { TrangTinHomeBanner } from "@/features/trangtin/components/trangtin-home-banner";
import { NewsList } from "@/features/trangtin/components/news-list";
import { TrangTinContent, TrangTinShell } from "@/features/trangtin/components/trangtin-shell";
import { SITE_DESCRIPTION, SITE_NAME } from "@/features/trangtin/constants";
import { getArticles } from "@/features/trangtin/lib/db";
import { createTrangTinMetadata } from "@/features/trangtin/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = createTrangTinMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/trangtin",
});

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function TrangTinHomePage({ params }: PageProps) {
  await params;
  const articles = await getArticles({ limit: 24 });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: "https://chanhdang.com/trangtin",
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: "https://chanhdang.com/trangtin/tim-kiem?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <TrangTinShell>
      <Script
        id="trangtin-home-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <TrangTinHomeBanner />

      <TrangTinContent>
        <NewsList articles={articles} />
      </TrangTinContent>
    </TrangTinShell>
  );
}
