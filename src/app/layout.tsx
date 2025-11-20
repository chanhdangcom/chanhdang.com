import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Pacifico, Roboto_Condensed, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/utils/cn";
import { Providers } from "./Providers";
import { NextIntlClientProvider } from "next-intl";
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

export const metadata: Metadata = {
  title: "Chánh Đang — Developer & Designer",
  description:
    "Full-stack developer specialized in building modern websites and mobile applications with clean design, performance, and creativity.",
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
  authors: [{ name: "Chánh Đang", url: "https://chanhdang.com" }],
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
    title: "Chánh Đang - Developer & Designer",
    description:
      "Building modern web and mobile experiences with clean code and creative design.",
    url: "https://chanhdang.com",
    siteName: "ChanhDang",
    images: [
      {
        url: "https://cdn.chanhdang.com/ncdang_cover_2.jpg",
        width: 1200,
        height: 630,
        alt: "Chanh Dang - Developer & Designer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chánh Đang - Developer & Designer",
    description:
      "Full-stack developer creating high-quality web and mobile experiences with a passion for design and performance.",
    creator: "@chanhdang",
    site: "https://chanhdang.com",
    images: ["https://cdn.chanhdang.com/ncdang_cover_2.jpg"],
  },

  metadataBase: new URL("https://chanhdang.com"),
  alternates: {
    canonical: "https://chanhdang.com",
    languages: {
      en: "https://chanhdang.com/en",
      vi: "https://chanhdang.com/vi",
    },
  },
  category: "technology",
  verification: {
    google: "36ju_9MyCskDFTLww39Evm-gx-AD_u0PEIlykT7Xbmo",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("Render RootLayout");

  const primaryNavigationLinks = [
    { name: "Daifolio", url: "https://chanhdang.com/" },
    { name: "Musics", url: "https://chanhdang.com/music" },
    { name: "Blogs", url: "https://chanhdang.com/blog" },
    { name: "Components", url: "https://chanhdang.com/components" },
  ] as const;

  const structuredDataPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Chánh Đang",
    url: "https://chanhdang.com",
    image: "https://cdn.chanhdang.com/ncdang_cover_2.jpg",
    sameAs: [
      "https://www.linkedin.com/in/chanhdang",
      "https://github.com/ncdang",
      "https://www.behance.net/chanhdang",
      "https://www.instagram.com/chanhdang",
    ],
    jobTitle: "Full-stack Developer & Designer",
    worksFor: {
      "@type": "Organization",
      name: "ChanhDang Studio",
    },
    description:
      "Full-stack developer and designer building performant, user-centric digital products with Next.js, React, and React Native.",
    knowsAbout: [
      "Full-stack Development",
      "Next.js",
      "React Native",
      "UI/UX Design",
      "Web Performance",
    ],
  } as const;

  const structuredDataWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ChanhDang",
    url: "https://chanhdang.com",
    description:
      "Portfolio, blog, and music platform by full-stack developer and designer Chánh Đang.",
    inLanguage: "vi",
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://chanhdang.com/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    ],
  } as const;

  const structuredDataSiteNavigation = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: "Primary navigation",
    hasPart: primaryNavigationLinks.map((link) => ({
      "@type": "WebPage",
      name: link.name,
      url: link.url,
    })),
  } as const;

  const structuredData = [
    structuredDataPerson,
    structuredDataWebsite,
    structuredDataSiteNavigation,
  ] as const;

  return (
    <html lang="en" className="light scroll-smooth" suppressHydrationWarning>
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
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
