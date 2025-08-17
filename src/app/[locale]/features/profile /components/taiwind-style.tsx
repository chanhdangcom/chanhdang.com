type IProp = {
  useX?: boolean;
};

export function TailwindStyle({ useX }: IProp) {
  const X = () => {
    return (
      <div>
        <div className="fixed flex h-screen w-4 border-r bg-[image:repeating-linear-gradient(315deg,_var(--pattern-foreground)_0,_var(--pattern-foreground)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] [--pattern-foreground:#e4e4e7] dark:border-zinc-800 dark:[--pattern-foreground:#27272a] md:w-8" />
        <div className="relative top-0 h-[1px] w-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="fixed right-0 flex h-screen w-4 border-l bg-[image:repeating-linear-gradient(315deg,_var(--pattern-foreground)_0,_var(--pattern-foreground)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] [--pattern-foreground:#e4e4e7] dark:border-zinc-800 dark:[--pattern-foreground:#27272a] md:w-8" />
      </div>
    );
  };

  if (!useX) return X();

  return (
    <div>
      <div className="relative top-0 h-[1px] w-full bg-zinc-200 dark:bg-zinc-800"></div>
      <div className="flex h-4 w-full bg-zinc-50 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-foreground)_0,_var(--pattern-foreground)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] [--pattern-foreground:#e4e4e7] dark:bg-[#030610] dark:[--pattern-foreground:#27272a] md:h-8" />
      <div className="relative bottom-0 h-[1px] w-full bg-zinc-200 dark:bg-zinc-800"></div>
    </div>
  );
}
