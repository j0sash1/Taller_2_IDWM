import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: process.env.DOMAIN || "localhost",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    domains: [
      "res.cloudinary.com",
      "images.unsplash.com",
      "cdn.pixabay.com",
      "cdn.shopify.com",
    ]
  }
};

export default nextConfig;
