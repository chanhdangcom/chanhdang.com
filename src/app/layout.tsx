// Root layout - provides html/body
// Fonts loaded via link to avoid build-time fetch (fixes Vercel/build when Google Fonts is unreachable)
import { cn } from "@/lib/utils";
import { ClientRoot } from "./ClientRoot";
import { fonts } from "@/lib/fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("scroll-smooth", fonts)}
      suppressHydrationWarning
    >
      <body>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
