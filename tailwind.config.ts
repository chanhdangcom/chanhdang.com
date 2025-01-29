import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        body: "var(--font-body)",
        handwritten: "var(--font-handwritten)",
        mono: "var(--font-mono)"
      },
      aspectRatio: {
        "3/1": "3 / 1"
      }
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
      }
    }
  },
  plugins: [],
} satisfies Config;
