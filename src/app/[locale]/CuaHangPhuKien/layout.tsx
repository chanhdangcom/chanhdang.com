import type { ReactNode } from "react";
import { ShopHeader } from "@/features/shop/components/shop-header";
import { Footer } from "../features/profile/footer";

export default async function ShopLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white">
      <ShopHeader locale={locale} />
      <main className="container py-10">{children}</main>
      <Footer />
    </div>
  );
}
