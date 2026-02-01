import { useRef, useState, useEffect } from "react";

export function useScrollCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    // Initial check after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      updateScrollButtons();
    }, 100);

    element.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons, { passive: true });

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updateScrollButtons())
        : null;

    if (resizeObserver) {
      resizeObserver.observe(element);
    }

    return () => {
      clearTimeout(timeoutId);
      element.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
      resizeObserver?.disconnect();
    };
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      const element = scrollRef.current;
      const firstChild = element.firstElementChild?.firstElementChild as HTMLElement;
      
      // Tính toán scroll dựa trên chiều rộng item hoặc 80% viewport
      const scrollAmount = firstChild?.offsetWidth 
        ? firstChild.offsetWidth + 16 // width + gap
        : element.clientWidth * 0.8;
      
      element.scrollBy({ 
        left: -scrollAmount, 
        behavior: "smooth" 
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const element = scrollRef.current;
      const firstChild = element.firstElementChild?.firstElementChild as HTMLElement;
      
      // Tính toán scroll dựa trên chiều rộng item hoặc 80% viewport
      const scrollAmount = firstChild?.offsetWidth 
        ? firstChild.offsetWidth + 16 // width + gap
        : element.clientWidth * 0.8;
      
      element.scrollBy({ 
        left: scrollAmount, 
        behavior: "smooth" 
      });
    }
  };

  return {
    scrollRef,
    scrollLeft,
    scrollRight,
    canScrollLeft,
    canScrollRight,
  };
}
