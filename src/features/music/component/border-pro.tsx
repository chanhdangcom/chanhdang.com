type IProp = {
  children: React.ReactNode;
  roundedSize?: string;
};

export function BorderPro({ children, roundedSize = "rounded-xl" }: IProp) {
  return (
    <div className="relative">
      {children}

      <div
        className={`${roundedSize} pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10`}
      />
    </div>
  );
}
