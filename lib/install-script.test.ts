import { afterEach, describe, expect, it, vi } from "vitest";
import { installClient, loadInstallScript } from "./install-script";

describe("installClient", () => {
  it("names terminal downloaders, browsers, and everything else", () => {
    expect(installClient("curl/8.7.1")).toBe("curl");
    expect(installClient("Wget/1.21.4")).toBe("wget");
    expect(installClient("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")).toBe("browser");
    expect(installClient("Googlebot-Image/1.0")).toBe("other");
    expect(installClient(null)).toBe("other");
  });
});

describe("loadInstallScript", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a shell script from the latest release", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("#!/bin/sh\necho ok\n")));

    await expect(loadInstallScript()).resolves.toBe("#!/bin/sh\necho ok\n");
  });

  it("rejects a body that is not the installer", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>nope</html>", { status: 200 })));

    await expect(loadInstallScript()).rejects.toThrow("not a shell script");
  });
});
