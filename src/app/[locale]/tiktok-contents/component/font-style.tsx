import { cn } from "@/utils/cn";

type Iprop = {
  title: string;
  className?: string;
};

export function FontStyle({ title, className }: Iprop) {
  return (
    <>
      <div className={cn("font-mono text-3xl text-yellow-500", className)}>
        {title}
      </div>
    </>
  );
}
