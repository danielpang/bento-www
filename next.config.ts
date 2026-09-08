import type { NextConfig } from "next";
import { hostRedirects } from "./lib/host-redirects";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return hostRedirects();
  },
};

export default nextConfig;
