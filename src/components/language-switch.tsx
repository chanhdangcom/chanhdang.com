"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Languages } from "lucide-react";

export function LanguageSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLocale = locale === "vi" ? "en" : "vi";

    // Tạo path mới với locale mới
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);

    // Navigate đến path mới
    router.push(newPath);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="border-border hover:bg-accent hover:text-accent-foreground relative h-9 w-9 rounded-md border bg-background"
      title={locale === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
    >
      <Languages className="h-4 w-4" />
      <span className="sr-only">Toggle language</span>
      <div className="bg-primary text-primary-foreground absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full text-[10px] font-bold">
        {locale.toUpperCase()}
      </div>
    </Button>
  );
}
