import { NextRequest, NextResponse } from "next/server";
import { evaluateMarketingVariant, MARKETING_ASSIGNMENT_COOKIE, MARKETING_ID_COOKIE, readPostHogIdentity } from "@/lib/marketing-experiment";

export async function proxy(request: NextRequest) {
  // /control is an implementation route, not another indexable homepage.
  if (request.nextUrl.pathname === "/control") {
    return NextResponse.redirect(new URL("/preview/control", request.url));
  }
  const token = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const enabled = process.env.NEXT_PUBLIC_MARKETING_EXPERIMENT_ENABLED === "true" && Boolean(token);
  const isBot = /bot|crawler|spider|slurp|headless/i.test(request.headers.get("user-agent") ?? "");
  const optedOut = request.cookies.get(`__ph_opt_in_out_${token}`)?.value === "0";
  const identity = readPostHogIdentity(request.cookies.get(`ph_${token}_posthog`)?.value);
  const savedId = request.cookies.get(MARKETING_ID_COOKIE)?.value;
  const distinctId = identity?.distinctId ?? (savedId && /^[\w-]{1,200}$/.test(savedId) ? savedId : crypto.randomUUID());
  // Existing account holders do not belong in a signup acquisition experiment.
  const eligible = enabled && !isBot && !optedOut && !identity?.identified;
  const variant = eligible ? await evaluateMarketingVariant({ token: token!, host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com", distinctId }) : null;
  const fallback = process.env.NODE_ENV === "development" && !enabled ? "redesign" : "control";
  const selected = variant ?? fallback;
  const response = selected === "control"
    ? NextResponse.rewrite(new URL(`/control${request.nextUrl.search}`, request.url))
    : NextResponse.next();
  // Never let a CDN cache one visitor's assignment for another.
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  if (variant) {
    const options = { path: "/", sameSite: "lax" as const, secure: request.nextUrl.protocol === "https:", maxAge: 60 * 60 * 24 * 30 };
    response.cookies.set(MARKETING_ID_COOKIE, distinctId, options);
    response.cookies.set(MARKETING_ASSIGNMENT_COOKIE, JSON.stringify({ variant, distinctId }), options);
  } else if (request.cookies.has(MARKETING_ASSIGNMENT_COOKIE)) {
    response.cookies.delete(MARKETING_ASSIGNMENT_COOKIE);
  }
  return response;
}

export const config = { matcher: ["/", "/control"] };
