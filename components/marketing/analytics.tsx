"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { PostHog } from "posthog-js";
import {
  isSignupDestination,
  MAC_DOWNLOAD_CLICKED,
  macDownloadBeacon,
  macDownloadLocation,
  macDownloadProperties,
  MARKETING_SERVICE,
  posthogDistinctId,
  posthogHasOptedOut,
  posthogPersistenceName,
  type MacDownloadProperties,
} from "@/lib/marketing-analytics";

let client: Promise<PostHog> | null = null;
let ready: PostHog | null = null;
let lastPageview: string | null = null;

/**
 * posthog-js is loaded on first use so it is never part of the script graph a
 * page needs to hydrate. One client is shared per page load. `ready` is set
 * from init's loaded callback, including when the pageview effect has already
 * been cancelled, so a download click can use the same client.
 */
function loadPostHog(token: string): Promise<PostHog> {
  client ??= import("posthog-js").then(({ default: posthog }) => {
    return new Promise<PostHog>((resolve, reject) => {
      try {
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
          loaded(instance) {
            // init's callback is typed as the public interface; the instance is the shared client.
            const loadedClient = instance as PostHog;
            ready = loadedClient;
            resolve(loadedClient);
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  });
  return client;
}

const configuredToken = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_POSTHOG_KEY : undefined;
if (configuredToken) void loadPostHog(configuredToken);

function storedDistinctId(token: string): string | null {
  try {
    return localStorage.getItem(posthogPersistenceName(token));
  } catch {
    return null;
  }
}

/**
 * The download click leaves the page for a DMG. Send one event, either through
 * the shared client or, if that chunk is still loading, a beacon the navigation
 * cannot cancel. Never both.
 */
function captureMacDownload(token: string, properties: MacDownloadProperties) {
  try {
    if (ready) {
      if (!ready.has_opted_out_capturing()) {
        ready.capture(MAC_DOWNLOAD_CLICKED, properties, { send_instantly: true, transport: "sendBeacon" });
      }
      return;
    }
    let cookie = "";
    try {
      cookie = document.cookie;
    } catch {
      cookie = "";
    }
    if (posthogHasOptedOut(cookie, token)) return;
    if (typeof navigator.sendBeacon !== "function") return;
    const beacon = macDownloadBeacon({
      token,
      distinctId: posthogDistinctId(cookie, storedDistinctId(token), token) ?? crypto.randomUUID(),
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      properties,
    });
    navigator.sendBeacon(beacon.url, new Blob([beacon.body], { type: "text/plain" }));
  } catch {
    // A missed event must not block the download navigation.
  }
}

export function MarketingAnalytics({ signupUrl }: { signupUrl: string | null }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? "";

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!token) return;
    let cancelled = false;

    void loadPostHog(token).then(posthog => {
      if (cancelled || posthog.has_opted_out_capturing()) return;

      const page = search ? `${pathname}?${search}` : pathname;
      if (lastPageview !== page) {
        posthog.capture("$pageview", { service: MARKETING_SERVICE });
        lastPageview = page;
      }
    });

    return () => {
      cancelled = true;
    };
  }, [pathname, search]);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!token) return;
    const projectToken = token;

    // Attached here, not after posthog-js loads. The library is a separate chunk,
    // and a click on the download anchors navigates away before that chunk can
    // finish. Waiting for it dropped every `mac download clicked`.
    function captureLinkClick(event: MouseEvent) {
      if (event.type === "auxclick" && event.button !== 1) return;
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link) return;
      const download = macDownloadProperties(link.href, window.location.origin, macDownloadLocation(link.getAttribute("data-location"), pathname, {
        nav: Boolean(link.closest("header, .marketing-menu")),
        hero: Boolean(link.closest(".hero-actions")),
        footer: Boolean(link.closest("footer")),
      }));
      if (download) {
        captureMacDownload(projectToken, download);
        return;
      }
      if (!ready || ready.has_opted_out_capturing()) return;
      if (!isSignupDestination(link.href, signupUrl)) return;
      const placement = link.closest("header") ? "header" : link.closest("footer, .final-cta, .marketing-faq") ? "footer" : link.closest(".pricing-card") ? "pricing" : "hero";
      ready.capture("marketing signup clicked", { service: MARKETING_SERVICE, placement, path: pathname }, { transport: "sendBeacon" });
    }
    document.addEventListener("click", captureLinkClick);
    document.addEventListener("auxclick", captureLinkClick);
    return () => {
      document.removeEventListener("click", captureLinkClick);
      document.removeEventListener("auxclick", captureLinkClick);
    };
  }, [pathname, signupUrl]);

  return null;
}
