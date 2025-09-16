declare module "tailwindcss/lib/util/flattenColorPalette" {
  export default function flattenColorPalette(
    colors: Record<string, unknown>
  ): Record<string, string>;
}
