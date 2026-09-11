import { describe, expect, it } from "vitest";
import { installClient } from "./install-script";

describe("installClient", () => {
  it("names terminal downloaders, browsers, and everything else", () => {
    expect(installClient("curl/8.7.1")).toBe("curl");
    expect(installClient("Wget/1.21.4")).toBe("wget");
    expect(installClient("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")).toBe("browser");
    expect(installClient("Googlebot-Image/1.0")).toBe("other");
    expect(installClient(null)).toBe("other");
  });
});
