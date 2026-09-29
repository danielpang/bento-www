import { after, NextResponse, type NextRequest } from "next/server";
import {
  captureInstallScriptRequest,
  installClient,
  INSTALL_SCRIPT_URL,
  loadInstallScript,
} from "@/lib/install-script";

// A handler rather than a next.config redirect, so every request can be
// counted. The event is sent after the response goes out, so installs never
// wait on analytics, and the response is never cached, so a CDN cannot answer
// repeat installs where they would go unseen.
//
// Curl and wget keep the redirect to the release asset. A browser gets the
// script inline as text, the same way bun.sh/install can be opened and read
// before it is piped to a shell. If that fetch fails, the browser is sent to
// the release too.
export async function GET(request: NextRequest) {
  // Next also answers HEAD with this handler. Only a GET downloads the script.
  if (request.method === "GET") after(() => captureInstallScriptRequest(request.headers));

  if (request.method === "GET" && installClient(request.headers.get("user-agent")) === "browser") {
    try {
      const script = await loadInstallScript();
      return new NextResponse(script, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch {
      // The release redirect below is the fallback.
    }
  }

  const response = NextResponse.redirect(INSTALL_SCRIPT_URL, 307);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
