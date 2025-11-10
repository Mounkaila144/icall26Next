import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Disable TypeScript checks during build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
