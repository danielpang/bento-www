export const MARKETING_FLAG = "marketing-homepage-v2";
export const MARKETING_ID_COOKIE = "bento_marketing_id";
export const MARKETING_ASSIGNMENT_COOKIE = "bento_marketing_assignment";
export type MarketingVariant = "control" | "redesign";

export function isMarketingVariant(value: unknown): value is MarketingVariant {
  return value === "control" || value === "redesign";
}

export function parseAssignment(value?: string) {
  try {
    const parsed = JSON.parse(value ?? "null");
    return parsed && isMarketingVariant(parsed.variant) && typeof parsed.distinctId === "string"
      ? { variant: parsed.variant as MarketingVariant, distinctId: parsed.distinctId as string }
      : null;
  } catch { return null; }
}

export function readPostHogIdentity(cookie?: string): { distinctId: string; identified: boolean } | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(cookie ?? ""));
    if (typeof parsed.distinct_id !== "string" || !parsed.distinct_id || parsed.distinct_id.length > 200) return null;
    return { distinctId: parsed.distinct_id, identified: parsed.$user_state === "identified" };
  } catch { return null; }
}

/** Unknown/disabled flags and service failures never count as control exposures. */
export async function evaluateMarketingVariant({ token, host, distinctId }: { token: string; host: string; distinctId: string }): Promise<MarketingVariant | null> {
  try {
    const response = await fetch(new URL("/flags?v=2", host), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: token, distinct_id: distinctId, flag_keys_to_evaluate: [MARKETING_FLAG] }),
      cache: "no-store",
      signal: AbortSignal.timeout(1200),
    });
    if (!response.ok) return null;
    const result = await response.json();
    const flag = result.flags?.[MARKETING_FLAG];
    if (result.errorsWhileComputingFlags || result.quotaLimited?.includes("feature_flags")) return null;
    return flag?.enabled === true && isMarketingVariant(flag.variant) ? flag.variant : null;
  } catch { return null; }
}

export function isSignupDestination(href: string, signupUrl: string | null): boolean {
  if (!signupUrl) return false;
  try {
    const target = new URL(href);
    const signup = new URL(signupUrl);
    return target.origin === signup.origin && target.pathname === signup.pathname;
  } catch { return false; }
}
