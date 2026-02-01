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
          className="group absolute left-1 top-1/2 z-40 flex h-20 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg bg-zinc-400/50 backdrop-blur-md hover:scale-105 md:left-[260px]"
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
          className="group absolute right-1 top-1/2 z-40 flex h-20 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg bg-zinc-400/60 backdrop-blur-md hover:scale-105"
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
