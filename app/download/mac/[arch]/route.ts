import { NextResponse } from "next/server";
import { getMacRelease } from "@/lib/mac-releases";

export async function GET(request: Request, context: { params: Promise<{ arch: string }> }) {
  const { arch } = await context.params;
  if (arch !== "arm64" && arch !== "x64") {
    return new Response("Mac download not found.", { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  const result = await getMacRelease();
  const download = result.status === "available" ? result.release.downloads[arch] : undefined;
  const destination = download ?? new URL(`/download?download=${result.status === "error" ? "retry" : "unavailable"}`, request.url);
  const response = NextResponse.redirect(destination, 307);
  // Metadata has a short shared cache; a saved download URL must never be
  // permanently pinned to an old version or an unavailable state.
  response.headers.set("Cache-Control", "no-store");
  return response;
}
