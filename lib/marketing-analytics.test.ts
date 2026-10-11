import { describe, expect, it } from "vitest";
import {
  isSignupDestination,
  macDownloadArchLabel,
  macDownloadArchitecture,
  macDownloadLocation,
  macDownloadVersion,
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

  it("names the Mac chip and keeps only a real release version", () => {
    expect(macDownloadArchLabel("arm64")).toBe("apple silicon");
    expect(macDownloadArchLabel("x64")).toBe("intel");
    expect(macDownloadVersion("0.2.0")).toBe("0.2.0");
    expect(macDownloadVersion("v0.2.0")).toBeUndefined();
    expect(macDownloadVersion("")).toBeUndefined();
    expect(macDownloadVersion(null)).toBeUndefined();
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
});
