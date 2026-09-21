import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMacRelease } from "@/lib/mac-releases";
import { GET } from "./route";

vi.mock("@/lib/mac-releases", () => ({ getMacRelease: vi.fn() }));
const lookup = vi.mocked(getMacRelease);
const request = (arch: string) => GET(new Request(`https://usebento.ai/download/mac/${arch}`), { params: Promise.resolve({ arch }) });

beforeEach(() => lookup.mockReset());

describe("stable Mac download routes", () => {
  it.each(["arm64", "x64"] as const)("redirects %s to the verified versioned DMG", async arch => {
    const url = `https://github.com/danielpang/bento/releases/download/v0.2.0/Bento-0.2.0-${arch}.dmg`;
    lookup.mockResolvedValue({ status: "available", release: { version: "0.2.0", downloads: { [arch]: url } } });
    const response = await request(arch);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(url);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("returns visitors to the download page before a Mac release exists", async () => {
    lookup.mockResolvedValue({ status: "unavailable" });
    expect((await request("arm64")).headers.get("location")).toBe("https://usebento.ai/download?download=unavailable");
  });

  it("handles a missing architecture and a GitHub failure without a broken external URL", async () => {
    lookup.mockResolvedValue({ status: "available", release: { version: "0.2.0", downloads: { arm64: "https://github.com/arm.dmg" } } });
    expect((await request("x64")).headers.get("location")).toBe("https://usebento.ai/download?download=unavailable");
    lookup.mockResolvedValue({ status: "error" });
    expect((await request("arm64")).headers.get("location")).toBe("https://usebento.ai/download?download=retry");
  });

  it("rejects unsupported architectures before fetching GitHub", async () => {
    expect((await request("universal")).status).toBe(404);
    expect(lookup).not.toHaveBeenCalled();
  });
});
