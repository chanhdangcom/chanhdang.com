import type { Metadata } from "next";
import { Pacifico, Roboto_Condensed, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/utils/cn";

import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Providers } from "../Providers";
import { setRequestLocale } from "next-intl/server";
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

export const metadata: Metadata = {
  title: "Chánh Đang - I am a Developer",
  description:
    "Passionate IT Developer specialized in building efficient, scalable, and user-focused digital solutions.",
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
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  console.log("Render RootLayout");

  const { locale } = params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

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
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
