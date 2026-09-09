import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MARKETING_ASSIGNMENT_COOKIE, MARKETING_FLAG } from "@/lib/marketing-experiment";

const mocks = vi.hoisted(() => ({ path: "/", search: "", capture: vi.fn(), init: vi.fn(), optedOut: false, distinctId: "visitor-1" }));
vi.mock("next/navigation", () => ({
  usePathname: () => mocks.path,
  useSearchParams: () => new URLSearchParams(mocks.search),
}));
vi.mock("posthog-js", () => ({ default: {
  init: mocks.init, capture: mocks.capture,
  get_distinct_id: () => mocks.distinctId,
  has_opted_out_capturing: () => mocks.optedOut,
} }));

type Analytics = typeof import("./analytics");

// The component keeps one PostHog client per page load in module state, so
// every test gets a fresh module, the same as a fresh page.
async function load(): Promise<Analytics["MarketingAnalytics"]> {
  vi.resetModules();
  return (await import("./analytics")).MarketingAnalytics;
}

function assign(variant: string, distinctId = "visitor-1") {
  document.cookie = `${MARKETING_ASSIGNMENT_COOKIE}=${encodeURIComponent(JSON.stringify({ variant, distinctId }))}; path=/`;
}

const events = () => mocks.capture.mock.calls.map(call => call[0]);

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test");
  vi.stubEnv("NEXT_PUBLIC_MARKETING_EXPERIMENT_ENABLED", "false");
  mocks.path = "/"; mocks.search = ""; mocks.optedOut = false; mocks.distinctId = "visitor-1";
  mocks.capture.mockClear(); mocks.init.mockClear();
});
afterEach(() => { vi.unstubAllEnvs(); document.cookie = `${MARKETING_ASSIGNMENT_COOKIE}=; max-age=0; path=/`; });

async function renderPage(MarketingAnalytics: Analytics["MarketingAnalytics"], variant = "redesign") {
  const view = render(
    <><div data-marketing-variant={variant}><a href="https://app.usebento.ai/">Sign up</a><a href="https://github.com/danielpang/bento">GitHub</a></div><MarketingAnalytics signupUrl="https://app.usebento.ai/" /></>,
  );
  await waitFor(() => expect(mocks.init).toHaveBeenCalled());
  return view;
}

describe("web analytics", () => {
  it("records a pageview on every marketing page once the key is configured", async () => {
    const MarketingAnalytics = await load();
    await renderPage(MarketingAnalytics);
    await waitFor(() => expect(mocks.capture).toHaveBeenCalledWith("$pageview", { service: "bento-www" }));
    expect(mocks.init).toHaveBeenCalledWith("phc_test", expect.objectContaining({
      capture_pageview: false,
      capture_pageleave: true,
      cross_subdomain_cookie: true,
      autocapture: false,
    }));
    expect(mocks.init.mock.calls[0][1]).not.toHaveProperty("bootstrap");
  });

  it("records a pageview for each App Router navigation, not each render", async () => {
    const MarketingAnalytics = await load();
    const view = await renderPage(MarketingAnalytics);
    await waitFor(() => expect(events()).toEqual(["$pageview"]));
    view.rerender(<MarketingAnalytics signupUrl="https://app.usebento.ai/" />);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(events()).toEqual(["$pageview"]);

    mocks.path = "/pricing";
    view.rerender(<MarketingAnalytics signupUrl="https://app.usebento.ai/" />);
    await waitFor(() => expect(events()).toEqual(["$pageview", "$pageview"]));
    expect(mocks.init).toHaveBeenCalledTimes(1);
  });

  it("stays silent without a project key", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");
    const MarketingAnalytics = await load();
    render(<MarketingAnalytics signupUrl={null} />);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(mocks.init).not.toHaveBeenCalled();
    expect(mocks.capture).not.toHaveBeenCalled();
  });

  it.each(["/preview/redesign", "/preview/control", "/control"])("never counts %s", async path => {
    mocks.path = path;
    const MarketingAnalytics = await load();
    render(<MarketingAnalytics signupUrl={null} />);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(mocks.init).not.toHaveBeenCalled();
  });

  it("honors capture opt-out", async () => {
    mocks.optedOut = true;
    const MarketingAnalytics = await load();
    await renderPage(MarketingAnalytics);
    fireEvent.click(screen.getByText("Sign up"));
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(mocks.capture).not.toHaveBeenCalled();
  });

  it("records signup intent outside the experiment, without variant properties", async () => {
    const MarketingAnalytics = await load();
    await renderPage(MarketingAnalytics);
    await waitFor(() => expect(events()).toEqual(["$pageview"]));
    fireEvent.click(screen.getByText("GitHub"));
    fireEvent.click(screen.getByText("Sign up"));
    expect(mocks.capture).toHaveBeenCalledWith("marketing signup clicked", { service: "bento-www", placement: "hero", path: "/" }, { transport: "sendBeacon" });
  });
});

