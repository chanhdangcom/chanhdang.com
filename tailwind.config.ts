/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography"; 
import { default as flattenColorPalette } from "tailwindcss/lib/util/flattenColorPalette";
import svgToDataUri from "mini-svg-data-uri";
import plugin from "tailwindcss/plugin";

type PluginAPI = Parameters<Parameters<typeof plugin>[0]>[0];

function addVariablesForColors({ addBase, theme }: PluginAPI): void {
  const allColors = flattenColorPalette(theme("colors")) as Record<string, string>;
  const newVars: Record<string, string> = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

const backgroundUtilities = plugin(function ({ matchUtilities, theme }: PluginAPI) {
  matchUtilities(
    {
      "bg-grid": (value: string) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
        )}")`,
      }),
      "bg-grid-small": (value: string) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
        )}")`,
      }),
      "bg-dot": (value: string) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
        )}")`,
      }),
    },
    { values: flattenColorPalette(theme("backgroundColor")) as Record<string, string>, type: "color" }
  );
});

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
  	extend: {
  colors: {
    background: 'var(--background)',
    foreground: 'var(--foreground)',
  },
  fontFamily: {
    body: 'var(--font-body)',
    handwritten: 'var(--font-handwritten)',
    mono: 'var(--font-mono)',
    sf: [/*...*/],
     apple: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
      ],
  },
  aspectRatio: {
    '3/1': '3 / 1',
  },
  borderRadius: {
    lg: 'var(--radius)',
    md: 'calc(var(--radius) - 2px)',
    sm: 'calc(var(--radius) - 4px)',
  },
  animation: {
    'bg-gradient': 'bg-gradient 5s ease infinite',
  },
  keyframes: {
    'bg-gradient': {
      '0%, 100%': { backgroundPosition: '0% 50%' },
      '50%': { backgroundPosition: '100% 50%' },
    },
  },
  backgroundSize: {
    '200': '200% 200%',
  },

  

  container: {
  		center: true,
  		padding: {
  			DEFAULT: '1rem'
  		}
  	}
  
},
  },
  plugins: [
    addVariablesForColors,
    backgroundUtilities,
    require("tailwindcss-animate"),
    typography, // ✅ Thêm vào đây
    require('tailwind-scrollbar-hide')
  ],
};

export default config;