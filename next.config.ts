import type { NextConfig } from "next";


import createNextIntlPlugin from 'next-intl/plugin';
 

 
const withNextIntl = createNextIntlPlugin();


const nextConfig: NextConfig = {
  /* config options here */
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
};

export default withNextIntl(nextConfig);

