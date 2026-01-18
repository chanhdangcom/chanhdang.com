// Root layout - provides html/body
export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params?: { locale?: string };
}>) {
  const lang = params?.locale || "en";
  return (
    <html lang={lang} className="light scroll-smooth" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
