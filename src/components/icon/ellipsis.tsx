"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type EllipsisProps = ComponentProps<"svg">;

export function Ellipsis({ className, ...props }: EllipsisProps) {
  return (
    <svg
      viewBox="0 0 18.584 3.7207"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M16.3672 3.70117C17.3926 3.70117 18.2227 2.88086 18.2227 1.85547C18.2227 0.830078 17.3926 0 16.3672 0C15.3418 0 14.5117 0.830078 14.5117 1.85547C14.5117 2.88086 15.3418 3.70117 16.3672 3.70117Z"
        fill="currentColor"
        fillOpacity="0.85"
      />
      <path
        d="M9.11133 3.70117C10.1367 3.70117 10.957 2.88086 10.957 1.85547C10.957 0.830078 10.1367 0 9.11133 0C8.08594 0 7.25586 0.830078 7.25586 1.85547C7.25586 2.88086 8.08594 3.70117 9.11133 3.70117Z"
        fill="currentColor"
        fillOpacity="0.85"
      />
      <path
        d="M1.85547 3.70117C2.88086 3.70117 3.70117 2.88086 3.70117 1.85547C3.70117 0.830078 2.88086 0 1.85547 0C0.830078 0 0 0.830078 0 1.85547C0 2.88086 0.830078 3.70117 1.85547 3.70117Z"
        fill="currentColor"
        fillOpacity="0.85"
      />
    </svg>
  );
}
