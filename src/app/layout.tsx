import type { Metadata } from "next";
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

// export const metadata: Metadata = {
//   title: "Chánh Đang - I am a Developer",
//   description:
//     "I specialize in building modern websites and mobile applications with a focus on performance, usability, and clean design. Passionate about creating seamless digital experiences that blend functionality and aesthetics.",
//   manifest: "/manifest.webmanifest",
//   themeColor: "#000000",
//   icons: {
//     icon: "/img/Logomark.png",
//     apple: "/img/Logomark.png",
//     shortcut: "/img/Logomark.png",
//   },
//   appleWebApp: {
//     capable: true,
//     statusBarStyle: "black-translucent",
//     title: "Chánh Đang",
//   },
// };

export const metadata: Metadata = {
  title: "Chánh Đang — Developer & Designer",
  description:
    "Full-stack developer specialized in building modern websites and mobile applications with clean design, performance, and creativity.",
  keywords: [
    "Chanh Dang",
    "Developer",
    "Web Developer",
    "App Developer",
    "UI UX Designer",
    "Next.js",
    "React Native",
  ],
  manifest: "/manifest.webmanifest",
  themeColor: "#000000",

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
    title: "Chánh Đang — Developer & Designer",
    description:
      "Building modern web and mobile experiences with clean code and creative design.",
    url: "https://chanhdang.com",
    siteName: "ChanhDang",
    images: [
      {
        url: "https://cdn.chanhdang.com/ncdang_cover_2.jpg",
        width: 1200,
        height: 630,
        alt: "Chanh Dang — Developer & Designer",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  metadataBase: new URL("https://chanhdang.com"),
  alternates: {
    canonical: "https://chanhdang.com",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("Render RootLayout");

  return (
    <html lang="en" className="light scroll-smooth" suppressHydrationWarning>
      <body
        className={cn(
          fontBody.variable,
          fontHandWritten.variable,
          fontMono.variable
        )}
      >
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
