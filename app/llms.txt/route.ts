import { PUBLIC_PAGE_CACHE_CONTROL } from "@/lib/cache-control";
import { llmsTxt } from "@/lib/llms";

// Prerendered at build time: the content is a function of the repository,
// so crawlers and agents get a static text file, never a function invocation.
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": PUBLIC_PAGE_CACHE_CONTROL,
    },
  });
}
