import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export function SwitchLanguage() {
  const locale = useLocale();

  return (
    <div className="rounded-3xl border p-1 pr-2 font-mono dark:border-zinc-800">
      {locale == "en" ? (
        <Link href={"/vi"} className="flex items-center gap-1">
          <Image
            alt="flag"
            src="/img/Flag_of_Vietnam.png"
            width={192}
            height={192}
            className="size-6 shrink-0 rounded-full bg-cover"
          />

          <div className="text-sm">VIE</div>
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
