import { BlogListPage } from "../features/profile/blog-list-page";
import { Footer } from "../features/profile/footer";
import { Header } from "../features/profile/header";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Blogs - ChanhDang Developer Blog",
  description:
    "Read articles about web development, design, technology insights, and programming tips from Chánh Đang - Full-stack Developer & Designer.",
  applicationName: "ChanhDang",
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
    title: "Blogs - ChanhDang Developer Blog",
    description:
      "Read articles about web development, design, and technology insights.",
    url: "https://chanhdang.com/blog",
    siteName: "ChanhDang",
    images: [
      {
        url: "https://cdn.chanhdang.com/ncdang_cover_2.jpg",
        width: 1200,
        height: 630,
        alt: "Blogs - ChanhDang Developer Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogs - ChanhDang Developer Blog",
    description:
      "Read articles about web development, design, and technology insights.",
    creator: "@chanhdang",
    site: "https://chanhdang.com",
    images: ["https://cdn.chanhdang.com/ncdang_cover_2.jpg"],
  },
  metadataBase: new URL("https://chanhdang.com"),
  alternates: {
    canonical: "https://chanhdang.com/blog",
    languages: {
      en: "https://chanhdang.com/en",
      vi: "https://chanhdang.com/vi",
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Blogs - ChanhDang Developer Blog",
  url: "https://chanhdang.com/blog",
  description:
    "Read articles about web development, design, and technology insights.",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://chanhdang.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blogs",
        item: "https://chanhdang.com/blog",
      },
    ],
  },
};

export default function Page() {
  return (
    <>
      <Script
        id="blog-structured-data"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div>
        <div className="fixed left-0 h-screen w-px bg-zinc-200 dark:bg-zinc-900 md:left-[15vw]" />
        <div className="fixed right-0 h-screen w-px bg-zinc-200 dark:bg-zinc-900 md:right-[15vw]" />
        <div className="mx-0 border border-zinc-300 p-2 dark:border-zinc-900 md:mx-[15vw]">
          <Header />
        </div>

        <div className="mt-6">
          <div className="top-0 mx-4 font-mono text-xs text-zinc-500 md:mx-[15vw]">
            text-4xl pb-8 pt-12
          </div>

          <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-900" />

          <div className="mx-4 text-balance font-mono text-4xl font-semibold leading-tight tracking-tight md:mx-[15vw]">
            <div>Blogs</div>
          </div>

          <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-900" />
        </div>

        <div className="mt-8">
          <div className="top-0 h-px w-full bg-zinc-200 dark:bg-zinc-900" />

          <div className="md:mx-[15vw]">
            <BlogListPage />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
