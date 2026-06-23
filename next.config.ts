import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root — there are sibling lockfiles in the monorepo parent.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
