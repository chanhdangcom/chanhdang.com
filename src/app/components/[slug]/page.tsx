import { ComponentPage } from "@/app/[locale]/features/component-page/component-page";
import { readFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  try {
    const filePath = join(process.cwd(), "docs", `${slug}`);
    const fileContent = readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);

    const title = data.title
      ? `${data.title} - ChanhDang UI Component Library`
      : "Component - ChanhDang UI Component Library";
    const description =
      data.description ||
      "Browse reusable UI components and design system components for modern web applications.";

    return {
      title,
      description,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },
      openGraph: {
        title,
        description,
        url: `https://chanhdang.com/components/${slug}`,
        type: "article",
      },
      alternates: {
        canonical: `https://chanhdang.com/components/${slug}`,
      },
    };
  } catch (error) {
    return {
      title: "Component - ChanhDang UI Component Library",
      description:
        "Browse reusable UI components and design system components for modern web applications.",
      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

export default async function ComponentSlugPage({ params }: Props) {
  const resolvedParams = await params;
  return <ComponentPage slug={resolvedParams.slug} />;
}
