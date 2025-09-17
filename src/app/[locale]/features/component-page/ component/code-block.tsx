"use client";

import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

type CodeBlockProps = {
  code: string;
  fileName?: string;
  language?: string;
};

export default function CodeBlock({
  code,
  language = "tsx",
  fileName,
}: CodeBlockProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const bg = theme === "light" ? "bg-[#FAFAFA]" : "bg-[#1D1F21]";
  const style = theme === "light" ? oneLight : atomDark;

  return (
    <div className="mt-3 rounded-2xl border bg-[#F5F2F0] dark:border-zinc-700 dark:bg-[#1e1e1e]">
      <>
        <div className={`relative w-full overflow-hidden rounded-2xl ${bg} `}>
          <div className="mx-4 flex items-center justify-between border-b py-2 dark:border-zinc-700">
            <div className="font-mono text-sm text-zinc-500">{fileName}</div>

            <div
              onClick={handleCopy}
              className="flex items-center gap-1 text-sm"
            >
              {copied ? (
                <Check className="size-3" />
              ) : (
                <Copy className="size-3" />
              )}
              {copied ? "Copied" : "Copy"}
            </div>
          </div>

          <SyntaxHighlighter language={language} style={style} showLineNumbers>
            {code}
          </SyntaxHighlighter>
        </div>
      </>
    </div>
  );
}
