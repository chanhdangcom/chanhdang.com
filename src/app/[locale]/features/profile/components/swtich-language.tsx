import { cn } from "@/utils/cn";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";

type IProp = { className?: string };

export function SwitchLanguage({ className }: IProp) {
  const locale = useLocale();

  return (
    <div
      className={cn(
        "rounded-3xl border p-1 pr-2 font-mono dark:border-zinc-800",
        className
      )}
    >
      {locale == "en" ? (
        <Link href={"/vi"} className="flex items-center gap-1">
          <Image
            alt="flag"
            src="/img/Flag_of_Vietnam.png"
            width={192}
            height={192}
            className="size-6 shrink-0 rounded-full bg-cover"
          />

          <div className="text-xs">VIE</div>
        </Link>
      ) : (
        <Link href={"/en"} className="flex items-center gap-1">
          <Image
            alt="flag"
            src="/img/Flag_of_the_United_Kingdom.png"
            width={192}
            height={192}
            className="size-6 rounded-full bg-cover"
          />

          <div className="text-sm">ENG</div>
        </Link>
      )}
    </div>
  );
}
