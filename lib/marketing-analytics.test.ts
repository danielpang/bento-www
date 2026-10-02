import { describe, expect, it } from "vitest";
import { isSignupDestination, macDownloadArchitecture } from "./marketing-analytics";

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
});
