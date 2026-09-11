import type { NextConfig } from "next";
import { hostRedirects } from "./lib/host-redirects";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      ...hostRedirects(),
      {
        source: "/install.sh",
        destination:
          "https://github.com/danielpang/bento/releases/latest/download/install.sh",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
