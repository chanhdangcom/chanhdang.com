import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryNav } from "@/features/trangtin/components/category-nav";
import { NewsList } from "@/features/trangtin/components/news-list";
import {
  TrangTinContent,
  TrangTinPageHeading,
  TrangTinShell,
} from "@/features/trangtin/components/trangtin-shell";
import { getCategoryBySlug } from "@/features/trangtin/constants";
import { getArticles } from "@/features/trangtin/lib/db";
import { createTrangTinMetadata } from "@/features/trangtin/lib/seo";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Not found" };

  return createTrangTinMetadata({
    title: category.name,
    description: category.description,
    path: `/${locale}/trangtin/chu-de/${slug}`,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const articles = await getArticles({ categorySlug: slug });

  return (
    <TrangTinShell>
      <TrangTinPageHeading
        title={category.name}
        hint="font-mono text-sm text-zinc-500"
      />

      <TrangTinContent>
        <CategoryNav locale={locale} activeSlug={slug} />
        <NewsList articles={articles} />
      </TrangTinContent>
    </TrangTinShell>
  );
}
