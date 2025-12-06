import { TeckLish } from "@/components/teck-lish";
import { useTranslations } from "next-intl";

export function TitleIntro() {
  const t = useTranslations();

  return (
    <section
      aria-labelledby="profile-intro-heading"
      className="space-y-8 md:my-0"
    >
      <div>
        <p className="pointer-events-none top-0 mx-4 font-mono text-xs text-zinc-500 md:mx-[15vw]">
          text-4xl font-semibold tracking-tight
        </p>

        <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-900" />

        <h1
          id="profile-intro-heading"
          className="mx-4 text-balance font-mono text-3xl font-semibold leading-tight tracking-tight md:mx-[15vw] md:text-4xl"
        >
          {t("titleintro.Title")}
        </h1>

        <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-900" />
      </div>

      <div>
        <div className="top-0 h-px w-full bg-zinc-200 dark:bg-zinc-900" />

        <div className="mx-0 md:mx-[15vw]">
          <TeckLish />
        </div>

        <div className="bottom-0 h-px w-full bg-zinc-200 dark:bg-zinc-900" />
      </div>
    </section>
  );
}
