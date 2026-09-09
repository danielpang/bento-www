/**
 * Host-level redirects onto the canonical marketing origin.
 *
 * Every alias domain attached to the deployment (the www subdomain and the
 * older .dev domains) answers with a 301 to the same path on usebento.ai,
 * so search engines consolidate signals on one host instead of indexing the
 * same HTML under four names. 301 rather than Next's default 308 because the
 * audit asked for the classic permanent code and every request here is a GET;
 * method preservation is not a concern for a marketing site.
 *
 * On Vercel a domain that is set to "Redirect to" another domain in the
 * dashboard never reaches this code. For these rules to apply, every alias
 * must be attached to the project as a plain domain.
 */
export const CANONICAL_HOST = "usebento.ai";

export const REDIRECTED_HOSTS = [
  "www.usebento.ai",
  "usebento.dev",
  "www.usebento.dev",
] as const;

export interface HostRedirect {
  source: string;
  has: { type: "host"; value: string }[];
  destination: string;
  statusCode: 301;
}

export function hostRedirects(
  canonicalHost: string = CANONICAL_HOST,
  hosts: readonly string[] = REDIRECTED_HOSTS,
): HostRedirect[] {
  return hosts
    .filter((host) => host !== canonicalHost)
    .map((host) => ({
      source: "/:path*",
      has: [{ type: "host", value: escapeHost(host) }],
      destination: `https://${canonicalHost}/:path*`,
      statusCode: 301,
    }));
}

/** Next compiles `has.value` as a regular expression, so dots must be literal. */
function escapeHost(host: string): string {
  return host.replace(/\./g, "\\.");
}
