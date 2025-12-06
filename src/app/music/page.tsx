import { MusicPage } from "@/features/music/page";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "ChanhDang Music",
  description:
    "Explore music collection, playlists, and songs on ChanhDang Music platform. Discover new music and enjoy your favorite tracks.",
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
    type: "website",
  },
  alternates: {
    canonical: "https://chanhdang.com/music",
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
