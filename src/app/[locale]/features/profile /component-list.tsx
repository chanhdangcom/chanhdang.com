import { useTranslations } from "next-intl";
import { ComponentListItem } from "./components/component-list-item";

export function ComponentList() {
  const t = useTranslations();

  return (
    <>
      <div className="mb-8">
        <div className="top-0 mx-4 font-mono text-xs text-zinc-500 md:mx-48">
          text-4xl pb-8 pt-12
        </div>

        <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-800" />

        <div className="mx-4 flex text-balance font-mono text-3xl font-semibold leading-tight tracking-tight md:mx-48 md:text-4xl">
          <div>Component</div>
        </div>

        <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-800" />
      </div>

      <div className="bottom-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

      <div className="mx-0 md:mx-48">
        <div className="mx-4 mt-4 text-balance font-mono">
          {t("descomponent.Descriptio")}
        </div>

        <div className="mb-8 mt-4 border-t border-dashed border-zinc-200 dark:border-zinc-800">
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

      <div className="bottom-0 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
    </>
  );
}
