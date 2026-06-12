/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeaderMotion } from "@/app/[locale]/features/profile/components/header-motion";
import { ScrollHeaderPage } from "@/components/scroll-header-page";
import { Footer } from "@/app/[locale]/features/profile/footer";
import type { NewsArticle } from "../types";

type NewsArticleContentProps = {
  article: NewsArticle;
};

export function NewsArticleContent({ article }: NewsArticleContentProps) {
  const { theme } = useTheme();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const withLocale = (path: string) => `/${locale}${path}`;
  const paragraphs = article.content.split("\n\n").filter(Boolean);

  return (
    <div className="mt-4">
      <div>
        <>
          <div className="flex items-center justify-between px-2" role="banner">
            <Link href={withLocale("/")}>
              <ChanhdangLogotype />
            </Link>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <ThemeToggle />

                <Link
                  href="https://github.com/chanhdangcom"
                  target="_blank"
                  className="rounded-full border border-zinc-300 p-1 dark:border-zinc-900"
                >
                  <img
                    src={
                      theme === "dark"
                        ? "/img/tech-stack/github-mark-white.svg"
                        : "/img/tech-stack/github-mark.svg"
                    }
                    alt="icon"
                    className="size-6"
                  />
                </Link>
              </div>
            </div>
          </div>
        </>
      </div>

      <HeaderMotion />

      <div className="container mt-8">
        <div className="prose prose-lg prose-zinc mx-auto mb-8 max-w-3xl space-y-4 dark:prose-invert prose-headings:text-balance prose-img:rounded-lg">
          <div className="text-sm">
            {new Date(article.createdAt).toLocaleDateString("en-GB")}
          </div>

          <h1>{article.title}</h1>

          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      <ScrollHeaderPage />
      <Footer />
    </div>
  );
}
