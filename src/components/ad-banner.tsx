"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdBannerProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export function AdBanner({ onClose, showCloseButton = true }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-20 left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-lg border border-zinc-300 bg-gradient-to-r from-blue-500 to-purple-600 p-4 shadow-2xl dark:border-zinc-700"
        >
          <div className="relative">
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="absolute right-0 top-0 rounded-full bg-white/20 p-1 text-white hover:bg-white/30"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="text-center text-white">
              <h3 className="mb-2 text-lg font-bold">🎵 Quảng cáo</h3>
              <p className="mb-3 text-sm">
                Đăng nhập để nghe nhạc không quảng cáo và nhiều tính năng khác!
              </p>
              <div className="flex justify-center gap-2">
                <a
                  href="/auth/login"
                  className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  Đăng nhập ngay
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Ad component that shows between songs for guest users
 */
export function AdBetweenSongs() {
  const [showAd, setShowAd] = useState(false);
  const [adDuration] = useState(5); // 5 seconds

  useEffect(() => {
    if (showAd) {
      const timer = setTimeout(() => {
        setShowAd(false);
      }, adDuration * 1000);
      return () => clearTimeout(timer);
    }
  }, [showAd, adDuration]);

  const triggerAd = () => {
    setShowAd(true);
  };

  return {
    showAd,
    triggerAd,
    AdComponent: showAd ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      >
        <div className="rounded-lg bg-white p-8 text-center dark:bg-zinc-900">
          <h2 className="mb-4 text-2xl font-bold">Quảng cáo</h2>
          <p className="mb-4 text-zinc-600 dark:text-zinc-400">
            Đang phát quảng cáo... ({adDuration}s)
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: adDuration, ease: "linear" }}
            />
          </div>
        </div>
      </motion.div>
    ) : null,
  };
}
