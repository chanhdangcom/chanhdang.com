"use client";
import { CardSpotlight } from "@/components/ui/card-spotlight";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/utils/cn";

/* eslint-disable @next/next/no-img-element */
type IProp = {
  scrImg: string;
  title: string;
  accountName: string;
  link?: string;
  className?: string;
};

export function SocialItem({
  scrImg,
  title,
  accountName,
  link,
  className,
}: IProp) {
  const [isHover, setIsHover] = useState(false);

  return (
    <Link
      href={link || ""}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      target="_blank"
    >
      <CardSpotlight className={cn("", className)}>
        <div className="flex items-center justify-start gap-2 p-4">
          <img src={scrImg} alt="icon" className="size-12" />

          <div>
            <motion.div
              className="text-balance font-apple font-semibold"
              animate={isHover ? { x: 10 } : { x: 0 }}
              transition={{ ease: "easeOut" }}
            >
              {title}
            </motion.div>

            <motion.div
              animate={isHover ? { x: 10 } : { x: 0 }}
              transition={{ delay: 0.1, ease: "easeOut" }}
              className="font-mono text-xs text-zinc-500"
            >
              {accountName}
            </motion.div>
          </div>
        </div>
      </CardSpotlight>
    </Link>
  );
}
