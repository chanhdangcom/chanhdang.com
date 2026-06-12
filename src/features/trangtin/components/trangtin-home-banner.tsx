"use client";

import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export function TrangTinHomeBanner() {
  return (
    <>
      <div className="hidden h-80 items-center justify-center pt-12 lg:flex">
        <TextHoverEffect text="NEWS" />
      </div>

      <section
        aria-labelledby="trangtin-intro-heading"
        className="space-y-8 md:my-0"
      >
        <div>
          <p className="pointer-events-none top-0 mx-4 font-mono text-xs text-zinc-500 md:mx-[15vw]">
            text-4xl font-semibold tracking-tight
          </p>

          <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-900" />

          <h1
            id="trangtin-intro-heading"
            className="mx-4 text-balance font-mono text-3xl font-semibold leading-tight tracking-tight md:mx-[15vw] md:text-4xl"
          >
            ChanhDang News: Your Daily Byte of Tech Innovation.
          </h1>

          <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-900" />
        </div>
      </section>
    </>
  );
}
