"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ChanhdangLogotype } from "@/components/chanhdang-logotype";
import { BorderPro } from "./border-pro";

type AdModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
};

type AdGif = {
  id: number;
  image: string;
};

const adGifs: AdGif[] = [
  {
    id: 1,
    image:
      "https://images.squarespace-cdn.com/content/v1/59124bd8197aeaf88cc3c03d/1653669869434-JK9OBA1EZYGYN80W65DN/Music_JP-New-Life-6-16x9-Cinemagraph-Swirl-Social_05_rev0_Video_JP-JP_TBD_AMXD0118173H_MOS.gif?format=750w",
  },
];
export function AdModal({ isOpen, onClose, onContinue }: AdModalProps) {
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const withLocale = (path: string) => `/${locale}${path}`;

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setCanSkip(false);
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleContinue = () => {
    if (canSkip) {
      onContinue();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-2 font-apple md:px-0">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 backdrop-blur-xl"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative z-10 w-full max-w-md rounded-3xl border bg-zinc-200 p-4 shadow-md dark:border-zinc-800 dark:bg-zinc-900"
        >
          {/* Close button */}

          {/* Ad Content */}
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold dark:text-white">Quảng cáo</h2>
              <p className="text-zinc-700 dark:text-zinc-400">
                Đăng nhập để nghe nhạc không gián đoạn
              </p>
            </div>

            <div className="relative">
              {/* <video
                key={selectedVideo}
                src={selectedVideo}
                autoPlay
                loop
                playsInline
                className="pointer-events-none h-80 w-full select-none rounded-3xl object-cover"
              /> */}

              <BorderPro roundedSize="rounded-3xl">
                <img
                  src={adGifs[0].image}
                  alt={adGifs[0].image}
                  className="pointer-events-none h-80 w-full select-none rounded-3xl object-cover"
                />
              </BorderPro>

              <ChanhdangLogotype className="absolute left-2 top-2 text-white" />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href={withLocale("/auth/login")}
                className="block w-full rounded-full bg-white px-6 py-3 text-center font-semibold text-black transition-transform hover:scale-105 active:scale-95"
                onClick={onClose}
              >
                Đăng nhập miễn phí
              </Link>

              <button
                onClick={handleContinue}
                disabled={!canSkip}
                className={`w-full rounded-full border-2 px-6 py-3 font-semibold transition-all ${
                  canSkip
                    ? "border-white bg-transparent hover:bg-zinc-700 dark:text-white"
                    : "cursor-not-allowed border-zinc-600 bg-transparent text-zinc-600"
                }`}
              >
                {canSkip ? "Bỏ qua" : `Bỏ qua sau ${countdown}s`}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
