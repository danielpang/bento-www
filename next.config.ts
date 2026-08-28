import type { NextConfig } from "next";

/**
 * Two years, every subdomain, and opted in to the preload list.
 *
 * This site used to live on usebento.dev, and .dev is on the HSTS
 * preload list as a whole TLD, so browsers refused plaintext to it
 * whatever this app sent. usebento.ai carries no such promise. Vercel
 * serves HTTPS and redirects to it, but a redirect is a round trip an
 * attacker on the path gets to answer first, and this header is what
 * removes that trip from every later visit.
 *
 * includeSubDomains is why the header belongs here rather than only on
 * the console: the apex is what covers app.usebento.ai. Both it and
 * preload are close to irreversible, so every host under the domain has
 * to speak HTTPS before the domain is submitted to hstspreload.org.
 *
 * Unconditional, including `next dev` over http, where browsers ignore
 * it: HSTS received over plaintext does not apply, which is the rule
 * that makes that safe. Bento's own server gates on the forwarded
 * protocol instead, because it also runs on laptops behind proxies its
 * operators own, where localhost is a real thing to protect.
 */
export const HSTS_VALUE = "max-age=63072000; includeSubDomains; preload";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Strict-Transport-Security", value: HSTS_VALUE }],
      },
    ];
  },
};

export default nextConfig;
