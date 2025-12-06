import { ComponentList } from "../[locale]/features/profile/component-list";
import { Footer } from "../[locale]/features/profile/footer";
import { Header } from "../[locale]/features/profile/header";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Components - ChanhDang UI Component Library",
  description:
    "Browse reusable UI components and design system components for modern web applications. Open-source React components with clean design.",
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
    title: "Components - ChanhDang UI Component Library",
    description:
      "Browse reusable UI components and design system components for modern web applications.",
    url: "https://chanhdang.com/components",
    siteName: "ChanhDang",
    images: [
      {
        url: "https://cdn.chanhdang.com/ncdang_cover_2.jpg",
        width: 1200,
        height: 630,
        alt: "Components - ChanhDang UI Component Library",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Components - ChanhDang UI Component Library",
    description:
      "Browse reusable UI components and design system components for modern web applications.",
    creator: "@chanhdang",
    site: "https://chanhdang.com",
    images: ["https://cdn.chanhdang.com/ncdang_cover_2.jpg"],
  },
  metadataBase: new URL("https://chanhdang.com"),
  alternates: {
    canonical: "https://chanhdang.com/components",
    languages: {
      en: "https://chanhdang.com/en",
      vi: "https://chanhdang.com/vi",
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Components - ChanhDang UI Component Library",
  url: "https://chanhdang.com/components",
  description:
    "Browse reusable UI components and design system components for modern web applications.",
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
        name: "Components",
        item: "https://chanhdang.com/components",
      },
    ],
  },
};

export default function Page() {
  return (
    <>
      <Script
        id="components-structured-data"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div>
        <div className="fixed left-0 h-screen w-px bg-zinc-200 dark:bg-zinc-900 md:left-48" />
        <div className="fixed right-0 h-screen w-px bg-zinc-200 dark:bg-zinc-900 md:right-48" />

        <div className="mx-0 border border-zinc-300 p-2 dark:border-zinc-900 md:mx-48">
          <Header />
        </div>

        <div className="mt-6">
          <ComponentList />
        </div>

        <Footer />
      </div>
    </>
  );
}
