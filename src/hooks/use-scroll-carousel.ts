import { useRef } from "react";

export function useScrollCarousel() {
  const scrollRef= useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };  

  return {
    scrollRef,
    scrollLeft,
    scrollRight,
  };    
}
