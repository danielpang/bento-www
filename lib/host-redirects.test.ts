import { describe, expect, it } from "vitest";
import { CANONICAL_HOST, hostRedirects, REDIRECTED_HOSTS } from "./host-redirects";

describe("host redirects", () => {
  const redirects = hostRedirects();

  it("sends every alias host to the canonical origin with a 301", () => {
    expect(redirects).toHaveLength(REDIRECTED_HOSTS.length);
    for (const redirect of redirects) {
      expect(redirect.statusCode).toBe(301);
      expect(redirect.source).toBe("/:path*");
      expect(redirect.destination).toBe(`https://${CANONICAL_HOST}/:path*`);
      expect(redirect.has).toHaveLength(1);
      expect(redirect.has[0].type).toBe("host");
    }
  });

  it("covers the www subdomain and both .dev hosts", () => {
    const hosts = redirects.map((redirect) =>
      new RegExp(`^${redirect.has[0].value}$`),
    );
    for (const alias of ["www.usebento.ai", "usebento.dev", "www.usebento.dev"]) {
      expect(hosts.some((pattern) => pattern.test(alias))).toBe(true);
    }
    // A literal dot: the pattern must not match a lookalike host.
    expect(hosts.some((pattern) => pattern.test("wwwXusebentoXai"))).toBe(false);
  });

  it("never redirects the canonical host to itself", () => {
    const patterns = redirects.map((redirect) => new RegExp(`^${redirect.has[0].value}$`));
    expect(patterns.some((pattern) => pattern.test(CANONICAL_HOST))).toBe(false);
    expect(hostRedirects("usebento.dev", ["usebento.dev"])).toEqual([]);
  });
});
