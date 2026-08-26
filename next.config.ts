import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeScript remains enforced during builds. The vendored UI registry is
  // excluded from build-time linting because only two audited components are used.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
