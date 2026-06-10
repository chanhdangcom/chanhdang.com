"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
/* eslint-disable @next/next/no-img-element */
export function MagicCaroReview() {
  const param = useParams();
  const locale = (param?.locale as string) || "en";

  return (
    <section aria-labelledby="components-heading">
      <div className="mb-8">
        <p className="top-0 mx-4 font-mono text-xs text-zinc-500 md:mx-[15vw]">
          text-4xl font-semibold mx-4
        </p>

        <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-900" />

        <Link href={`/${locale}/magic-caro`}>
          <h2
            id="components-heading"
            className="flex text-balance px-4 font-mono text-3xl font-semibold leading-tight tracking-tight hover:underline md:mx-[15vw] md:px-0 md:text-4xl"
          >
            Magic Caro
          </h2>
        </Link>

        <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-900" />
      </div>

      <div className="bottom-0 h-px w-full bg-zinc-200 dark:bg-zinc-900" />

      <div className="mx-0 px-4 py-4 md:mx-[15vw] md:px-20">
        <div className="w-full space-y-4">
          <div className="rounded-xl border p-2 shadow-sm dark:border-zinc-900">
            <img
              src="/img/magic-caro-desktop.png"
              alt="Magic Caro Review"
              className="w-full rounded-md"
            />
          </div>

          <div className="rounded-xl border p-2 shadow-sm dark:border-zinc-900">
            <img
              src="/img/magic-caro-menu.png"
              alt="Magic Caro Review"
              className="w-full rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="bottom-0 h-px w-full bg-zinc-200 dark:bg-zinc-900" />
    </section>
  );
}
