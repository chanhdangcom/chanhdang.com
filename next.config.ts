import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["cdn.chanhdang.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
    ],
  },
  webpack(config) {
    // Cho phép import file .tsx kèm ?raw giống Vite
    config.module.rules.push({
    resourceQuery: /raw/, // chỉ khi import có ?raw
    type: "asset/source", // cách mới thay raw-loader
});
    return config;
  },
};

export default withNextIntl(nextConfig);