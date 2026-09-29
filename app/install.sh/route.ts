import { after, NextResponse, type NextRequest } from "next/server";
import { captureInstallScriptRequest, INSTALL_SCRIPT_URL } from "@/lib/install-script";

// A handler rather than a next.config redirect, so every request can be
// counted. The event is sent after the redirect goes out, so installs never
// wait on analytics, and the response is never cached, so a CDN cannot answer
// repeat installs where they would go unseen.
export function GET(request: NextRequest) {
  // Next also answers HEAD with this handler. Only a GET downloads the script.
  if (request.method === "GET") after(() => captureInstallScriptRequest(request.headers));
  const response = NextResponse.redirect(INSTALL_SCRIPT_URL, 307);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
