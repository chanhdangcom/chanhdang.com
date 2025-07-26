"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LiquidButtonDemo() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <h2 className="text-2xl font-bold">Liquid Glass Button Demo</h2>

      <div className="flex flex-col gap-4">
        <Button
          variant="liquid"
          size="lg"
          loading={isLoading}
          loadingText="Đang thêm..."
          onClick={handleClick}
        >
          Thêm vào playlist
        </Button>

        <Button
          variant="liquid"
          size="default"
          loading={isLoading}
          loadingText="Loading..."
          onClick={handleClick}
        >
          Add to Library
        </Button>

        <Button
          variant="liquid"
          size="sm"
          loading={isLoading}
          onClick={handleClick}
        >
          Follow
        </Button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Click any button to see the loading effect with liquid glass animation
        </p>
      </div>
    </div>
  );
}