describe("experiment analytics", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_MARKETING_EXPERIMENT_ENABLED", "true");
    assign("redesign");
  });

  it("seeds the identity from the server assignment and records the rendered exposure and signup intent, never a completed signup", async () => {
    const MarketingAnalytics = await load();
    await renderPage(MarketingAnalytics);
    expect(mocks.init.mock.calls[0][1]).toMatchObject({ bootstrap: { distinctID: "visitor-1", isIdentifiedID: false } });
    await waitFor(() => expect(mocks.capture).toHaveBeenCalledWith("marketing page viewed", expect.objectContaining({ service: "bento-www" })));
    expect(mocks.capture).toHaveBeenCalledWith("$pageview", { service: "bento-www" });
    expect(mocks.capture).toHaveBeenCalledWith("$feature_flag_called", expect.objectContaining({ service: "bento-www", $feature_flag: MARKETING_FLAG, $feature_flag_response: "redesign" }));
    fireEvent.click(screen.getByText("GitHub"));
    fireEvent.click(screen.getByText("Sign up"));
    expect(mocks.capture).toHaveBeenCalledWith("marketing signup clicked", expect.objectContaining({ service: "bento-www", marketing_variant: "redesign" }), { transport: "sendBeacon" });
    expect(events()).not.toContain("user signed up");
  });

  it("excludes previews even when a real assignment cookie already exists", async () => {
    mocks.path = "/preview/redesign";
    const MarketingAnalytics = await load();
    render(<><a href="https://app.usebento.ai/">Sign up</a><MarketingAnalytics signupUrl="https://app.usebento.ai/" /></>);
    await new Promise(resolve => setTimeout(resolve, 0));
    fireEvent.click(screen.getByText("Sign up"));
    expect(mocks.capture).not.toHaveBeenCalled();
  });

  it("does not attribute a page that differs from the server assignment", async () => {
    const MarketingAnalytics = await load();
    await renderPage(MarketingAnalytics, "control");
    await waitFor(() => expect(events()).toEqual(["$pageview"]));
    fireEvent.click(screen.getByText("Sign up"));
    expect(events()).toEqual(["$pageview", "marketing signup clicked"]);
    expect(mocks.capture.mock.calls[1][1]).not.toHaveProperty("marketing_variant");
  });

  it("does not attribute a browser whose identity differs from the assignment", async () => {
    mocks.distinctId = "someone-else";
    const MarketingAnalytics = await load();
    await renderPage(MarketingAnalytics);
    await waitFor(() => expect(events()).toEqual(["$pageview"]));
    fireEvent.click(screen.getByText("Sign up"));
    expect(events()).toEqual(["$pageview", "marketing signup clicked"]);
    expect(mocks.capture.mock.calls[1][1]).not.toHaveProperty("marketing_variant");
  });

  it("retains attribution through a visit to pricing without recording another exposure", async () => {
    mocks.path = "/pricing";
    const MarketingAnalytics = await load();
    await renderPage(MarketingAnalytics);
    await waitFor(() => expect(events()).toEqual(["$pageview"]));
    fireEvent.click(screen.getByText("Sign up"));
    expect(events()).toEqual(["$pageview", "marketing signup clicked"]);
    expect(mocks.capture.mock.calls[1][1]).toMatchObject({ marketing_variant: "redesign", path: "/pricing" });
  });
});
