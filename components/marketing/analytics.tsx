"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { isSignupDestination, MARKETING_ASSIGNMENT_COOKIE, MARKETING_FLAG, parseAssignment } from "@/lib/marketing-experiment";

function readCookie(name: string) {
  const cookie = document.cookie.split("; ").find(value => value.startsWith(`${name}=`));
  try { return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : undefined; } catch { return undefined; }
}

let initialized = false;
let lastExposure: string | null = null;

export function MarketingAnalytics({ signupUrl }: { signupUrl: string | null }) {
  const pathname = usePathname();
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (process.env.NEXT_PUBLIC_MARKETING_EXPERIMENT_ENABLED !== "true" || !token || pathname.startsWith("/preview") || pathname === "/control") return;
    const assignment = parseAssignment(readCookie(MARKETING_ASSIGNMENT_COOKIE));
    if (!assignment) return;
    // Only hydrate analytics after a real server-side assignment. Shared PostHog
    // cookies carry this anonymous identity to app.usebento.ai, whose existing
    // identifyUser(userId) merges it with the server's `user signed up` event.
    if (!initialized) {
      posthog.init(token, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        persistence: "localStorage+cookie",
        cross_subdomain_cookie: true,
        opt_out_capturing_persistence_type: "cookie",
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
        disable_session_recording: true,
        disable_surveys: true,
        advanced_disable_feature_flags: true,
        bootstrap: { distinctID: assignment.distinctId, isIdentifiedID: false },
      });
      initialized = true;
    }
    if (posthog.has_opted_out_capturing() || posthog.get_distinct_id() !== assignment.distinctId) return;
    // Keep service on each event: shared identity cookies also belong to the hosted app.
    const properties = { service: "bento-www", marketing_variant: assignment.variant, [`$feature/${MARKETING_FLAG}`]: assignment.variant, experiment_key: MARKETING_FLAG };
    const rendered = document.querySelector("[data-marketing-variant]")?.getAttribute("data-marketing-variant");
    if (pathname === "/" && rendered !== assignment.variant) return;
    if (pathname === "/") {
      const exposure = `${assignment.distinctId}:${assignment.variant}`;
      if (lastExposure !== exposure) {
        posthog.capture("$feature_flag_called", { ...properties, $feature_flag: MARKETING_FLAG, $feature_flag_response: assignment.variant });
        posthog.capture("marketing page viewed", properties);
        lastExposure = exposure;
      }
    }
    function captureSignupClick(event: MouseEvent) {
      if (event.type === "auxclick" && event.button !== 1) return;
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link || !isSignupDestination(link.href, signupUrl)) return;
      posthog.capture("marketing signup clicked", { ...properties, placement: link.closest("header") ? "header" : link.closest("footer, .final-cta, .m-bottom-cta") ? "footer" : link.closest(".pricing-card") ? "pricing" : "hero", path: pathname }, { transport: "sendBeacon" });
    }
    document.addEventListener("click", captureSignupClick);
    document.addEventListener("auxclick", captureSignupClick);
    return () => {
      document.removeEventListener("click", captureSignupClick);
      document.removeEventListener("auxclick", captureSignupClick);
    };
  }, [pathname, signupUrl]);
  return null;
}
