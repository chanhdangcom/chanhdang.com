import { TeckLish } from "@/components/teck-lish";
import { useTranslations } from "next-intl";

export function TitleIntro() {
  const t = useTranslations();

  return (
    <>
      <div className="space-y-8 md:my-0">
        <div>
          <div className="pointer-events-none top-0 mx-4 font-mono text-xs text-zinc-500 md:mx-48">
            text-5xl text-balance tracking-tight
          </div>

          <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-800" />

          <div className="mx-4 text-balance font-mono text-3xl font-semibold leading-tight tracking-tight md:mx-48 md:text-4xl">
            {t("titleintro.Title")}
          </div>

          <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-800" />
        </div>

        <div>
          <div className="top-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

          <div className="mx-0 md:mx-48">
            <TeckLish />
          </div>

          <div className="bottom-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </>
  );
}
