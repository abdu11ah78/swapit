import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "7052",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "7052",
        pathname: "/**",
      },
    ],
    // Bypass Next.js image optimization (avoids SSL cert issues with local dev server)
    unoptimized: true,
  },
};

module.exports = nextConfig;