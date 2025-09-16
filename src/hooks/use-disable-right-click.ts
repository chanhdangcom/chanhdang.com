import { useEffect } from "react";

export const useDisableRightClick = () => {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Vô hiệu hóa F12, Ctrl+Shift+I, Ctrl+U
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Thêm event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup khi component unmount
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};
