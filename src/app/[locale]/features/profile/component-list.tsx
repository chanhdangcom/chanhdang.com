import { useTranslations } from "next-intl";
import { ComponentListItem } from "./components/component-list-item";

export function ComponentList() {
  const t = useTranslations();

  return (
    <section aria-labelledby="components-heading">
      <div className="mb-8">
        <p className="top-0 mx-4 font-mono text-xs text-zinc-500 md:mx-[15vw]">
          text-4xl font-semibold mx-4
        </p>

        <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-900" />

        <h2
          id="components-heading"
          className="flex text-balance px-4 font-mono text-3xl font-semibold leading-tight tracking-tight md:mx-[15vw] md:px-0 md:text-4xl"
        >
          Component
        </h2>

        <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-900" />
      </div>

      <div className="bottom-0 h-px w-full bg-zinc-200 dark:bg-zinc-900" />

      <div className="mx-0 md:mx-[15vw]">
        <p className="mx-4 mt-4 text-balance font-mono">
          {t("descomponent.Descriptio")}
        </p>

        <div className="mb-8 mt-4 border-t border-dashed border-zinc-200 dark:border-zinc-900">
          <ComponentListItem
            title="Hello-world"
            slug="/components/hello-word.mdx"
          />

          <ComponentListItem title="Dynamic-island" />

          <ComponentListItem
            title="Switch-theme"
            slug="/components/theme-switcher.mdx"
          />
        </div>
      </div>

      <div className="bottom-0 h-px w-full bg-zinc-200 dark:bg-zinc-900" />
    </section>
  );
}
