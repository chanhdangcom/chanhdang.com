"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type BackwardFillProps = ComponentProps<"svg">;

export function BackwardFill({ className, ...props }: BackwardFillProps) {
  return (
    <svg
      viewBox="0 0 28.9746 14.9316"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M26.5332 13.5645L26.5332 1.34766C26.5332 0.429688 25.9961 0 25.3711 0C25.0879 0 24.8047 0.078125 24.5215 0.244141L14.2578 6.2207C13.5254 6.65039 13.2422 6.97266 13.2422 7.46094C13.2422 7.94922 13.5254 8.27148 14.2578 8.70117L24.5215 14.6777C24.8047 14.834 25.0879 14.9219 25.3711 14.9219C25.9961 14.9219 26.5332 14.4824 26.5332 13.5645ZM13.291 13.5645L13.291 1.34766C13.291 0.429688 12.7637 0 12.1289 0C11.8555 0 11.5625 0.078125 11.2793 0.244141L1.02539 6.2207C0.283203 6.65039 0 6.97266 0 7.46094C0 7.94922 0.283203 8.27148 1.02539 8.70117L11.2793 14.6777C11.5625 14.834 11.8555 14.9219 12.1289 14.9219C12.7637 14.9219 13.291 14.4824 13.291 13.5645Z"
        fill="currentColor"
        fillOpacity="0.85"
      />
    </svg>
  );
}
