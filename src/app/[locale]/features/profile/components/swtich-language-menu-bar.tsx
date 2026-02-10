import { cn } from "@/utils/cn";
import { Translate } from "@phosphor-icons/react/dist/ssr";
import { useLocale } from "next-intl";
import Link from "next/link";

type IProp = { className?: string };

export function SwitchLanguageMenuBar({ className }: IProp) {
  const locale = useLocale();

  if (locale == "en") {
    return (
      <Link href={"/vi/music"} className="flex items-center gap-2">
        <Translate
          size={25}
          className="size-5 text-red-500 dark:text-blue-500 md:size-7"
        />

        <div className="font-medium">Vietnamese</div>
      </Link>
    );
  }

  return (
    <div className={cn("font-apple", className)}>
      <Link href={"/en/music"} className="flex items-center gap-2">
        <Translate
          size={25}
          className="size-5 text-red-500 dark:text-blue-500 md:size-7"
        />

        <div className="font-medium">English</div>
      </Link>
    </div>
  );
}
