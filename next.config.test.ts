import { describe, expect, it } from "vitest";
import nextConfig, { HSTS_VALUE } from "./next.config";

describe("security headers", () => {
  it("sends HSTS, and sends it on every path", async () => {
    const rules = await nextConfig.headers?.();

    expect(rules).toEqual([
      {
        source: "/:path*",
        headers: [{ key: "Strict-Transport-Security", value: HSTS_VALUE }],
      },
    ]);
  });

  /**
   * The preload list refuses anything under a year, and refuses a
   * header missing either directive, so a well-meaning trim here would
   * fail at submission rather than in review.
   */
  it("clears what hstspreload.org checks for", () => {
    const maxAge = Number(/max-age=(\d+)/.exec(HSTS_VALUE)?.[1]);

    expect(maxAge).toBeGreaterThanOrEqual(31536000);
    expect(HSTS_VALUE).toContain("includeSubDomains");
    expect(HSTS_VALUE).toContain("preload");
  });
});
