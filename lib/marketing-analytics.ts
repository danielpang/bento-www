export const MARKETING_SERVICE = "bento-www";

/** Name the Bento downloads dashboard already breaks down. */
export const MAC_DOWNLOAD_CLICKED = "mac download clicked";

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

export type MacDownloadProperties = {
  service: typeof MARKETING_SERVICE;
  chip: MacDownloadArchitecture;
  location: string;
  href: string;
};

/** Properties for `mac download clicked`. `chip` is the build id the dashboard splits on. */
export function macDownloadProperties(
  href: string,
  siteOrigin: string,
  location: string,
): MacDownloadProperties | null {
  const chip = macDownloadArchitecture(href, siteOrigin);
  if (!chip) return null;
  try {
    return {
      service: MARKETING_SERVICE,
      chip,
      location,
      href: new URL(href, siteOrigin).href,
    };
  } catch {
    return null;
  }
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

/** Cookie and localStorage key posthog-js uses for this project token. */
export function posthogPersistenceName(token: string): string {
  const safe = token.replace(/\+/g, "PL").replace(/\//g, "SL").replace(/=/g, "EQ");
  return `ph_${safe}_posthog`;
}

function readCookie(cookie: string, name: string): string | null {
  for (const part of cookie.split(";")) {
    const trimmed = part.trim();
    const separator = trimmed.indexOf("=");
    if (separator === -1 || trimmed.slice(0, separator) !== name) continue;
    const raw = trimmed.slice(separator + 1);
    if (!raw.includes("%")) return raw;
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }
  return null;
}

/** `distinct_id` from a posthog-js persistence blob, or null when it is missing. */
export function distinctIdFromPersistence(value: string | null): string | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object" || !("distinct_id" in parsed)) return null;
    const id = parsed.distinct_id;
    return typeof id === "string" && id.length > 0 ? id : null;
  } catch {
    return null;
  }
}

/** Distinct id already stored for this token, preferring the cross-subdomain cookie. */
export function posthogDistinctId(cookie: string, stored: string | null, token: string): string | null {
  return distinctIdFromPersistence(readCookie(cookie, posthogPersistenceName(token))) ?? distinctIdFromPersistence(stored);
}

/** True when the PostHog opt-out cookie says this browser has refused capture. */
export function posthogHasOptedOut(cookie: string, token: string): boolean {
  const raw = readCookie(cookie, `__ph_opt_in_out_${token}`);
  if (raw == null) return false;
  let value: unknown = raw;
  try {
    value = JSON.parse(raw) as unknown;
  } catch {
    // The cookie can be the plain text "0" / "false" rather than JSON.
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "0" || normalized === "false" || normalized === "no";
  }
  return value === 0 || value === false;
}

/**
 * Capture payload for a click that happens before posthog-js has loaded.
 * `text/plain` JSON avoids the CORS preflight sendBeacon cannot complete during navigation.
 */
export function macDownloadBeacon(input: {
  token: string;
  distinctId: string;
  host: string;
  properties: MacDownloadProperties;
  timestamp?: string;
}): { url: string; body: string } {
  return {
    url: new URL("/i/v0/e/", input.host).href,
    body: JSON.stringify({
      api_key: input.token,
      event: MAC_DOWNLOAD_CLICKED,
      distinct_id: input.distinctId,
      timestamp: input.timestamp ?? new Date().toISOString(),
      properties: input.properties,
    }),
  };
}
