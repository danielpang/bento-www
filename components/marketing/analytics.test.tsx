import { render, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MARKETING_ASSIGNMENT_COOKIE, MARKETING_FLAG } from "@/lib/marketing-experiment";

const mocks = vi.hoisted(() => ({ path: "/", capture: vi.fn(), init: vi.fn(), optedOut: false }));
vi.mock("next/navigation", () => ({ usePathname: () => mocks.path }));
vi.mock("posthog-js", () => ({ default: {
  init: mocks.init, capture: mocks.capture,
  get_distinct_id: () => "visitor-1",
  has_opted_out_capturing: () => mocks.optedOut,
} }));
import { MarketingAnalytics } from "./analytics";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_MARKETING_EXPERIMENT_ENABLED", "true");
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test");
  mocks.path = "/"; mocks.optedOut = false; mocks.capture.mockClear();
  document.cookie = `${MARKETING_ASSIGNMENT_COOKIE}=${encodeURIComponent(JSON.stringify({ variant: "redesign", distinctId: "visitor-1" }))}; path=/`;
});
afterEach(() => { vi.unstubAllEnvs(); document.cookie = `${MARKETING_ASSIGNMENT_COOKIE}=; max-age=0; path=/`; });

function Page({ variant = "redesign" }: { variant?: string }) {
  return <><div data-marketing-variant={variant}><a href="https://app.usebento.ai/">Sign up</a><a href="https://github.com/danielpang/bento">GitHub</a></div><MarketingAnalytics signupUrl="https://app.usebento.ai/" /></>;
}
describe("experiment analytics", () => {
  it("records the rendered exposure and signup intent, never a completed signup", () => {
    render(<Page />);
    expect(mocks.capture).toHaveBeenCalledWith("$feature_flag_called", expect.objectContaining({ $feature_flag: MARKETING_FLAG, $feature_flag_response: "redesign" }));
    fireEvent.click(screen.getByText("GitHub"));
    fireEvent.click(screen.getByText("Sign up"));
    expect(mocks.capture).toHaveBeenCalledWith("marketing signup clicked", expect.objectContaining({ marketing_variant: "redesign" }), { transport: "sendBeacon" });
    expect(mocks.capture.mock.calls.some(call => call[0] === "user signed up")).toBe(false);
  });
  it("excludes previews even when a real assignment cookie already exists", () => {
    mocks.path = "/preview/redesign";
    render(<Page />); fireEvent.click(screen.getByText("Sign up"));
    expect(mocks.capture).not.toHaveBeenCalled();
  });
  it("does not attribute a page that differs from the server assignment", () => {
    render(<Page variant="control" />); fireEvent.click(screen.getByText("Sign up"));
    expect(mocks.capture).not.toHaveBeenCalled();
  });
  it("retains attribution through a visit to pricing without recording another exposure", () => {
    mocks.path = "/pricing";
    render(<Page />); fireEvent.click(screen.getByText("Sign up"));
    expect(mocks.capture.mock.calls.map(call => call[0])).toEqual(["marketing signup clicked"]);
  });
  it("honors capture opt-out", () => {
    mocks.optedOut = true;
    render(<Page />); fireEvent.click(screen.getByText("Sign up"));
    expect(mocks.capture).not.toHaveBeenCalled();
  });
});
