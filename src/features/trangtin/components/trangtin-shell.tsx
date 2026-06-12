import type { ReactNode } from "react";
import { Footer } from "@/app/[locale]/features/profile/footer";
import { TrangTinHeader } from "./trangtin-header";

type TrangTinPageHeadingProps = {
  title: string;
  hint?: string;
  description?: string;
};

export function TrangTinPageHeading({
  title,
  hint = "text-4xl font-semibold tracking-tight",
  description,
}: TrangTinPageHeadingProps) {
  return (
    <div className="mt-6">
      <div className="top-0 mx-4 font-mono text-xs text-zinc-500 md:mx-[15vw]">
        {hint}
      </div>

      <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-900" />

      <div className="mx-4 text-balance font-mono text-3xl font-semibold leading-tight tracking-tight md:mx-[15vw] md:text-4xl">
        <h1>{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-base font-normal text-zinc-500">
            {description}
          </p>
        )}
      </div>

      <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-900" />
    </div>
  );
}

type TrangTinContentProps = {
  children: ReactNode;
  className?: string;
};

export function TrangTinContent({ children, className = "" }: TrangTinContentProps) {
  return (
    <div className="mt-8">
      <div className="top-0 h-px w-full bg-zinc-200 dark:bg-zinc-900" />
      <div className={`md:mx-[15vw] ${className}`}>{children}</div>
    </div>
  );
}

type TrangTinShellProps = {
  children: ReactNode;
};

export function TrangTinShell({ children }: TrangTinShellProps) {
  return (
    <div>
      <div className="fixed left-0 h-screen w-px bg-zinc-200 dark:bg-zinc-900 md:left-[15vw]" />
      <div className="fixed right-0 h-screen w-px bg-zinc-200 dark:bg-zinc-900 md:right-[15vw]" />

      <div className="mx-0 border border-zinc-300 p-2 dark:border-zinc-900 md:mx-[15vw]">
        <TrangTinHeader />
      </div>

      {children}
      <Footer />
    </div>
  );
}
