import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";
import { MARKETING_ASSIGNMENT_COOKIE, MARKETING_FLAG } from "./lib/marketing-experiment";

beforeEach(() => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("NEXT_PUBLIC_MARKETING_EXPERIMENT_ENABLED", "true");
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test");
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
function request(cookie = "", path = "/") { return new NextRequest(`https://usebento.ai${path}`, { headers: { cookie, "user-agent": "Mozilla/5.0" } }); }
function flag(variant: string) { vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ flags: { [MARKETING_FLAG]: { enabled: true, variant } } }) })); }

describe("server-rendered homepage experiment", () => {
  it("rewrites control before rendering and preserves campaign parameters", async () => {
    flag("control");
    const response = await proxy(request("bento_marketing_id=visitor-123", "/?utm_source=github"));
    expect(response.headers.get("x-middleware-rewrite")).toBe("https://usebento.ai/control?utm_source=github");
    expect(JSON.parse(response.cookies.get(MARKETING_ASSIGNMENT_COOKIE)!.value)).toEqual({ variant: "control", distinctId: "visitor-123" });
    expect(response.headers.get("cache-control")).toContain("no-store");
  });
  it("serves redesign with the same identity used by the app's PostHog cookie", async () => {
    flag("redesign");
    const identity = encodeURIComponent(JSON.stringify({ distinct_id: "shared-anonymous", $user_state: "anonymous" }));
    const response = await proxy(request(`ph_phc_test_posthog=${identity}`));
    expect(response.headers.get("x-middleware-rewrite")).toBeNull();
    expect(JSON.parse(response.cookies.get(MARKETING_ASSIGNMENT_COOKIE)!.value).distinctId).toBe("shared-anonymous");
  });
  it("falls back to control without counting an exposure on failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const response = await proxy(request());
    expect(response.headers.get("x-middleware-rewrite")).toBe("https://usebento.ai/control");
    expect(response.cookies.has(MARKETING_ASSIGNMENT_COOKIE)).toBe(false);
  });
  it.each(["__ph_opt_in_out_phc_test=0", `ph_phc_test_posthog=${encodeURIComponent(JSON.stringify({ distinct_id: "user-1", $user_state: "identified" }))}`])("excludes opted-out visitors and existing accounts", async cookie => {
    const fetcher = vi.fn(); vi.stubGlobal("fetch", fetcher);
    const response = await proxy(request(cookie));
    expect(fetcher).not.toHaveBeenCalled();
    expect(response.cookies.has(MARKETING_ASSIGNMENT_COOKIE)).toBe(false);
  });
  it("keeps the production control when the experiment is off", async () => {
    vi.stubEnv("NEXT_PUBLIC_MARKETING_EXPERIMENT_ENABLED", "false");
    const fetcher = vi.fn(); vi.stubGlobal("fetch", fetcher);
    expect((await proxy(request())).headers.get("x-middleware-rewrite")).toContain("/control");
    expect(fetcher).not.toHaveBeenCalled();
  });
});
