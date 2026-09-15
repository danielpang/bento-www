import { describe, expect, it } from "vitest";
import { isSignupDestination } from "./marketing-analytics";

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
});
