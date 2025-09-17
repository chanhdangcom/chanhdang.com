"use client";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useState } from "react";

/* eslint-disable @next/next/no-img-element */
type IProp = {
  scrImg: string;
  title: string;
  accountName: string;
  link?: string;
};

export function SocialItem({ scrImg, title, accountName, link }: IProp) {
  const [isHover, setIsHover] = useState(false);

  return (
    <Link
      href={link || ""}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      target="_blank"
    >
      <CardSpotlight className="border-y">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <img src={scrImg} alt="icon" className="size-16" />

            <div>
              <div className="font-apple font-semibold">{title}</div>
              <div className="text-sms font-mono text-zinc-500">
                {accountName}
              </div>
            </div>
          </div>

          {isHover ? (
            <ArrowUpRight size={20} weight="bold" />
          ) : (
            <ArrowRight size={20} weight="bold" />
          )}
        </div>
      </CardSpotlight>
    </Link>
  );
}
