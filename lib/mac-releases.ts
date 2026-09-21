export const MAC_RELEASES_URL = "https://github.com/danielpang/bento/releases";
const RELEASES_API = "https://api.github.com/repos/danielpang/bento/releases";

export type MacArchitecture = "arm64" | "x64";
export type MacRelease = {
  version: string;
  downloads: Partial<Record<MacArchitecture, string>>;
};
export type MacReleaseResult =
  | { status: "available"; release: MacRelease }
  | { status: "unavailable" | "error" };

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Only offer uploaded assets from a published stable version in our repository. */
export function findMacRelease(releases: unknown[]): MacRelease | null {
  for (const release of releases) {
    if (!record(release) || release.draft !== false || release.prerelease !== false) continue;
    if (typeof release.published_at !== "string" || typeof release.tag_name !== "string") continue;
    const version = /^v?((?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*))$/.exec(release.tag_name)?.[1];
    if (!version || !Array.isArray(release.assets)) continue;

    const downloads: MacRelease["downloads"] = {};
    for (const arch of ["arm64", "x64"] as const) {
      const name = `Bento-${version}-${arch}.dmg`;
      const url = `${MAC_RELEASES_URL}/download/${release.tag_name}/${name}`;
      const asset = release.assets.find((candidate: unknown) =>
        record(candidate) && candidate.name === name &&
        candidate.state === "uploaded" && typeof candidate.size === "number" && candidate.size > 0 &&
        candidate.browser_download_url === url,
      );
      if (asset) downloads[arch] = url;
    }
    if (Object.keys(downloads).length) return { version, downloads };
  }
  return null;
}

/** A newer CLI-only release must not hide the most recent Mac release. */
export async function getMacRelease(): Promise<MacReleaseResult> {
  try {
    // GitHub lists newest releases first. Cache metadata for five minutes,
    // sharing the same lookup between the page and both download routes.
    for (let page = 1; ; page++) {
      const response = await fetch(`${RELEASES_API}?per_page=100&page=${page}`, {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) return { status: "error" };
      const releases: unknown = await response.json();
      if (!Array.isArray(releases)) return { status: "error" };
      const release = findMacRelease(releases);
      if (release) return { status: "available", release };
      if (!response.headers.get("link")?.includes('rel="next"')) return { status: "unavailable" };
    }
  } catch {
    return { status: "error" };
  }
}
