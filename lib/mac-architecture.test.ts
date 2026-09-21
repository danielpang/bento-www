import { afterEach, describe, expect, it, vi } from "vitest";
import { browserMacArchitecture, suggestMacArchitecture } from "./mac-architecture";

afterEach(() => vi.unstubAllGlobals());

describe("optional Mac architecture suggestion", () => {
  it.each([
    ["macOS", "arm", "64", "arm64"],
    ["macOS", "x86", "64", "x64"],
    ["macOS", "", "", null],
    ["macOS", "arm", "32", null],
    ["macOS", "unknown", "64", null],
    ["Windows", "arm", "64", null],
    ["Linux", "x86", "64", null],
  ])("handles %s / %s / %s as %s", async (platform, architecture, bitness, expected) => {
    expect(await suggestMacArchitecture({
      platform,
      getHighEntropyValues: async () => ({ architecture, bitness }),
    })).toBe(expected);
  });

  it("keeps Safari and withheld hints unknown, even with Intel in legacy Mac identifiers", async () => {
    vi.stubGlobal("navigator", { platform: "MacIntel", userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Version/18.0 Safari/605.1.15" });
    expect(await browserMacArchitecture()).toBeNull();
    expect(await suggestMacArchitecture({ platform: "macOS" })).toBeNull();
    expect(await suggestMacArchitecture({ platform: "macOS", getHighEntropyValues: async () => { throw Error("withheld"); } })).toBeNull();
  });

  it("does not request architecture hints on a phone or another OS", async () => {
    const getHighEntropyValues = vi.fn();
    expect(await suggestMacArchitecture({ platform: "macOS", mobile: true, getHighEntropyValues })).toBeNull();
    expect(await suggestMacArchitecture({ platform: "Android", getHighEntropyValues })).toBeNull();
    expect(getHighEntropyValues).not.toHaveBeenCalled();
  });
});
