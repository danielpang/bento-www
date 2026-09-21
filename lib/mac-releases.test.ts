import { afterEach, describe, expect, it, vi } from "vitest";
import { findMacRelease, getMacRelease, MAC_RELEASES_URL } from "./mac-releases";

function release(version = "0.2.0") {
  return {
    tag_name: `v${version}`, draft: false, prerelease: false,
    published_at: "2026-09-20T12:00:00Z",
    assets: ["arm64", "x64"].map(arch => ({
      name: `Bento-${version}-${arch}.dmg`, state: "uploaded", size: 123456,
      browser_download_url: `${MAC_RELEASES_URL}/download/v${version}/Bento-${version}-${arch}.dmg`,
    })),
  };
}

afterEach(() => vi.unstubAllGlobals());

describe("Mac release discovery", () => {
  it("skips newer CLI-only, draft, and prerelease releases", () => {
    const ready = release();
    expect(findMacRelease([
      { ...release("0.5.0"), assets: [{ name: "bento-darwin-arm64.tar.gz" }] },
      { ...release("0.4.0"), draft: true },
      { ...release("0.3.0"), prerelease: true },
      { ...release("0.3.0-beta.1"), prerelease: false },
      ready,
      release("0.1.0"),
    ])).toEqual({ version: "0.2.0", downloads: {
      arm64: ready.assets[0].browser_download_url,
      x64: ready.assets[1].browser_download_url,
    } });
  });

  it("does not offer a missing architecture or invent an asset URL", () => {
    const ready = release();
    ready.assets.pop();
    expect(findMacRelease([ready])?.downloads).toEqual({ arm64: ready.assets[0].browser_download_url });
    ready.assets[0].browser_download_url = "https://example.com/Bento-0.2.0-arm64.dmg";
    expect(findMacRelease([ready])).toBeNull();
  });

  it("rejects unpublished, incomplete, empty, mismatched and malformed assets", () => {
    for (const patch of [
      { state: "new" }, { size: 0 }, { name: "Bento-0.1.0-arm64.dmg" },
      { browser_download_url: "https://github.com/other/repo/releases/download/v0.2.0/Bento-0.2.0-arm64.dmg" },
    ]) {
      const ready = release();
      ready.assets = [{ ...ready.assets[0], ...patch }];
      expect(findMacRelease([ready])).toBeNull();
    }
    expect(findMacRelease([null, "invalid", {}, { ...release(), published_at: null }])).toBeNull();
  });

  it("shares cache settings and follows pagination when recent releases have no DMGs", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json([{ ...release(), assets: [] }], { headers: { link: '<next>; rel="next"' } }))
      .mockResolvedValueOnce(Response.json([release()]));
    vi.stubGlobal("fetch", fetchMock);
    expect((await getMacRelease()).status).toBe("available");
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      "https://api.github.com/repos/danielpang/bento/releases?per_page=100&page=1",
      "https://api.github.com/repos/danielpang/bento/releases?per_page=100&page=2",
    ]);
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ next: { revalidate: 300 } });
    expect(fetchMock.mock.calls[0][1].signal).toBeDefined();
  });

  it("distinguishes no Mac release from lookup failure", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json([{ ...release(), assets: [] }]))
      .mockResolvedValueOnce(new Response(null, { status: 403 }))
      .mockResolvedValueOnce(Response.json({ error: "malformed" }))
      .mockRejectedValueOnce(new Error("timed out"));
    vi.stubGlobal("fetch", fetchMock);
    expect(await getMacRelease()).toEqual({ status: "unavailable" });
    for (let attempt = 0; attempt < 3; attempt++) {
      expect(await getMacRelease()).toEqual({ status: "error" });
    }
  });
});
