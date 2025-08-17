import { useEffect } from "react";

export const useScroll = (
  callback: (event: Event) => void,
  isEnabled: boolean
) => {
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const handleScroll = (event: Event) => {
      console.log("Scroll");
      callback(event);
    };

    document.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [callback, isEnabled]);
};
