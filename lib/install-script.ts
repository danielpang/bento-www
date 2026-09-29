import { createHash } from "node:crypto";

/** The installer ships with each CLI release, so /install.sh redirects to the latest one. */
export const INSTALL_SCRIPT_URL =
  "https://github.com/danielpang/bento/releases/latest/download/install.sh";

/** A release installer is a few kilobytes. Anything larger is not the script. */
const MAX_INSTALL_SCRIPT_BYTES = 256_000;

export const INSTALL_SCRIPT_EVENT = "cli install script requested";

/** Names the downloader, so installs from a terminal can be told apart from browser visits and bots. */
export function installClient(userAgent: string | null): string {
  const tool = userAgent?.match(/^(curl|wget)\//i)?.[1];
  if (tool) return tool.toLowerCase();
  return userAgent && /^mozilla\//i.test(userAgent) ? "browser" : "other";
}

/**
 * A terminal has no PostHog cookie, so the id is derived from the client:
 * repeat installs from one machine count as one installer, without storing
 * the IP in the id. Without an IP there is nothing stable to derive from.
 */
function installerId(ip: string | null, userAgent: string | null): string {
  if (!ip) return crypto.randomUUID();
  return `install_${createHash("sha256").update(`${ip} ${userAgent ?? ""}`).digest("hex").slice(0, 32)}`;
}

/**
 * Loads the latest installer so a browser can show it. Terminals never use
 * this: they are redirected straight at the release, and a failed or
 * unexpected body falls back to that same redirect.
 */
export async function loadInstallScript(): Promise<string> {
  const response = await fetch(INSTALL_SCRIPT_URL, {
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) throw new Error(`install script responded ${response.status}`);
  const advertised = Number(response.headers.get("content-length"));
  if (Number.isFinite(advertised) && advertised > MAX_INSTALL_SCRIPT_BYTES) {
    throw new Error("install script is too large to display");
  }
  const script = await response.text();
  if (script.length > MAX_INSTALL_SCRIPT_BYTES || !script.startsWith("#!")) {
    throw new Error("install script is not a shell script");
  }
  return script;
}

/**
 * Records one install script request in PostHog, shaped the way PostHog asks
 * for server-side request events: no person profile, the raw user agent for
 * bot detection, and the client IP so GeoIP places the install rather than
 * the server. Analytics must never break an install, so failures are swallowed.
 */
export async function captureInstallScriptRequest(headers: Headers): Promise<void> {
  const token = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!token) return;
  const userAgent = headers.get("user-agent");
  const ip = headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip");
  try {
    await fetch(new URL("/i/v0/e/", process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: token,
        event: INSTALL_SCRIPT_EVENT,
        distinct_id: installerId(ip, userAgent),
        properties: {
          service: "bento-www",
          client: installClient(userAgent),
          $raw_user_agent: userAgent,
          $process_person_profile: false,
          ...(ip ? { $ip: ip } : {}),
        },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(2000),
    });
  } catch {
    // Dropped event, not a failed install.
  }
}
