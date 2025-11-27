/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "www.zeyrey.net",
      },
      {
        protocol: "https",
        hostname: "paymadi-ecommerce.blr1.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "paymadi-ecommerce.blr1.cdn.digitaloceanspaces.com",
      },
    ],
  },
  webpack: (config) => {
    const path = require("path");
    // Ensure the '@' alias resolves to the project root at build time
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname),
    };
    return config;
  },
};

module.exports = nextConfig;
