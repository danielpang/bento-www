import type { NextConfig } from "next";
import { hostRedirects } from "./lib/host-redirects";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    // /install.sh is a route handler (app/install.sh/route.ts), not a redirect
    // here, so each request can be recorded in PostHog.
    return hostRedirects();
  },
};

export default nextConfig;
