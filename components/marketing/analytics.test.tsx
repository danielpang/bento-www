import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ path: "/", search: "", capture: vi.fn(), init: vi.fn(), reset: vi.fn(), optedOut: false, distinctId: "visitor-1" }));
vi.mock("next/navigation", () => ({
  usePathname: () => mocks.path,
  useSearchParams: () => new URLSearchParams(mocks.search),
}));
vi.mock("posthog-js", () => ({ default: {
  init: mocks.init, capture: mocks.capture, reset: mocks.reset,
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

const events = () => mocks.capture.mock.calls.map(call => call[0]);

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test");
  mocks.path = "/"; mocks.search = ""; mocks.optedOut = false; mocks.distinctId = "visitor-1";
  mocks.capture.mockClear(); mocks.init.mockClear(); mocks.reset.mockClear();
});
afterEach(() => { vi.unstubAllEnvs(); });

async function renderPage(MarketingAnalytics: Analytics["MarketingAnalytics"]) {
  const view = render(
    <><div><a href="https://app.usebento.ai/">Sign up</a><a href="https://github.com/danielpang/bento">GitHub</a><a href={`/download/mac/${"arm64"}`}>Download for Apple silicon</a><a href={`/download/mac/${"x64"}`}>Download for Intel</a></div><MarketingAnalytics signupUrl="https://app.usebento.ai/" /></>,
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
      persistence: "localStorage+cookie",
      cross_subdomain_cookie: true,
      cookieWinsOnConflict: true,
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

  it("honors capture opt-out", async () => {
    mocks.optedOut = true;
    const MarketingAnalytics = await load();
    await renderPage(MarketingAnalytics);
    fireEvent.click(screen.getByText("Sign up"));
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(mocks.capture).not.toHaveBeenCalled();
  });

  it("records signup intent without variant properties", async () => {
    const MarketingAnalytics = await load();
    await renderPage(MarketingAnalytics);
    await waitFor(() => expect(events()).toEqual(["$pageview"]));
    fireEvent.click(screen.getByText("GitHub"));
    fireEvent.click(screen.getByText("Sign up"));
    expect(mocks.capture).toHaveBeenCalledWith("marketing signup clicked", { service: "bento-www", placement: "hero", path: "/" }, { transport: "sendBeacon" });
    expect(mocks.reset).not.toHaveBeenCalled();
  });

  it("records which Mac download was chosen", async () => {
    mocks.path = "/download";
    const MarketingAnalytics = await load();
    await renderPage(MarketingAnalytics);
    await waitFor(() => expect(events()).toEqual(["$pageview"]));
    fireEvent.click(screen.getByText("Download for Apple silicon"));
    fireEvent.click(screen.getByText("Download for Intel"));
    expect(mocks.capture).toHaveBeenCalledWith("mac download clicked", { service: "bento-www", arch: "arm64", chip: "Apple silicon", path: "/download" }, { transport: "sendBeacon" });
    expect(mocks.capture).toHaveBeenCalledWith("mac download clicked", { service: "bento-www", arch: "x64", chip: "Intel", path: "/download" }, { transport: "sendBeacon" });
    expect(events()).toEqual(["$pageview", "mac download clicked", "mac download clicked"]);
  });
});
