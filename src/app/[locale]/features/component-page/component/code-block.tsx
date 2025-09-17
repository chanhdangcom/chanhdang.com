"use client";

import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState, useEffect } from "react";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

// Prettier
import prettier from "prettier/standalone";
import parserTypescript from "prettier/plugins/typescript";

type CodeBlockProps = {
  code: string;
  fileName?: string;
  language?: string;
  maxLines?: number; // thêm props để config số dòng
};

export default function CodeBlock({
  code,
  language = "tsx",
  fileName,
  maxLines = 10,
}: CodeBlockProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [formattedCode, setFormattedCode] = useState(code);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function formatCode() {
      try {
        const result = await prettier.format(code, {
          parser: "typescript", // hoặc "babel" nếu JS
          plugins: [parserTypescript],
          semi: true,
          singleQuote: true,
        });
        setFormattedCode(result.trim());
      } catch (err) {
        console.error("Failed to format code:", err);
        setFormattedCode(code);
      }
    }
    formatCode();
  }, [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const bg = theme === "light" ? "bg-[#FAFAFA]" : "bg-[#1D1F21]";
  const style = theme === "light" ? oneLight : atomDark;

  // Đếm số dòng code
  const totalLines = formattedCode.split("\n").length;
  const shouldCollapse = totalLines > maxLines;

  return (
    <div className="mt-3 rounded-lg border bg-[#F5F2F0] dark:border-zinc-700 dark:bg-[#1e1e1e]">
      <div className={`relative w-full overflow-hidden rounded-lg ${bg}`}>
        <div className="flex items-center justify-between border-b px-4 py-2 shadow-sm dark:border-zinc-700">
          <div className="font-mono text-sm text-zinc-500">{fileName}</div>

          <div
            onClick={handleCopy}
            className="flex cursor-pointer items-center gap-1 text-sm"
          >
            {copied ? (
              <Check className="size-3" />
            ) : (
              <Copy className="size-3" />
            )}
            {copied ? "Copied" : "Copy"}
          </div>
        </div>

        {/* Code */}
        <div
          className={
            shouldCollapse && !expanded
              ? "relative max-h-[300px] overflow-hidden"
              : ""
          }
        >
          <SyntaxHighlighter language={language} style={style} showLineNumbers>
            {formattedCode}
          </SyntaxHighlighter>

          {/* Fade effect khi bị cắt */}
          {shouldCollapse && !expanded && (
            <div className="absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-zinc-300 to-transparent dark:from-zinc-900" />
          )}
        </div>

        {/* Toggle button */}
        {shouldCollapse && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-center justify-center gap-1 border-t py-2 text-sm text-blue-500 hover:underline dark:border-zinc-700"
          >
            {expanded ? (
              <>
                <ChevronUp className="size-4" /> Show less
              </>
            ) : (
              <>
                <ChevronDown className="size-4" /> Show more
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
