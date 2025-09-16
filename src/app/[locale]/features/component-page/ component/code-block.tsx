"use client";

import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

type CodeBlockProps = {
  code: string;
  language?: string;
};

export default function CodeBlock({ code, language = "tsx" }: CodeBlockProps) {
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
    <div className={`relative overflow-hidden rounded-2xl w-full ${bg} flex justify-between items-start`}>
      <SyntaxHighlighter
        language={language}
        style={style}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="mt-3"
      >
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}