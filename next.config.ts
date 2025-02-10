import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "https://img.icons8.com",
      "https://via.placeholder.com",
      "via.placeholder.com",
      "https://img.icons8.com",
      "img.icons8.com",
      "img.icons8.com",
      "via.placeholder.com",
      "https://play-lh.googleusercontent.com",
      "play-lh.googleusercontent.com",
    ],
  },
  output: "export", // aded this line to export out folder
};

export default nextConfig;
