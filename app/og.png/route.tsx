import { ImageResponse } from "next/og";
import { SocialCard } from "@/components/social-card";
import { socialImageSize } from "@/lib/metadata";

// GET handlers are dynamic by default; prerender the card at build time so
// crawlers get a fast, cacheable static file.
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(<SocialCard />, socialImageSize);
}
