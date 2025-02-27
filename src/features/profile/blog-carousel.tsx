"use client";

import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carouse";
import { BlogCarouselItem } from "../blog/blog-carousel-item";
import { IPost } from "../blog/types";

export function BlogCarousel({ posts }: { posts: IPost[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div>
      <Carousel setApi={setApi} className="w-full max-w-4xl">
        <CarouselContent className="p-2">
          {posts.map((post, key) => (
            <BlogCarouselItem key={key} post={post} />
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="mx-auto flex w-20 justify-center gap-1 rounded-xl border px-2 py-0.5 font-mono shadow-sm dark:border-zinc-800">
        <div className="font-semibold">{current}</div>
        <div className="font-thin">of</div>
        <div className="font-semibold">{count}</div>
      </div>
    </div>
  );
}
