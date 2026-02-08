"use client";

import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { motion } from "motion/react";
import { useParams } from "next/navigation";
import { cn } from "@/utils/cn";

export function BackButton({ className }: { className?: string }) {
  const param = useParams();
  const locale = (param?.locale as string) || "en";

  return (
    <div
      className={cn(
        "fixed left-4 top-2 z-10 flex items-center gap-1 md:hidden",
        className
      )}
    >
      <Link href={`/${locale}/music`}>
        <motion.div
          whileTap={{ scale: 0.3 }}
          className="rounded-full bg-zinc-300/60 p-2 shadow-2xl backdrop-blur-sm dark:bg-zinc-900/60"
          layout
        >
          <CaretLeft
            size={28}
            weight="regular"
            className="text-black dark:text-white"
          />
        </motion.div>
      </Link>
    </div>
  );
}
