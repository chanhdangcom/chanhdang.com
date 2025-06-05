import type { Metadata } from "next";
import { Pacifico, Roboto_Condensed, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/utils/cn";
import { Providers } from "./Providers";

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
  description: "I am a developer.",
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

export default function RootLayout({
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
