import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root — there are sibling lockfiles in the monorepo parent.
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      // «конвейер» выведен из лексикона (минус-фраза) — статья переименована
      {
        source: "/blog/kak-ii-konvejer-sobiraet-sajt",
        destination: "/blog/kak-ii-dvizhok-sobiraet-sajt",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
