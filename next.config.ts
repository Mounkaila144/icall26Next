import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Disable Turbopack in development (fixes infinite re-render loop with Context Providers)
  // Remove this once the Turbopack bug is fixed in future Next.js versions
  turbo: undefined as any,
};

export default nextConfig;
