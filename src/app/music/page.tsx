import { MusicPage } from "@/features/music/page";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "ChanhDang Music",
  description:
    "Explore music collection, playlists, and songs on ChanhDang Music platform. Discover new music and enjoy your favorite tracks.",
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
    title: "ChanhDang Music",
    description:
      "Explore music collection, playlists, and songs on ChanhDang Music platform.",
    url: "https://chanhdang.com/music",
    siteName: "ChanhDang",
    images: [
      {
        url: "https://cdn.chanhdang.com/ncdang_cover_2.jpg",
        width: 1200,
        height: 630,
        alt: "ChanhDang Music",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChanhDang Music",
    description:
      "Explore music collection, playlists, and songs on ChanhDang Music platform.",
    creator: "@chanhdang",
    site: "https://chanhdang.com",
    images: ["https://cdn.chanhdang.com/ncdang_cover_2.jpg"],
  },
  metadataBase: new URL("https://chanhdang.com"),
  alternates: {
    canonical: "https://chanhdang.com/music",
    languages: {
      en: "https://chanhdang.com/en",
      vi: "https://chanhdang.com/vi",
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "ChanhDang Music",
  url: "https://chanhdang.com/music",
  description:
    "Explore music collection, playlists, and songs on ChanhDang Music platform.",
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
        name: "Musics",
        item: "https://chanhdang.com/music",
      },
    ],
  },
};

export default function Page() {
  return (
    <>
      <Script
        id="music-structured-data"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <MusicPage />
    </>
  );
}
