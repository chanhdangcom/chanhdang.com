import { SwitchTheme } from "@/components/switch-theme";
import React from "react";
export const Header = () => {
  return (
    <div className="container">
      <div className="flex h-14 items-center justify-between">
        <div className="flex items-center space-x-1">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="[--color-curly-bracket:#ec4899] [--color-square-bracket:#06b6d4] dark:[--color-curly-bracket:#f472b6] dark:[--color-square-bracket:#22d3ee]"
          >
            <path
              d="M10 3H7C6.46957 3 5.96086 3.21071 5.58579 3.58579C5.21071 3.96086 5 4.46957 5 5V10C5 10.5304 4.78929 11.0391 4.41421 11.4142C4.03914 11.7893 3.53043 12 3 12C3.53043 12 4.03914 12.2107 4.41421 12.5858C4.78929 12.9609 5 13.4696 5 14V19C5 20.1 5.9 21 7 21H10"
              stroke="var(--color-curly-bracket)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 3H19V21H15"
              stroke="var(--color-square-bracket)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="font-mono text-2xl font-semibold">ChanhDang</span>
        </div>

        <SwitchTheme />
      </div>
    </div>
  );
};
