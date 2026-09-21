"use client";

import { AppleLogo } from "@/components/apple-logo";
import { useEffect, useState } from "react";
import { browserMacArchitecture } from "@/lib/mac-architecture";
import type { MacArchitecture, MacRelease } from "@/lib/mac-releases";

const options = [
  { arch: "arm64", label: "Apple silicon", description: "For Macs with an Apple chip." },
  { arch: "x64", label: "Intel", description: "For Macs with an Intel processor." },
] as const;

export function MacDownloads({ release }: { release: MacRelease | null }) {
  const [suggestion, setSuggestion] = useState<MacArchitecture | null>(null);

  useEffect(() => {
    let active = true;
    void browserMacArchitecture().then((arch) => {
      if (active) setSuggestion(arch);
    });
    return () => { active = false; };
  }, []);

  return (
    <section aria-label="Mac downloads">
      <div className="mac-download-options">
        {options.map(({ arch, label, description }) => (
          <article className="mac-download-option" key={arch}>
            <h2>{label}</h2>
            <p>{description}</p>
            {release?.downloads[arch] ? (
              // Plain anchors avoid prefetching a route that starts a download.
              <a className="cta-link cta-link-primary" href={`/download/mac/${arch}`}>
                <AppleLogo />
                Download for {label}
              </a>
            ) : (
              <p className="mac-download-pending">Download unavailable</p>
            )}
          </article>
        ))}
      </div>
      <p className="mac-download-hint" aria-live="polite">
        {suggestion
          ? `Your browser suggests ${suggestion === "arm64" ? "Apple silicon" : "Intel"}. Check About This Mac if you are unsure.`
          : "Choose the version that matches your Mac. You can check your chip below."}
      </p>
    </section>
  );
}
