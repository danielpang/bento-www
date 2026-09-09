"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { PostHog } from "posthog-js";
import {
  isSignupDestination,
  MARKETING_ASSIGNMENT_COOKIE,
  MARKETING_FLAG,
  parseAssignment,
  type MarketingVariant,
} from "@/lib/marketing-experiment";

/** Every event carries this so the shared PostHog project can tell the site from the console. */
const SERVICE = "bento-www";

interface Assignment {
  variant: MarketingVariant;
  distinctId: string;
}

function readCookie(name: string) {
  const cookie = document.cookie.split("; ").find(value => value.startsWith(`${name}=`));
  try { return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : undefined; } catch { return undefined; }
}

/** Preview routes are internal review surfaces, never analytics. /control is the rewrite target, not a page a visitor sees at that path. */
function isInternal(pathname: string) {
  return pathname.startsWith("/preview") || pathname === "/control";
}

let client: Promise<PostHog> | null = null;
let lastPageview: string | null = null;
let lastExposure: string | null = null;

/**
 * posthog-js is loaded on first use, from an effect, so it is never part of
 * the script graph a page needs to hydrate. One client per page load; a
 * server-side experiment assignment, when there is one, seeds the identity so
 * exposure and the eventual signup belong to the same person.
 */
function loadPostHog(token: string, assignment: Assignment | null): Promise<PostHog> {
  client ??= import("posthog-js").then(({ default: posthog }) => {
    posthog.init(token, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      persistence: "localStorage+cookie",
      // Shared with app.usebento.ai, whose identify call merges this anonymous visitor into the account.
      cross_subdomain_cookie: true,
      opt_out_capturing_persistence_type: "cookie",
      autocapture: false,
      // Captured by hand below, so App Router navigations count as pageviews too.
      capture_pageview: false,
      capture_pageleave: true,
      disable_session_recording: true,
      disable_surveys: true,
      advanced_disable_feature_flags: true,
      ...(assignment ? { bootstrap: { distinctID: assignment.distinctId, isIdentifiedID: false } } : {}),
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
    if (!token || isInternal(pathname)) return;
    const experimentOn = process.env.NEXT_PUBLIC_MARKETING_EXPERIMENT_ENABLED === "true";
    const assignment = experimentOn ? parseAssignment(readCookie(MARKETING_ASSIGNMENT_COOKIE)) : null;
    let cancelled = false;
    let detach = () => {};

    void loadPostHog(token, assignment).then(posthog => {
      if (cancelled || posthog.has_opted_out_capturing()) return;

      const page = search ? `${pathname}?${search}` : pathname;
      if (lastPageview !== page) {
        posthog.capture("$pageview", { service: SERVICE });
        lastPageview = page;
      }

      // Experiment attribution only when the browser identity is the one the
      // server assigned, and never for a homepage that rendered another variant.
      let attributed = assignment && posthog.get_distinct_id() === assignment.distinctId ? assignment : null;
      if (attributed && pathname === "/") {
        const rendered = document.querySelector("[data-marketing-variant]")?.getAttribute("data-marketing-variant");
        if (rendered !== attributed.variant) attributed = null;
      }
      const properties = attributed
        ? { service: SERVICE, marketing_variant: attributed.variant, [`$feature/${MARKETING_FLAG}`]: attributed.variant, experiment_key: MARKETING_FLAG }
        : { service: SERVICE };
      if (attributed && pathname === "/") {
        const exposure = `${attributed.distinctId}:${attributed.variant}`;
        if (lastExposure !== exposure) {
          posthog.capture("$feature_flag_called", { ...properties, $feature_flag: MARKETING_FLAG, $feature_flag_response: attributed.variant });
          posthog.capture("marketing page viewed", properties);
          lastExposure = exposure;
        }
      }

      function captureSignupClick(event: MouseEvent) {
        if (event.type === "auxclick" && event.button !== 1) return;
        const link = event.target instanceof Element ? event.target.closest("a") : null;
        if (!link || !isSignupDestination(link.href, signupUrl)) return;
        const placement = link.closest("header") ? "header" : link.closest("footer, .final-cta, .m-bottom-cta") ? "footer" : link.closest(".pricing-card") ? "pricing" : "hero";
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
