import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Pacifico, Roboto_Condensed, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/utils/cn";

import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Providers } from "../Providers";
import { setRequestLocale, getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
// i18n provider is set in app/[locale]/layout.tsx

const fontBody = Roboto_Condensed({
  variable: "--font-body",
  subsets: ["vietnamese"],
  weight: ["400", "600", "700"],
});

const fontHandWritten = Pacifico({
  variable: "--font-handwritten",
  subsets: ["vietnamese"],
  weight: ["400"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["vietnamese"],
  weight: ["400", "700"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = "https://chanhdang.com";
  const localeUrl = `${baseUrl}/${locale}`;

  const isEnglish = locale === "en";
  const title = isEnglish
    ? "Chánh Đang - Developer & Designer"
    : "Chánh Đang - Developer & Designer";
  const description = isEnglish
    ? "Full-stack developer specialized in building modern websites and mobile applications with clean design, performance, and creativity."
    : "Full-stack developer chuyên xây dựng website và ứng dụng di động hiện đại với thiết kế sạch sẽ, hiệu suất cao và sáng tạo.";

  return {
    title,
    description,
    applicationName: "ChanhDang",
    keywords: [
      "Chanh Dang",
      "Developer",
      "Web Developer",
      "App Developer",
      "UI UX Designer",
      "Next.js",
      "React Native",
    ],
    authors: [{ name: "Chánh Đang", url: baseUrl }],
    creator: "Chánh Đang",
    publisher: "Chánh Đang",
    manifest: "/manifest.webmanifest",
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
    icons: {
      icon: "/img/Logomark.png",
      apple: "/img/Logomark.png",
      shortcut: "/img/Logomark.png",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "Chánh Đang",
    },
    openGraph: {
      title,
      description,
      url: localeUrl,
      siteName: "ChanhDang",
      images: [
        {
          url: "https://cdn.chanhdang.com/ncdang_cover_2.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: isEnglish ? "en_US" : "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@chanhdang",
      site: baseUrl,
      images: ["https://cdn.chanhdang.com/ncdang_cover_2.jpg"],
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: localeUrl,
      languages: {
        en: `${baseUrl}/en`,
        vi: `${baseUrl}/vi`,
      },
    },
    category: "technology",
    verification: {
      google: "36ju_9MyCskDFTLww39Evm-gx-AD_u0PEIlykT7Xbmo",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  console.log("Render RootLayout");

  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const baseUrl = "https://chanhdang.com";
  const localeUrl = `${baseUrl}/${locale}`;
  const isEnglish = locale === "en";

  const primaryNavigationLinks = [
    {
      name: isEnglish ? "Portfolio" : "Portfolio",
      url: localeUrl,
      description: isEnglish
        ? "Portfolio showcasing projects, work experience, and professional overview of Chánh Đang - Full-stack Developer & Designer"
        : "Portfolio giới thiệu các dự án, kinh nghiệm làm việc và tổng quan chuyên nghiệp của Chánh Đang - Full-stack Developer & Designer",
    },
    {
      name: isEnglish ? "Musics" : "Âm nhạc",
      url: `${baseUrl}/music`,
      description: isEnglish
        ? "Music platform featuring songs, playlists, and music library by ChanhDang Music"
        : "Nền tảng âm nhạc với các bài hát, playlist và thư viện nhạc của ChanhDang Music",
    },
    {
      name: isEnglish ? "Blogs" : "Blog",
      url: `${baseUrl}/blog`,
      description: isEnglish
        ? "Blog articles about web development, design, and technology insights"
        : "Bài viết blog về phát triển web, thiết kế và những hiểu biết về công nghệ",
    },
    {
      name: isEnglish ? "Components" : "Components",
      url: `${baseUrl}/components`,
      description: isEnglish
        ? "Reusable UI components and design system components for modern web applications"
        : "Các component UI có thể tái sử dụng và component hệ thống thiết kế cho ứng dụng web hiện đại",
    },
  ] as const;

  const structuredDataPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Chánh Đang",
    url: baseUrl,
    image: "https://cdn.chanhdang.com/ncdang_cover_2.jpg",
    sameAs: [
      "https://www.linkedin.com/in/chanhdang",
      "https://github.com/ncdang",
      "https://www.behance.net/chanhdang",
      "https://www.instagram.com/chanhdang",
    ],
    jobTitle: isEnglish
      ? "Full-stack Developer & Designer"
      : "Full-stack Developer & Designer",
    worksFor: {
      "@type": "Organization",
      name: "ChanhDang Studio",
    },
    description: isEnglish
      ? "Full-stack developer and designer building performant, user-centric digital products with Next.js, React, and React Native."
      : "Full-stack developer và designer xây dựng các sản phẩm kỹ thuật số hiệu suất cao, tập trung vào người dùng với Next.js, React và React Native.",
    knowsAbout: isEnglish
      ? [
          "Full-stack Development",
          "Next.js",
          "React Native",
          "UI/UX Design",
          "Web Performance",
        ]
      : [
          "Phát triển Full-stack",
          "Next.js",
          "React Native",
          "Thiết kế UI/UX",
          "Hiệu suất Web",
        ],
  } as const;

  const structuredDataWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ChanhDang",
    url: baseUrl,
    description: isEnglish
      ? "Portfolio, blog, and music platform by full-stack developer and designer Chánh Đang."
      : "Portfolio, blog và nền tảng âm nhạc của full-stack developer và designer Chánh Đang.",
    inLanguage: locale,
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${baseUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    ],
  } as const;

  const structuredDataSiteNavigation = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: isEnglish ? "Primary navigation" : "Điều hướng chính",
    hasPart: primaryNavigationLinks.map((link) => ({
      "@type": "WebPage",
      name: link.name,
      url: link.url,
      description: link.description,
    })),
  } as const;

  const structuredDataItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isEnglish
      ? "ChanhDang Website Sections"
      : "Các phần của website ChanhDang",
    description: isEnglish
      ? "Main sections of ChanhDang website including portfolio, music, blog, and components"
      : "Các phần chính của website ChanhDang bao gồm portfolio, âm nhạc, blog và components",
    itemListElement: primaryNavigationLinks.map((link, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "WebPage",
        "@id": link.url,
        name: link.name,
        url: link.url,
        description: link.description,
      },
    })),
  } as const;

  const structuredData = [
    structuredDataPerson,
    structuredDataWebsite,
    structuredDataSiteNavigation,
    structuredDataItemList,
  ] as const;

  return (
    <html
      lang={locale}
      className="light scroll-smooth"
      suppressHydrationWarning
    >
      <body
        className={cn(
          fontBody.variable,
          fontHandWritten.variable,
          fontMono.variable
        )}
      >
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
