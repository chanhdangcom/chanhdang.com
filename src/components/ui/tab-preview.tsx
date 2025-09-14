"use client";

import { useState } from "react";

export function TabPreview({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<"preview" | "code">("preview");

  return (
    <div className="rounded-md border border-zinc-700">
      <div className="flex border-b border-zinc-700 bg-zinc-900 text-sm">
        <button
          onClick={() => setTab("preview")}
          className={`px-3 py-1 ${
            tab === "preview" ? "bg-zinc-800 font-semibold" : "text-zinc-400"
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setTab("code")}
          className={`px-3 py-1 ${
            tab === "code" ? "bg-zinc-800 font-semibold" : "text-zinc-400"
          }`}
        >
          Code
        </button>
      </div>

      <div className="p-4">
        {tab === "preview" ? (
          <div className="rounded bg-zinc-800 p-4">{children}</div>
        ) : (
          <pre className="overflow-x-auto text-sm text-zinc-200">
            {children}
          </pre>
        )}
      </div>
    </div>
  );
}
