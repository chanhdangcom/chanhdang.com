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
