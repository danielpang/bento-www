import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { INSTALL_SCRIPT_EVENT, INSTALL_SCRIPT_URL } from "@/lib/install-script";
import { GET } from "./route";

const scheduled = vi.hoisted(() => [] as Promise<unknown>[]);

// Outside a real request there is nothing to run after(), so run it now and keep the promise.
vi.mock("next/server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/server")>()),
  after: (task: () => Promise<unknown>) => {
    scheduled.push(task());
  },
}));

const fetchMock = vi.fn();

function installRequest(method = "GET") {
  return new NextRequest("http://localhost:3000/install.sh", {
    method,
    headers: { "user-agent": "curl/8.7.1", "x-forwarded-for": "203.0.113.9, 10.0.0.1" },
  });
}

describe("GET /install.sh", () => {
  beforeEach(() => {
    fetchMock.mockReset().mockResolvedValue(new Response(null));
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://us.i.posthog.com");
  });

  afterEach(() => {
    scheduled.length = 0;
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("redirects to the installer on the latest release without caching", () => {
    const response = GET(installRequest());

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(INSTALL_SCRIPT_URL);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("records each request in PostHog as one anonymous installer per client", async () => {
    GET(installRequest());
    GET(installRequest());
    await Promise.all(scheduled);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[0][0])).toBe("https://us.i.posthog.com/i/v0/e/");
    const [first, second] = fetchMock.mock.calls.map(([, init]) => JSON.parse(init.body));
    expect(first).toMatchObject({
      api_key: "phc_test",
      event: INSTALL_SCRIPT_EVENT,
      properties: {
        service: "bento-www",
        client: "curl",
        $raw_user_agent: "curl/8.7.1",
        $ip: "203.0.113.9",
        $process_person_profile: false,
      },
    });
    expect(first.distinct_id).toMatch(/^install_[0-9a-f]{32}$/);
    expect(first.distinct_id).not.toContain("203.0.113.9");
    expect(second.distinct_id).toBe(first.distinct_id);
  });

  it("still redirects when PostHog is unreachable", async () => {
    fetchMock.mockRejectedValue(new Error("offline"));

    const response = GET(installRequest());

    await expect(Promise.all(scheduled)).resolves.toEqual([undefined]);
    expect(response.status).toBe(307);
  });

  it("sends nothing for HEAD requests or without a PostHog key", async () => {
    GET(installRequest("HEAD"));
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");
    GET(installRequest());
    await Promise.all(scheduled);

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
