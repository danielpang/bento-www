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
