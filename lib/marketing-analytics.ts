export function isSignupDestination(
  href: string,
  signupUrl: string | null,
): boolean {
  if (!signupUrl) return false;
  try {
    const target = new URL(href);
    const signup = new URL(signupUrl);
    return target.origin === signup.origin && target.pathname === signup.pathname;
  } catch {
    return false;
  }
}

export type MacDownloadArchitecture = "arm64" | "x64";

/** Chip names stored on `mac app download clicked`, matching the two Mac builds. */
export type MacDownloadArchLabel = "apple silicon" | "intel";

/** The architecture a link downloads, when it points at this site's /download/mac/:arch route. */
export function macDownloadArchitecture(
  href: string,
  siteOrigin: string,
): MacDownloadArchitecture | null {
  try {
    const target = new URL(href, siteOrigin);
    if (target.origin !== siteOrigin) return null;
    const match = /^\/download\/mac\/(arm64|x64)\/?$/.exec(target.pathname);
    return match ? (match[1] as MacDownloadArchitecture) : null;
  } catch {
    return null;
  }
}

export function macDownloadArchLabel(arch: MacDownloadArchitecture): MacDownloadArchLabel {
  return arch === "arm64" ? "apple silicon" : "intel";
}

/** Bare semver from the Mac release, the same shape `findMacRelease` stores. */
export function macDownloadVersion(value: string | null): string | undefined {
  return value && /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/.test(value) ? value : undefined;
}

/**
 * Where on the site the download control sits. A declared `data-location` wins;
 * otherwise the section, then the download page itself.
 */
export function macDownloadLocation(
  declared: string | null,
  pathname: string,
  section: { nav: boolean; hero: boolean; footer: boolean },
): string {
  const location = declared?.trim();
  if (location) return location;
  if (section.nav) return "nav";
  if (section.hero) return "homepage_hero";
  if (section.footer) return "footer";
  if (pathname === "/download") return "download_page";
  return "unknown";
}
