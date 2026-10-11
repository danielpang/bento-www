import { describe, expect, it } from "vitest";
import {
  distinctIdFromPersistence,
  isSignupDestination,
  MAC_DOWNLOAD_CLICKED,
  macDownloadArchitecture,
  macDownloadBeacon,
  macDownloadLocation,
  macDownloadProperties,
  posthogDistinctId,
  posthogHasOptedOut,
  posthogPersistenceName,
} from "./marketing-analytics";

describe("marketing analytics", () => {
  it("counts only the configured signup destination, including campaign parameters", () => {
    expect(
      isSignupDestination(
        "https://app.usebento.ai/?plan=pro",
        "https://app.usebento.ai/",
      ),
    ).toBe(true);
    expect(
      isSignupDestination(
        "https://app.usebento.ai.fake.example/",
        "https://app.usebento.ai/",
      ),
    ).toBe(false);
    expect(
      isSignupDestination(
        "https://app.usebento.ai/docs",
        "https://app.usebento.ai/",
      ),
    ).toBe(false);
    expect(isSignupDestination("mailto:daniel@usebento.ai", null)).toBe(false);
  });

  it("recognizes only this site's Mac download routes", () => {
    const site = "https://usebento.ai";
    expect(macDownloadArchitecture("/download/mac/arm64", site)).toBe("arm64");
    expect(macDownloadArchitecture("https://usebento.ai/download/mac/x64", site)).toBe("x64");
    expect(macDownloadArchitecture("/download/mac/universal", site)).toBeNull();
    expect(macDownloadArchitecture("/download", site)).toBeNull();
    expect(macDownloadArchitecture("https://evil.example/download/mac/arm64", site)).toBeNull();
  });

  it("builds the download event properties the dashboard already queries", () => {
    expect(macDownloadProperties("/download/mac/arm64", "https://usebento.ai", "download_page")).toEqual({
      service: "bento-www",
      chip: "arm64",
      location: "download_page",
      href: "https://usebento.ai/download/mac/arm64",
    });
    expect(macDownloadProperties("https://usebento.ai/download/mac/x64?ref=1", "https://usebento.ai", "download_page")).toEqual({
      service: "bento-www",
      chip: "x64",
      location: "download_page",
      href: "https://usebento.ai/download/mac/x64?ref=1",
    });
    expect(macDownloadProperties("https://github.com/danielpang/bento/releases/download/v0.1.8/Bento.dmg", "https://usebento.ai", "download_page")).toBeNull();
  });

  it("prefers a declared download location, then the section, then the download page", () => {
    const elsewhere = { nav: false, hero: false, footer: false };
    expect(macDownloadLocation(" download_page ", "/", elsewhere)).toBe("download_page");
    expect(macDownloadLocation(null, "/", { ...elsewhere, nav: true })).toBe("nav");
    expect(macDownloadLocation(null, "/", { ...elsewhere, hero: true })).toBe("homepage_hero");
    expect(macDownloadLocation(null, "/", { ...elsewhere, footer: true })).toBe("footer");
    expect(macDownloadLocation("  ", "/download", elsewhere)).toBe("download_page");
    expect(macDownloadLocation(null, "/pricing", elsewhere)).toBe("unknown");
  });

  it("reads the distinct id posthog-js already stored for this token", () => {
    expect(posthogPersistenceName("a+b/c=")).toBe("ph_aPLbSLcEQ_posthog");
    const encoded = encodeURIComponent(JSON.stringify({ distinct_id: "visitor-1", $device_id: "device-1" }));
    expect(posthogDistinctId(`other=1; ph_phc_test_posthog=${encoded}`, null, "phc_test")).toBe("visitor-1");
    expect(posthogDistinctId("", JSON.stringify({ distinct_id: "from-storage" }), "phc_test")).toBe("from-storage");
    expect(posthogDistinctId(`ph_phc_test_posthog=${encoded}`, JSON.stringify({ distinct_id: "from-storage" }), "phc_test")).toBe("visitor-1");
    expect(distinctIdFromPersistence("{")).toBeNull();
    expect(posthogDistinctId("", null, "phc_test")).toBeNull();
  });

  it("treats the PostHog opt-out cookie as a refusal", () => {
    expect(posthogHasOptedOut("__ph_opt_in_out_phc_test=0", "phc_test")).toBe(true);
    expect(posthogHasOptedOut("__ph_opt_in_out_phc_test=false", "phc_test")).toBe(true);
    expect(posthogHasOptedOut(`__ph_opt_in_out_phc_test=${encodeURIComponent(JSON.stringify(0))}`, "phc_test")).toBe(true);
    expect(posthogHasOptedOut("__ph_opt_in_out_phc_test=1", "phc_test")).toBe(false);
    expect(posthogHasOptedOut("", "phc_test")).toBe(false);
  });

  it("shapes the pre-init download beacon as a capture request", () => {
    const payload = macDownloadBeacon({
      token: "phc_test",
      distinctId: "visitor-1",
      host: "https://us.i.posthog.com",
      timestamp: "2026-10-11T00:00:00.000Z",
      properties: {
        service: "bento-www",
        chip: "arm64",
        location: "download_page",
        href: "https://usebento.ai/download/mac/arm64",
      },
    });
    expect(payload.url).toBe("https://us.i.posthog.com/i/v0/e/");
    expect(JSON.parse(payload.body)).toEqual({
      api_key: "phc_test",
      event: MAC_DOWNLOAD_CLICKED,
      distinct_id: "visitor-1",
      timestamp: "2026-10-11T00:00:00.000Z",
      properties: {
        service: "bento-www",
        chip: "arm64",
        location: "download_page",
        href: "https://usebento.ai/download/mac/arm64",
      },
    });
  });
});
