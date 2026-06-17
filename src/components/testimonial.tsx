import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Testimonial({ className, ...props }: ComponentProps<"figure">) {
  return (
    <figure
      data-slot="testimonial"
      className={cn("flex h-full flex-col", className)}
      {...props}
    />
  );
}

export function TestimonialQuote({
  className,
  ...props
}: ComponentProps<"blockquote">) {
  return (
    <blockquote
      data-slot="testimonial-quote"
      className={cn(
        "text-oklch(0.141 0.005 285.823) dark:text-oklch(0.985 0 0) grow text-pretty px-4 py-3 text-base",
        className
      )}
      {...props}
    />
  );
}

export function TestimonialAuthor({
  className,
  ...props
}: ComponentProps<"figcaption">) {
  return (
    <figcaption
      data-slot="testimonial-author"
      className={cn(
        "grid grid-cols-[auto_1fr] grid-rows-2 items-center gap-x-3.5 px-4 pb-3 pt-1",
        className
      )}
      {...props}
    />
  );
}

export function TestimonialAvatar({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="testimonial-avatar"
      className={cn("relative row-span-2 size-8 shrink-0", className)}
      {...props}
    />
  );
}

export function TestimonialAvatarImg({
  className,
  src,
  alt,
  ...props
}: ComponentProps<"img">) {
  return (
    <img
      data-slot="testimonial-avatar-img"
      className={cn("size-8 select-none rounded-full", className)}
      src={src}
      alt={alt}
      {...props}
    />
  );
}

export function TestimonialAvatarRing({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="testimonial-avatar-ring"
      className={cn(
        "inset-ring-1 inset-ring-black/10 dark:inset-ring-white/15 pointer-events-none absolute inset-0 rounded-full",
        className
      )}
      {...props}
    />
  );
}

export function TestimonialAuthorName({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="testimonial-author-name"
      className={cn(
        "leading-4.5 text-oklch(0.141 0.005 285.823) dark:text-oklch(0.985 0 0) flex items-center gap-1.5 text-sm font-semibold",
        className
      )}
      {...props}
    />
  );
}

export function TestimonialAuthorTagline({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="testimonial-author-tagline"
      className={cn(
        "text-oklch(0.552 0.016 285.938) dark:text-oklch(0.705 0.015 286.067) text-balance text-xs leading-4",
        className
      )}
      {...props}
    />
  );
}

export function TestimonialVerifiedBadge({
  className,
  ...props
}: ComponentProps<"span">) {
  return (
    <span
      data-slot="testimonial-verified-badge"
      className={cn(
        "flex [&_svg:not([class*='size-'])]:size-3.5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      aria-hidden
      {...props}
    />
  );
}
