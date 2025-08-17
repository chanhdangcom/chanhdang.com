import { useEffect } from "react";

export const useEscapePress = (
  callback: (event: KeyboardEvent) => void,
  isEnabled: boolean
) => {
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    function listener(event: KeyboardEvent) {
      if (event.key === "Escape") {
        callback(event);
      }
    }

    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [callback, isEnabled]);
};
