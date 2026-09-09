/** One visitor's response: the experiment assignment, or a cookie being written. */
export const PRIVATE_CACHE_CONTROL = "private, no-store, max-age=0";

/**
 * A prerendered marketing page that is the same for everyone. Browsers
 * revalidate on each visit; shared caches keep it five minutes and refresh in
 * the background for a day, so a deploy shows up within minutes without a
 * function invocation per request.
 */
export const PUBLIC_PAGE_CACHE_CONTROL =
  "public, max-age=0, s-maxage=300, stale-while-revalidate=86400";
