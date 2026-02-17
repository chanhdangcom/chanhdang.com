"use client";

import { useEffect, useRef, memo, useState } from "react";
import { useTranslations } from "next-intl";
import { useAudio } from "@/components/music-provider";
import { useSpringScroll } from "@/hooks/use-spring-scroll";
import { useImageHoverColor } from "@/hooks/use-image-hover-color";

const SubtitleItem = memo(
  ({ id, text, isActive }: { id: number; text: string; isActive: boolean }) => {
    return (
      <p
        id={`sidebar-subtitle-${id}`}
        className={`z-40 mb-6 text-balance pt-4 text-3xl font-bold md:mb-8 ${
          isActive
            ? "text-balance font-semibold leading-snug text-white"
            : "text-balance leading-snug text-white/20"
        }`}
      >
        {text}
      </p>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isActive === nextProps.isActive &&
      prevProps.text === nextProps.text &&
      prevProps.id === nextProps.id
    );
  }
);

SubtitleItem.displayName = "LyricSidebarSubtitleItem";

export function LyricSidebar() {
  const { currentMusic, subtitles, currentSubtitleId, setIsPlayerPageOpen } =
    useAudio();
  const t = useTranslations("music.lyric");

  const [isOpen, setIsOpen] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  useSpringScroll(scrollRef);

  // Lắng nghe click từ AudioBar để bật/tắt sidebar lyric
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleToggle = () => {
      setIsOpen((prev) => !prev);
    };

    window.addEventListener("toggle-lyric-sidebar", handleToggle);
    return () => {
      window.removeEventListener("toggle-lyric-sidebar", handleToggle);
    };
  }, []);

  // Bật trạng thái "player page" để provider sync subtitle theo thời gian thực
  useEffect(() => {
    if (!isOpen) {
      setIsPlayerPageOpen(false);
      return;
    }

    setIsPlayerPageOpen(true);
    return () => {
      setIsPlayerPageOpen(false);
    };
  }, [isOpen, setIsPlayerPageOpen]);

  const hoverBg = useImageHoverColor(currentMusic?.cover, {
    alpha: 0.95,
  });

  // Auto scroll tới subtitle đang active
  useEffect(() => {
    if (!currentSubtitleId || !scrollRef.current) return;

    const container = scrollRef.current;
    const activeElement = document.getElementById(
      `sidebar-subtitle-${currentSubtitleId}`
    );

    if (!container || !activeElement) return;

    const containerRect = container.getBoundingClientRect();
    const elementRect = activeElement.getBoundingClientRect();
    const containerScrollTop = container.scrollTop;
    const viewportHeight = containerRect.height;

    const elementTop = elementRect.top - containerRect.top + containerScrollTop;

    const targetOffset = viewportHeight * 0.3;
    const targetScrollTop = elementTop - targetOffset;

    const currentOffset = elementRect.top - containerRect.top;
    const offsetDifference = Math.abs(currentOffset - targetOffset);

    if (offsetDifference < 40 && currentOffset >= 0) {
      return;
    }

    container.scrollTo({
      top: Math.max(0, targetScrollTop),
      behavior: "smooth",
    });
  }, [currentSubtitleId]);

  // Không render sidebar nếu chưa có bài hát hoặc đang tắt
  if (!currentMusic || !isOpen) {
    return null;
  }

  return (
    <aside className="fixed inset-y-0 right-0 z-50 hidden h-full w-[24vw] overflow-hidden border-l border-white/10 bg-zinc-950/80 shadow-[0_0_40px_rgba(0,0,0,0.65)] backdrop-blur-2xl lg:block">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundColor: hoverBg,
          backgroundImage: `radial-gradient(120% 95% at 50% 0%, ${hoverBg} 0%, rgba(24,24,27,0.8) 55%, rgba(9,9,11,1) 100%)`,
        }}
      />

      <div className="flex h-full flex-col">
        <div
          ref={scrollRef}
          className="scroll-spring relative h-full flex-1 overflow-y-auto px-5 pb-10 pr-4 scrollbar-hide"
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            overscrollBehaviorY: "auto",
          }}
        >
          {subtitles.length === 0 ? (
            <div className="mt-6 text-xs text-white/60">
              {t("noLyrics")}
            </div>
          ) : (
            <div className="mt-2 space-y-1.5 font-apple">
              {subtitles.map((line) => (
                <SubtitleItem
                  key={line.id}
                  id={line.id}
                  text={line.text}
                  isActive={currentSubtitleId === line.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
