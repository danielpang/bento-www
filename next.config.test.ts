import { describe, expect, it } from "vitest";
import nextConfig from "./next.config";

describe("retired homepage variants", () => {
  it.each(["/control", "/preview/control", "/preview/redesign"])(
    "redirects %s to the homepage",
    async (source) => {
      const redirects = await nextConfig.redirects!();
      expect(redirects).toContainEqual({
        source,
        destination: "/",
        permanent: true,
      });
    },
  );
});
