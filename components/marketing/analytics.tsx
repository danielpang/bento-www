"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { PostHog } from "posthog-js";
import { isSignupDestination } from "@/lib/marketing-analytics";

/** Every event carries this so the shared PostHog project can tell the site from the console. */
const SERVICE = "bento-www";

let client: Promise<PostHog> | null = null;
let lastPageview: string | null = null;

/**
 * posthog-js is loaded on first use, from an effect, so it is never part of
 * the script graph a page needs to hydrate. One client is shared per page load.
 */
function loadPostHog(token: string): Promise<PostHog> {
  client ??= import("posthog-js").then(({ default: posthog }) => {
    posthog.init(token, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      persistence: "localStorage+cookie",
      // Shared with app.usebento.ai, whose identify call merges this anonymous visitor into the account.
      // Cookie-wins is required: defaults stay 'unset', so the SDK would otherwise prefer
      // per-origin localStorage over the .usebento.ai identity cookie on app.usebento.ai.
      cross_subdomain_cookie: true,
      cookieWinsOnConflict: true,
      opt_out_capturing_persistence_type: "cookie",
      autocapture: false,
      // Captured by hand below, so App Router navigations count as pageviews too.
      capture_pageview: false,
      capture_pageleave: true,
      disable_session_recording: true,
      disable_surveys: true,
      advanced_disable_feature_flags: true,
    });
    return posthog;
  });
  return client;
}

export function MarketingAnalytics({ signupUrl }: { signupUrl: string | null }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? "";

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!token) return;
    let cancelled = false;
    let detach = () => {};

    void loadPostHog(token).then(posthog => {
      if (cancelled || posthog.has_opted_out_capturing()) return;

      const page = search ? `${pathname}?${search}` : pathname;
      if (lastPageview !== page) {
        posthog.capture("$pageview", { service: SERVICE });
        lastPageview = page;
      }

      const properties = { service: SERVICE };

      function captureSignupClick(event: MouseEvent) {
        if (event.type === "auxclick" && event.button !== 1) return;
        const link = event.target instanceof Element ? event.target.closest("a") : null;
        if (!link || !isSignupDestination(link.href, signupUrl)) return;
        const placement = link.closest("header") ? "header" : link.closest("footer, .final-cta, .marketing-faq") ? "footer" : link.closest(".pricing-card") ? "pricing" : "hero";
        posthog.capture("marketing signup clicked", { ...properties, placement, path: pathname }, { transport: "sendBeacon" });
      }
      document.addEventListener("click", captureSignupClick);
      document.addEventListener("auxclick", captureSignupClick);
      detach = () => {
        document.removeEventListener("click", captureSignupClick);
        document.removeEventListener("auxclick", captureSignupClick);
      };
    });

    return () => {
      cancelled = true;
      detach();
    };
  }, [pathname, search, signupUrl]);
  return null;
}
