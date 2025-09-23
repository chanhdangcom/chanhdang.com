declare module "react-syntax-highlighter" {
  import * as React from "react";

  export interface SyntaxHighlighterProps {
    language?: string;
    style?: Record<string, React.CSSProperties> | object;
    showLineNumbers?: boolean;
    wrapLines?: boolean;
    children: string;
  }

  export const Prism: React.FC<SyntaxHighlighterProps>;
}
declare module "react-syntax-highlighter/*";

// src/global.d.ts
interface Document {
  startViewTransition?: (callback: () => void) => void;
}

interface ViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition: () => void;
}