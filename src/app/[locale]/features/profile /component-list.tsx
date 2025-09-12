/* eslint-disable @next/next/no-img-element */
import { ArrowRight, PenNib } from "@phosphor-icons/react/dist/ssr";

export function ComponentList() {
  return (
    <>
      <div className="">
        <div className="rounded-[16px] border border-zinc-200 px-4 py-2 text-2xl font-semibold dark:border-zinc-800">
          Components
        </div>
      </div>

      <div className="mt-2 rounded-[16px] border border-zinc-200 bg-zinc-50 bg-[radial-gradient(circle,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:12px_12px] p-2 font-mono text-sm dark:border-zinc-800 dark:bg-[#030610] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)]">
        <div className="flex items-center gap-2">
          <PenNib size={20} weight="fill" className="shrink-0" />
          <div className="text-balance">
            Here you’ll find a growing set of UI components that I’ve created to
            share with the community. Each component can be installed directly
            into your project with one simple command, giving you ready-to-use
            building blocks that save time and keep your UI consistent.
          </div>
        </div>

        <div className="my-4 space-y-4">
          <div className="flex items-center gap-2">
            <ArrowRight size={20} />

            <img
              src="/img/tech-stack/react.svg"
              alt="icon"
              className="size-6"
            />

            <div className="hover:underline">Hello-Word</div>
          </div>

          <div className="flex items-center gap-2">
            <ArrowRight size={20} />

            <img
              src="/img/tech-stack/react.svg"
              alt="icon"
              className="size-6"
            />

            <div className="hover:underline">Dynamic-Island</div>
          </div>

          <div className="mb-2 flex items-center gap-2">
            <ArrowRight size={20} />

            <img
              src="/img/tech-stack/react.svg"
              alt="icon"
              className="size-6"
            />

            <div className="hover:underline">Switch-Theme</div>
          </div>
        </div>
      </div>
    </>
  );
}
