"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Count hiện tại:", count);
  }, []);

  return (
    <div className="m-16 flex items-center justify-start gap-4">
      <div
        className="rounded-lg border p-2 shadow-sm"
        onClick={() => setCount(count + 1)}
      >
        Click : {count}
      </div>
    </div>
  );
}
