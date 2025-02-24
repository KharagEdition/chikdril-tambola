import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Move this inside images
    domains: [
      "img.icons8.com",
      "via.placeholder.com",
      "play-lh.googleusercontent.com",
    ],
  },
  output: "export", // This allows static export
};

export default nextConfig;
