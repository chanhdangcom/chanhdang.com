import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { CaretLeft } from "phosphor-react";

type IProp = {
  children: React.ReactNode;
  scrollLeft: () => void;
  scrollRight: () => void;
};

export function ScrollCarouselItem({
  children,
  scrollLeft,
  scrollRight,
}: IProp) {
  return (
    <>
      <div
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 z-40 flex h-24 -translate-y-1/2 cursor-pointer items-center rounded-r-2xl border border-white/10 bg-zinc-500/60 text-xl opacity-40 backdrop-blur-sm duration-200 hover:opacity-100 md:left-[256px]"
      >
        <CaretLeft size={32} className="size-8 text-white" />
      </div>

      {children}

      <div
        onClick={scrollRight}
        className="absolute right-0 top-1/2 flex h-24 -translate-y-1/2 cursor-pointer items-center rounded-l-2xl border border-white/10 bg-zinc-700/60 text-xl opacity-40 backdrop-blur-sm duration-200 hover:opacity-100"
      >
        <CaretRight size={32} className="size-8 text-white" />
      </div>
    </>
  );
}
