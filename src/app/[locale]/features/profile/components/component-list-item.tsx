"use client";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";

type IProp = {
  title: string;
  slug?: string;
  img?: string;
};

export function ComponentListItem({ title, slug, img }: IProp) {
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <Link
      href={slug || ""}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <CardSpotlight>
        <div className="flex items-center gap-2 p-4">
          <ArrowRight size={20} />

          <motion.img
            animate={isHover ? { x: 10 } : { x: 0 }}
            transition={{ delay: 0.1, ease: "easeOut" }}
            src={img || "/img/tech-stack/react.svg"}
            alt="icon"
            className="size-6 rounded-sm"
          />

          <motion.div
            animate={isHover ? { x: 10 } : { x: 0 }}
            transition={{ ease: "easeOut" }}
            className="font-mono text-sm hover:underline"
          >
            {title}
          </motion.div>
        </div>
      </CardSpotlight>
    </Link>
  );
}
