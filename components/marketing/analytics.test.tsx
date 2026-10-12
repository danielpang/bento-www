import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const capture = vi.fn();
  const init = vi.fn();
  const reset = vi.fn();
  const state = { path: "/", search: "", optedOut: false, distinctId: "visitor-1" };
  const posthog = {
    init,
    capture,
    reset,
    get_distinct_id: () => state.distinctId,
    has_opted_out_capturing: () => state.optedOut,
  };
  return { capture, init, reset, state, posthog };
});
vi.mock("next/navigation", () => ({
  usePathname: () => mocks.state.path,
  useSearchParams: () => new URLSearchParams(mocks.state.search),
}));
vi.mock("posthog-js", () => ({ default: mocks.posthog }));

type Analytics = typeof import("./analytics");

// The component keeps one PostHog client per page load in module state, so
// every test gets a fresh module, the same as a fresh page.
async function load(): Promise<Analytics["MarketingAnalytics"]> {
  vi.resetModules();
  return (await import("./analytics")).MarketingAnalytics;
}

const events = () => mocks.capture.mock.calls.map(call => call[0]);
const sendBeacon = vi.fn<(url: string, body?: BodyInit | null) => boolean>(() => true);

function page(MarketingAnalytics: Analytics["MarketingAnalytics"]) {
  return (
    <>
      <div>
        <a href="https://app.usebento.ai/">Sign up</a>
        <a href="https://github.com/danielpang/bento">GitHub</a>
        <a data-location="download_page" href={`/download/mac/${"arm64"}`}><span>Download for Apple silicon</span></a>
        <a data-location="download_page" href={`/download/mac/${"x64"}`}>Download for Intel</a>
      </div>
      <MarketingAnalytics signupUrl="https://app.usebento.ai/" />
    </>
  );
}

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test");
  mocks.state.path = "/";
  mocks.state.search = "";
  mocks.state.optedOut = false;
  mocks.state.distinctId = "visitor-1";
  mocks.capture.mockClear();
  mocks.init.mockClear();
  mocks.reset.mockClear();
  mocks.init.mockImplementation((_token, config) => {
    config?.loaded?.(mocks.posthog);
  });
  sendBeacon.mockClear();
  Object.defineProperty(navigator, "sendBeacon", { configurable: true, writable: true, value: sendBeacon });
  localStorage.clear();
  document.cookie = "ph_phc_test_posthog=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
});
afterEach(() => { vi.unstubAllEnvs(); });

async function renderPage(MarketingAnalytics: Analytics["MarketingAnalytics"]) {
  const view = render(page(MarketingAnalytics));
  await waitFor(() => expect(mocks.init).toHaveBeenCalled());
  return view;
}

