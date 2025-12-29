import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import { CaretLeft } from "phosphor-react";

type IProp = {
  children: React.ReactNode;
  scrollLeft: () => void;
  scrollRight: () => void;
  canScrollLeft?: boolean;
  canScrollRight?: boolean;
};

export function ScrollCarouselItem({
  children,
  scrollLeft,
  scrollRight,
  canScrollLeft = true,
  canScrollRight = true,
}: IProp) {
  return (
    <div className="group/carousel relative">
      {canScrollLeft && (
        <div
          onClick={scrollLeft}
          className="group absolute left-0 top-1/2 z-40 flex h-24 -translate-y-1/2 cursor-pointer items-center justify-center rounded-r-2xl border border-white/20 bg-gradient-to-r from-zinc-900/90 to-transparent text-xl opacity-70 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white/40 hover:opacity-100 md:left-[256px]"
        >
          <CaretLeft
            size={32}
            className="size-8 text-white transition-transform group-hover:scale-125"
          />
        </div>
      )}

      {children}

      {canScrollRight && (
        <div
          onClick={scrollRight}
          className="group absolute right-0 top-1/2 z-40 flex h-24 -translate-y-1/2 cursor-pointer items-center justify-center rounded-l-2xl border border-white/20 bg-gradient-to-l from-zinc-900/90 to-transparent text-xl opacity-70 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white/40 hover:opacity-100"
        >
          <CaretRight
            size={32}
            className="size-8 text-white transition-transform group-hover:scale-125"
          />
        </div>
      )}
    </div>
  );
}
