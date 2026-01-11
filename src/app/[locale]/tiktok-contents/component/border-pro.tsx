import { cn } from "@/lib/utils";

type IProp = {
  children: React.ReactNode;
  className?: string;
};

export function BorderPro({ children, className }: IProp) {
  return (
    <>
      <div className="relative">
        {children}

        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-black/10 dark:ring-white/10",
            className
          )}
        />
      </div>
    </>
  );
}
