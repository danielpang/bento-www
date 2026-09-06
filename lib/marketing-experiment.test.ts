import { afterEach, describe, expect, it, vi } from "vitest";
import { evaluateMarketingVariant, MARKETING_FLAG, parseAssignment, readPostHogIdentity, isSignupDestination } from "./marketing-experiment";

afterEach(() => vi.unstubAllGlobals());
const config = { token: "phc_test", host: "https://us.i.posthog.com", distinctId: "visitor-123" };
describe("marketing experiment evaluation", () => {
  it.each(["control", "redesign"])("accepts the %s variant returned by PostHog", async variant => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ flags: { [MARKETING_FLAG]: { enabled: true, variant } } }) });
    vi.stubGlobal("fetch", fetcher);
    expect(await evaluateMarketingVariant(config)).toBe(variant);
    expect(JSON.parse(fetcher.mock.calls[0]![1].body).distinct_id).toBe(config.distinctId);
    expect(fetcher.mock.calls[0]![1].cache).toBe("no-store");
  });
  it.each([
    {}, { flags: { [MARKETING_FLAG]: { enabled: false, variant: "redesign" } } },
    { flags: { [MARKETING_FLAG]: { enabled: true, variant: "holdout-1" } } },
    { errorsWhileComputingFlags: true, flags: { [MARKETING_FLAG]: { enabled: true, variant: "control" } } },
    { quotaLimited: ["feature_flags"] },
  ])("does not enroll unavailable, excluded, or invalid evaluations", async result => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => result }));
    expect(await evaluateMarketingVariant(config)).toBeNull();
  });
  it("fails open when PostHog is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("timeout")));
    expect(await evaluateMarketingVariant(config)).toBeNull();
  });
  it("rejects malformed cookies and recognizes existing accounts", () => {
    expect(parseAssignment("bad-json")).toBeNull();
    expect(parseAssignment('{"variant":"other","distinctId":"abc"}')).toBeNull();
    expect(readPostHogIdentity(encodeURIComponent('{"distinct_id":"user-1","$user_state":"identified"}'))).toEqual({ distinctId: "user-1", identified: true });
    expect(readPostHogIdentity("bad-json")).toBeNull();
  });
  it("counts only the configured signup destination, including campaign parameters", () => {
    expect(isSignupDestination("https://app.usebento.ai/?plan=pro", "https://app.usebento.ai/")).toBe(true);
    expect(isSignupDestination("https://app.usebento.ai.fake.example/", "https://app.usebento.ai/")).toBe(false);
    expect(isSignupDestination("https://app.usebento.ai/docs", "https://app.usebento.ai/")).toBe(false);
    expect(isSignupDestination("mailto:daniel@usebento.ai", null)).toBe(false);
  });
});