async function beaconBody(): Promise<unknown> {
  const blob = sendBeacon.mock.calls[0]?.[1];
  if (!(blob instanceof Blob)) throw new Error("expected a beacon body");
  return JSON.parse(await blob.text());
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
    view.rerender(page(MarketingAnalytics));
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(events()).toEqual(["$pageview"]);

    mocks.state.path = "/pricing";
    view.rerender(page(MarketingAnalytics));
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
    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it("honors capture opt-out", async () => {
    mocks.state.optedOut = true;
    const MarketingAnalytics = await load();
    await renderPage(MarketingAnalytics);
    fireEvent.click(screen.getByText("Sign up"));
    fireEvent.click(screen.getByText("Download for Apple silicon"));
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(mocks.capture).not.toHaveBeenCalled();
    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it("records signup intent without variant properties", async () => {
    const MarketingAnalytics = await load();
    await renderPage(MarketingAnalytics);
    await waitFor(() => expect(events()).toEqual(["$pageview"]));
    fireEvent.click(screen.getByText("GitHub"));
    fireEvent.click(screen.getByText("Sign up"));
    expect(mocks.capture).toHaveBeenCalledWith("marketing signup clicked", { service: "bento-www", placement: "hero", path: "/" }, { transport: "sendBeacon" });
    expect(mocks.reset).not.toHaveBeenCalled();
    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it("records which Mac download was chosen before the file navigation", async () => {
    mocks.state.path = "/download";
    const MarketingAnalytics = await load();
    await renderPage(MarketingAnalytics);
    await waitFor(() => expect(events()).toEqual(["$pageview"]));
    const apple = screen.getByRole("link", { name: "Download for Apple silicon" });
    const intel = screen.getByRole("link", { name: "Download for Intel" });
    if (!(apple instanceof HTMLAnchorElement) || !(intel instanceof HTMLAnchorElement)) {
      throw new Error("expected download anchors");
    }
    fireEvent.click(screen.getByText("Download for Apple silicon"));
    fireEvent.click(intel);
    expect(mocks.capture).toHaveBeenCalledWith("mac download clicked", {
      service: "bento-www",
      chip: "arm64",
      location: "download_page",
      href: apple.href,
    }, { send_instantly: true, transport: "sendBeacon" });
    expect(mocks.capture).toHaveBeenCalledWith("mac download clicked", {
      service: "bento-www",
      chip: "x64",
      location: "download_page",
      href: intel.href,
    }, { send_instantly: true, transport: "sendBeacon" });
    expect(events()).toEqual(["$pageview", "mac download clicked", "mac download clicked"]);
    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it("keeps recording the download across a client navigation", async () => {
    const MarketingAnalytics = await load();
    const view = await renderPage(MarketingAnalytics);
    await waitFor(() => expect(events()).toEqual(["$pageview"]));
    mocks.state.path = "/download";
    view.rerender(page(MarketingAnalytics));
    const apple = screen.getByRole("link", { name: "Download for Apple silicon" });
    if (!(apple instanceof HTMLAnchorElement)) throw new Error("expected download anchor");
    fireEvent.click(apple);
    expect(mocks.capture).toHaveBeenCalledWith("mac download clicked", {
      service: "bento-www",
      chip: "arm64",
      location: "download_page",
      href: apple.href,
    }, { send_instantly: true, transport: "sendBeacon" });
  });

  it("beacons the download when the button is clicked before posthog-js is ready", async () => {
    mocks.init.mockImplementation(() => {});
    mocks.state.path = "/download";
    document.cookie = `ph_phc_test_posthog=${encodeURIComponent(JSON.stringify({ distinct_id: "visitor-from-cookie" }))}`;
    const MarketingAnalytics = await load();
    render(page(MarketingAnalytics));
    const apple = screen.getByRole("link", { name: "Download for Apple silicon" });
    if (!(apple instanceof HTMLAnchorElement)) throw new Error("expected download anchor");
    fireEvent.click(screen.getByText("Download for Apple silicon"));
    expect(mocks.capture).not.toHaveBeenCalled();
    expect(sendBeacon).toHaveBeenCalledTimes(1);
    const [beaconUrl, beaconBodyBlob] = sendBeacon.mock.calls[0] ?? [];
    expect(beaconUrl).toBe("https://us.i.posthog.com/i/v0/e/");
    if (!(beaconBodyBlob instanceof Blob)) throw new Error("expected a beacon body");
    expect(beaconBodyBlob.type).toBe("text/plain");
    expect(await beaconBody()).toMatchObject({
      api_key: "phc_test",
      event: "mac download clicked",
      distinct_id: "visitor-from-cookie",
      properties: {
        service: "bento-www",
        chip: "arm64",
        location: "download_page",
        href: apple.href,
      },
    });

    if (mocks.init.mock.calls.length === 0) {
      mocks.init.mockImplementation((_token, config) => {
        config?.loaded?.(mocks.posthog);
      });
      await vi.dynamicImportSettled();
    } else {
      mocks.init.mock.calls.at(-1)?.[1].loaded(mocks.posthog);
    }
    await waitFor(() => expect(events()).toEqual(["$pageview"]));
    expect(sendBeacon).toHaveBeenCalledTimes(1);
  });
});
