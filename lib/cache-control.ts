/**
 * A public marketing resource that is the same for everyone. Browsers
 * revalidate on each visit; shared caches keep it five minutes and refresh in
 * the background for a day, so a deploy shows up within minutes.
 */
export const PUBLIC_PAGE_CACHE_CONTROL =
  "public, max-age=0, s-maxage=300, stale-while-revalidate=86400";
