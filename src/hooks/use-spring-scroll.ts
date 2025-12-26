import { useEffect, useRef } from "react";

/**
 * Custom hook để tạo hiệu ứng scroll lò xo như Apple Music iOS 16
 * Sử dụng spring physics để tạo bounce effect khi scroll đến đầu/cuối
 */
export function useSpringScroll(ref: React.RefObject<HTMLDivElement | null>) {
  const velocityRef = useRef(0);
  const lastScrollTopRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let lastTime = performance.now();
    let lastScrollTop = element.scrollTop;

    const handleScroll = () => {
      const now = performance.now();
      const deltaTime = now - lastTime;
      const currentScrollTop = element.scrollTop;
      
      // Tính toán velocity
      if (deltaTime > 0) {
        velocityRef.current = (currentScrollTop - lastScrollTop) / deltaTime;
      }
      
      lastScrollTop = currentScrollTop;
      lastTime = now;
      lastScrollTopRef.current = currentScrollTop;
    };

    const applySpringBounce = () => {
      if (!element) return;

      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const clientHeight = element.clientHeight;
      const maxScroll = scrollHeight - clientHeight;

      // Kiểm tra overscroll ở đầu
      if (scrollTop < 0) {
        const overscroll = Math.abs(scrollTop);
        // Spring physics với damping và stiffness giống iOS
        const damping = 0.85;
        const stiffness = 0.12;
        const newOverscroll = overscroll * damping - stiffness;
        
        if (newOverscroll > 0.5) {
          element.scrollTop = -newOverscroll;
          animationFrameRef.current = requestAnimationFrame(applySpringBounce);
        } else {
          element.scrollTop = 0;
        }
        return;
      }

      // Kiểm tra overscroll ở cuối
      if (scrollTop > maxScroll) {
        const overscroll = scrollTop - maxScroll;
        const damping = 0.85;
        const stiffness = 0.12;
        const newOverscroll = overscroll * damping - stiffness;
        
        if (newOverscroll > 0.5) {
          element.scrollTop = maxScroll + newOverscroll;
          animationFrameRef.current = requestAnimationFrame(applySpringBounce);
        } else {
          element.scrollTop = maxScroll;
        }
        return;
      }

      // Momentum scrolling khi thả tay (giống iOS)
      if (Math.abs(velocityRef.current) > 0.05) {
        const friction = 0.92; // Giảm friction để momentum mượt hơn
        velocityRef.current *= friction;
        
        if (Math.abs(velocityRef.current) > 0.05) {
          const newScrollTop = element.scrollTop + velocityRef.current * 16;
          // Giới hạn trong phạm vi hợp lệ
          element.scrollTop = Math.max(0, Math.min(maxScroll, newScrollTop));
          animationFrameRef.current = requestAnimationFrame(applySpringBounce);
        } else {
          velocityRef.current = 0;
        }
      }
    };

    const handleTouchEnd = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(applySpringBounce);
    };

    const handleWheel = (e: WheelEvent) => {
      // Chỉ apply spring bounce khi scroll đến đầu/cuối
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const clientHeight = element.clientHeight;
      const maxScroll = scrollHeight - clientHeight;

      if (
        (scrollTop <= 0 && e.deltaY < 0) ||
        (scrollTop >= maxScroll && e.deltaY > 0)
      ) {
        e.preventDefault();
        // Tạo bounce effect nhẹ
        const bounceAmount = e.deltaY * 0.3;
        element.scrollTop = Math.max(
          0,
          Math.min(maxScroll, scrollTop + bounceAmount)
        );
      }
    };

    element.addEventListener("scroll", handleScroll, { passive: true });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });
    element.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      element.removeEventListener("scroll", handleScroll);
      element.removeEventListener("touchend", handleTouchEnd);
      element.removeEventListener("wheel", handleWheel);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [ref]);
}

