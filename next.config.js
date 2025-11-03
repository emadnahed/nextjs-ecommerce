/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;
