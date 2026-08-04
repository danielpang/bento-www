import { describe, expect, it } from "vitest";
import { makeSiteConfig } from "./site";

describe("makeSiteConfig", () => {
  it("keeps configured public destinations", () => {
    const config = makeSiteConfig({
      NEXT_PUBLIC_SIGNUP_URL: "https://app.bento.dev/sign-up",
      NEXT_PUBLIC_GITHUB_URL: "https://github.com/example/bento",
      NEXT_PUBLIC_SITE_URL: "https://bento.dev/",
    });

    expect(config.signupUrl).toBe("https://app.bento.dev/sign-up");
    expect(config.githubUrl).toBe("https://github.com/example/bento");
    expect(config.siteUrl.toString()).toBe("https://bento.dev/");
  });

  it("disables malformed destinations instead of emitting broken links", () => {
    const config = makeSiteConfig({
      NEXT_PUBLIC_SIGNUP_URL: "not a url",
      NEXT_PUBLIC_GITHUB_URL: "javascript:alert(1)",
    });

    expect(config.signupUrl).toBeNull();
    expect(config.githubUrl).toBeNull();
  });

  it("uses the local origin when the canonical URL is absent", () => {
    expect(makeSiteConfig({}).siteUrl.toString()).toBe(
      "http://localhost:3000/",
    );
  });
});
