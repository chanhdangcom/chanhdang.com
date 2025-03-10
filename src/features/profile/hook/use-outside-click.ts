import React, { useEffect } from "react";

export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement | null>, 
  callback: (event: MouseEvent | TouchEvent | Event) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event);
    };

   const handleScroll = (event: Event) => {
    callback(event);
   };
    
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    document.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [ref, callback]);
};