"use client";

import React from "react";

import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

import { Slot } from "@radix-ui/react-slot";

const button = cva("flex items-center justify-center", {
  variants: {
    variant: {
      primary: "bg-zinc-950 text-zinc-50",
      secondary: "bg-zinc-100 text-zinc-950",
      success: "bg-green-500 text-white",
      outline: "bg-white border",
    },
    size: {
      default: "h-10 px-4",
      sm: "h-8 px-4",
      lg: "h-12 px-6",
      icon: "size-10",
    },
    rounded: {
      default: "rounded-md",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});

// type IButtonProps = VariantProps<typeof button>;

// type IProps = {
//   className?: string;
//   onClick?: () => void;
//   children: React.ReactNode;
// } & IButtonProps;

// export function Button({
//   className,
//   children,
//   onClick,
//   ...buttonProps
// }: IProps) {
//   return (
//     <button className={cn(button(buttonProps), className)} onClick={onClick}>
//       {children}
//     </button>
//   );
// }

type IProps = React.ComponentProps<"button"> &
  VariantProps<typeof button> & {
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  rounded,
  asChild = false,
  ...buttonProps
}: IProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={cn(button({ variant, size, rounded }), className)}
      {...buttonProps}
    />
  );
}
