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
  // Exclude MongoDB from client-side bundling
  serverComponentsExternalPackages: ["mongodb"],
  webpack(config, { isServer }) {
    // Cho phép import file .tsx kèm ?raw giống Vite
    config.module.rules.push({
    resourceQuery: /raw/, // chỉ khi import có ?raw
    type: "asset/source", // cách mới thay raw-loader
});
    
    // Exclude Node.js built-ins and MongoDB from client-side bundling
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
      
      // Externalize MongoDB and related packages for client bundle
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push({
          mongodb: "commonjs mongodb",
          "mongodb-client-encryption": "commonjs mongodb-client-encryption",
        });
      } else if (typeof config.externals === "function") {
        const originalExternals = config.externals;
        config.externals = [
          originalExternals,
          {
            mongodb: "commonjs mongodb",
            "mongodb-client-encryption": "commonjs mongodb-client-encryption",
          },
        ];
      } else {
        config.externals = {
          ...config.externals,
          mongodb: "commonjs mongodb",
          "mongodb-client-encryption": "commonjs mongodb-client-encryption",
        };
      }
    }
    
    return config;
  },
};

export default withNextIntl(nextConfig);