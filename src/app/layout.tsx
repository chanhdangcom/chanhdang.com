// Root layout - minimal wrapper
// Main layout logic is in app/[locale]/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Layout in [locale] already has html and body tags
  // This is just a pass-through wrapper
  return children;
}
