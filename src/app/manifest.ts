import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ChanhDang ",
    short_name: "chanhdang",
    description: "A Progressive Web App built with Next.js",
    start_url: "/music",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/img/Logomark.svg",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
