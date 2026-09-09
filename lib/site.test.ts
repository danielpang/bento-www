import { describe, expect, it } from "vitest";
import { absoluteUrl, makeSiteConfig, salesMailto, slackInstallUrl } from "./site";

describe("absoluteUrl", () => {
  const base = new URL("https://usebento.ai/");

  it("writes the homepage as the bare origin, matching the canonical link", () => {
    expect(absoluteUrl("/", base)).toBe("https://usebento.ai");
    expect(absoluteUrl("/?utm_source=x", base)).toBe("https://usebento.ai?utm_source=x");
  });

  it("keeps other paths as written", () => {
    expect(absoluteUrl("/pricing", base)).toBe("https://usebento.ai/pricing");
    expect(absoluteUrl("/docs/concepts", base)).toBe("https://usebento.ai/docs/concepts");
  });
});

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

describe("salesMailto", () => {
  it("opens the sales inbox on usebento.ai", () => {
    expect(salesMailto).toBe("mailto:daniel@usebento.ai");
  });
});

describe("slackInstallUrl", () => {
  it("points at the public one-click Slack OAuth install", () => {
    const url = new URL(slackInstallUrl);

    expect(url.origin).toBe("https://slack.com");
    expect(url.pathname).toBe("/oauth/v2/authorize");
    expect(url.searchParams.get("client_id")).toBe(
      "10676673193079.11868275221140",
    );
    expect(url.searchParams.get("scope")).toBe(
      "app_mentions:read,chat:write,users:read,users:read.email",
    );
  });
});
